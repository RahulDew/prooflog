import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc, asc, and, gt, lt } from "drizzle-orm";
import { auditLogs } from "@prooflog/db";
import { computeHash, GENESIS_HASH } from "@prooflog/crypto";
import type {
  ProofLogConfig,
  IngestOptions,
  IngestResult,
  VerifyResult,
  GetEntriesOptions,
  GetEntriesResult,
} from "./types";

export class ProofLog {
  private db?: ReturnType<typeof drizzle>;
  private apiKey?: string;
  private baseUrl: string;

  constructor(config: ProofLogConfig) {
    if (!config.apiKey && !config.databaseUrl) {
      throw new Error("Either apiKey or databaseUrl is required");
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? "https://api.prooflog.dev";
    
    if (config.databaseUrl) {
      const sql = neon(config.databaseUrl);
      this.db = drizzle(sql);
    }
  }

  /**
   * Pushes a new audit log event directly to the database or via the hosted API.
   * Handles concurrency retries internally when in database mode.
   */
  async ingest(organisationId: string, options: IngestOptions): Promise<IngestResult> {
    if (this.db) {
      // Check if this idempotency key was already ingested to return original result
      if (options.idempotencyKey) {
        const existing = await this.db
          .select()
          .from(auditLogs)
          .where(
            and(
              eq(auditLogs.organisationId, organisationId),
              eq(auditLogs.idempotencyKey, options.idempotencyKey)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          return { sequence: existing[0].sequence, hash: existing[0].hash };
        }
      }

      const maxRetries = 3;
      
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const lastEntry = await this.db
            .select()
            .from(auditLogs)
            .where(eq(auditLogs.organisationId, organisationId))
            .orderBy(desc(auditLogs.sequence))
            .limit(1);

          const previousHash = lastEntry.length ? lastEntry[0].hash : GENESIS_HASH;
          const sequence = lastEntry.length ? lastEntry[0].sequence + 1 : 1;
          const createdAt = new Date().toISOString();
          const chainVersion = options.chainVersion ?? 1;
          const hashAlgorithm = options.hashAlgorithm ?? "sha256";

          const hash = computeHash(
            {
              organisationId,
              sequence,
              action: options.action,
              actor: options.actor,
              target: options.target ?? null,
              metadata: options.metadata ?? null,
              createdAt,
              chainVersion,
              hashAlgorithm,
            },
            previousHash,
          );

          await this.db.insert(auditLogs).values({
            organisationId,
            sequence,
            action: options.action,
            actor: options.actor,
            target: options.target ?? null,
            metadata: options.metadata ?? null,
            hash,
            previousHash,
            idempotencyKey: options.idempotencyKey ?? null,
            chainVersion,
            hashAlgorithm,
            createdAt: new Date(createdAt),
          });

          return { sequence, hash };
        } catch (error: any) {
          const isUniqueViolation = error.code === '23505' || error.message?.includes('23505') || error.message?.includes('unique constraint');
          if (isUniqueViolation) {
            if (options.idempotencyKey) {
              const existing = await this.db
                .select()
                .from(auditLogs)
                .where(
                  and(
                    eq(auditLogs.organisationId, organisationId),
                    eq(auditLogs.idempotencyKey, options.idempotencyKey)
                  )
                )
                .limit(1);
              if (existing.length > 0) {
                return { sequence: existing[0].sequence, hash: existing[0].hash };
              }
            }

            if (attempt === maxRetries - 1) {
              throw new Error("Failed to ingest audit log due to high concurrency. Please try again.");
            }
            continue;
          }
          throw error;
        }
      }
      
      throw new Error("Unreachable");
    } else {
      const response = await fetch(`${this.baseUrl}/v1/ingest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
          "X-Org-Id": organisationId,
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to ingest log: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ""}`);
      }

      const json = (await response.json()) as any;
      if (!json.success || !json.data) {
        throw new Error(json.error ?? "Failed to ingest log: unknown API error");
      }

      return json.data;
    }
  }

  /**
   * Triggers a cryptographic verification of the audit log chain.
   */
  async verify(organisationId: string): Promise<VerifyResult> {
    if (this.db) {
      const batchSize = 1000;
      let hasMore = true;
      let currentSequence = 0;
      let totalEntries = 0;
      let expectedPreviousHash = GENESIS_HASH;

      while (hasMore) {
        const batch = await this.db
          .select()
          .from(auditLogs)
          .where(
            and(
              eq(auditLogs.organisationId, organisationId),
              gt(auditLogs.sequence, currentSequence)
            )
          )
          .orderBy(asc(auditLogs.sequence))
          .limit(batchSize);

        if (batch.length === 0) {
          hasMore = false;
          break;
        }

        for (const entry of batch) {
          if (entry.previousHash !== expectedPreviousHash) {
            return {
              valid: false,
              totalEntries,
              tamperedAt: entry.sequence,
              reason: `Chain broken at sequence ${entry.sequence}`,
              expectedHash: expectedPreviousHash,
              actualHash: entry.previousHash,
              failedTimestamp: entry.createdAt.toISOString(),
            };
          }

          const recomputed = computeHash({
            organisationId: entry.organisationId,
            sequence: entry.sequence,
            action: entry.action,
            actor: entry.actor,
            target: entry.target,
            metadata: entry.metadata,
            createdAt: entry.createdAt.toISOString(),
            chainVersion: entry.chainVersion,
            hashAlgorithm: entry.hashAlgorithm,
          }, entry.previousHash);

          if (recomputed !== entry.hash) {
            return {
              valid: false,
              totalEntries,
              tamperedAt: entry.sequence,
              reason: `Hash mismatch at sequence ${entry.sequence} — data tampered`,
              expectedHash: recomputed,
              actualHash: entry.hash,
              failedTimestamp: entry.createdAt.toISOString(),
            };
          }

          expectedPreviousHash = entry.hash;
          currentSequence = entry.sequence;
          totalEntries++;
        }
      }

      return { valid: true, totalEntries };
    } else {
      const response = await fetch(`${this.baseUrl}/v1/verify`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "X-Org-Id": organisationId,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to verify chain: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ""}`);
      }

      const json = (await response.json()) as any;
      if (!json.success || !json.data) {
        throw new Error(json.error ?? "Failed to verify chain: unknown API error");
      }

      return json.data;
    }
  }

  /**
   * Fetches audit log entries with optional pagination.
   */
  async getEntries(
    organisationId: string,
    options: GetEntriesOptions = {}
  ): Promise<GetEntriesResult> {
    if (this.db) {
      const limitCount = options.limit ?? 50;
      const orderDirection = options.order === "asc" ? asc : desc;
      
      // Default cursor behavior:
      // If desc: we want sequences LESS than cursor
      // If asc: we want sequences GREATER than cursor
      let cursorCondition = undefined;
      if (options.cursor !== undefined) {
        cursorCondition = options.order === "asc" 
          ? gt(auditLogs.sequence, options.cursor)
          : lt(auditLogs.sequence, options.cursor);
      }

      const conditions = cursorCondition 
        ? and(eq(auditLogs.organisationId, organisationId), cursorCondition)
        : eq(auditLogs.organisationId, organisationId);

      // Fetch limit + 1 to determine if there are more pages
      const results = await this.db
        .select({
          sequence: auditLogs.sequence,
          action: auditLogs.action,
          actor: auditLogs.actor,
          target: auditLogs.target,
          metadata: auditLogs.metadata,
          hash: auditLogs.hash,
          previousHash: auditLogs.previousHash,
          createdAt: auditLogs.createdAt,
        })
        .from(auditLogs)
        .where(conditions)
        .orderBy(orderDirection(auditLogs.sequence))
        .limit(limitCount + 1);

      const hasMore = results.length > limitCount;
      const data = hasMore ? results.slice(0, limitCount) : results;

      return {
        data: data as GetEntriesResult["data"],
        hasMore,
      };
    } else {
      throw new Error("getEntries is not yet supported in hosted API mode. Please configure databaseUrl.");
    }
  }
}
