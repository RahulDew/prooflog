import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc, asc, and, gt } from "drizzle-orm";
import { auditLogs } from "@prooflog/db";
import { computeHash, GENESIS_HASH } from "@prooflog/crypto";
import type {
  ProofLogConfig,
  IngestOptions,
  IngestResult,
  VerifyResult,
} from "./types";

export class ProofLog {
  private db: ReturnType<typeof drizzle>;
  private organisationId: string;

  constructor(config: ProofLogConfig) {
    if (!config.databaseUrl) throw new Error("databaseUrl is required");
    if (!config.organisationId) throw new Error("organisationId is required");
    const sql = neon(config.databaseUrl);
    this.db = drizzle(sql);
    this.organisationId = config.organisationId;
  }

  /**
   * Pushes a new audit log event directly to the database.
   * Handles concurrency retries internally.
   */
  async ingest(options: IngestOptions): Promise<IngestResult> {
    const maxRetries = 3;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const lastEntry = await this.db
          .select()
          .from(auditLogs)
          .where(eq(auditLogs.organisationId, this.organisationId))
          .orderBy(desc(auditLogs.sequence))
          .limit(1);

        const previousHash = lastEntry.length ? lastEntry[0].hash : GENESIS_HASH;
        const sequence = lastEntry.length ? lastEntry[0].sequence + 1 : 1;
        const createdAt = new Date().toISOString();

        const hash = computeHash(
          {
            organisationId: this.organisationId,
            sequence,
            action: options.action,
            actor: options.actor,
            target: options.target ?? null,
            metadata: options.metadata ?? null,
            createdAt,
          },
          previousHash,
        );

        await this.db.insert(auditLogs).values({
          organisationId: this.organisationId,
          sequence,
          action: options.action,
          actor: options.actor,
          target: options.target ?? null,
          metadata: options.metadata ?? null,
          hash,
          previousHash,
          createdAt: new Date(createdAt),
        });

        return { sequence, hash };
      } catch (error: any) {
        if (error.code === '23505' || error.message?.includes('23505') || error.message?.includes('unique constraint')) {
          if (attempt === maxRetries - 1) {
            throw new Error("Failed to ingest audit log due to high concurrency. Please try again.");
          }
          continue;
        }
        throw error;
      }
    }
    
    throw new Error("Unreachable");
  }

  /**
   * Triggers a cryptographic verification of the audit log chain for the organisation in batches.
   */
  async verify(): Promise<VerifyResult> {
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
            eq(auditLogs.organisationId, this.organisationId),
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
        }, entry.previousHash);

        if (recomputed !== entry.hash) {
          return {
            valid: false,
            totalEntries,
            tamperedAt: entry.sequence,
            reason: `Hash mismatch at sequence ${entry.sequence} — data tampered`,
          };
        }

        expectedPreviousHash = entry.hash;
        currentSequence = entry.sequence;
        totalEntries++;
      }
    }

    return { valid: true, totalEntries };
  }
}
