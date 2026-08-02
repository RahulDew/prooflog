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
import {
  ProofLogError,
  TimeoutError,
  NetworkError,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  ServerError,
} from "./errors";

export class ProofLog {
  private db?: ReturnType<typeof drizzle>;
  private apiKey?: string;
  private baseUrl: string;
  private timeout: number;
  private retry: { maxRetries: number; delay: number };

  constructor(config: ProofLogConfig) {
    if (!config.apiKey && !config.databaseUrl) {
      throw new Error("Either apiKey or databaseUrl is required");
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? "https://api.prooflog.dev";

    // Default request timeout is 10 seconds
    this.timeout = config.timeout ?? 10000;

    // Default transient retries is 3 attempts, starting with a 1-second delay
    this.retry = {
      maxRetries: config.retry?.maxRetries ?? 3,
      delay: config.retry?.delay ?? 1000,
    };

    if (config.databaseUrl) {
      const sql = neon(config.databaseUrl);
      this.db = drizzle(sql);
    }
  }

  /**
   * Safe request client that wraps native fetch with Timeout support.
   */
  private async requestWithTimeout(
    url: string,
    init: RequestInit,
  ): Promise<any> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorText = await response.text();
        const errorMessage = errorText || response.statusText;

        switch (response.status) {
          case 401:
            throw new AuthenticationError(
              `Authentication failed: ${errorMessage}`,
            );
          case 400:
            throw new ValidationError(
              `Invalid request payload: ${errorMessage}`,
            );
          case 429:
            throw new RateLimitError(`Rate limit exceeded: ${errorMessage}`);
          default:
            if (response.status >= 500) {
              throw new ServerError(
                `Server error returned: ${errorMessage}`,
                response.status,
              );
            }
            throw new ProofLogError(
              `Request failed with status ${response.status}: ${errorMessage}`,
              response.status,
            );
        }
      }

      const json = (await response.json()) as any;
      if (!json.success || !json.data) {
        throw new ProofLogError(
          json.error ?? "Malformed API response structure",
        );
      }

      return json.data;
    } catch (error: any) {
      clearTimeout(timer);

      if (error instanceof ProofLogError) {
        throw error;
      }
      if (error.name === "AbortError") {
        throw new TimeoutError(
          `Request to ${url} exceeded timeout limit of ${this.timeout}ms`,
        );
      }
      throw new NetworkError(`Network connection failure: ${error.message}`);
    }
  }

  /**
   * Wraps requestWithTimeout with an exponential backoff retry loop for transient failures.
   */
  private async requestWithRetry(url: string, init: RequestInit): Promise<any> {
    let lastError: any = null;

    for (let attempt = 0; attempt <= this.retry.maxRetries; attempt++) {
      try {
        return await this.requestWithTimeout(url, init);
      } catch (error: any) {
        lastError = error;

        // Do not retry client-side authentication or validation failures
        if (
          error instanceof AuthenticationError ||
          error instanceof ValidationError
        ) {
          throw error;
        }

        // Only retry if we haven't exhausted our retry limits
        if (attempt < this.retry.maxRetries) {
          const backoffDelay = this.retry.delay * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
          continue;
        }
      }
    }

    throw lastError;
  }

  /**
   * Pushes a new audit log event directly to the database or via the hosted API.
   * Handles concurrency retries internally when in database mode.
   */
  async ingest(
    organisationId: string,
    options: IngestOptions,
  ): Promise<IngestResult> {
    if (this.db) {
      if (options.idempotencyKey) {
        const existing = await this.db
          .select()
          .from(auditLogs)
          .where(
            and(
              eq(auditLogs.organisationId, organisationId),
              eq(auditLogs.idempotencyKey, options.idempotencyKey),
            ),
          )
          .limit(1);

        if (existing.length > 0) {
          return {
            received: true,
            status: "completed",
            idempotencyKey: options.idempotencyKey,
            sequence: existing[0].sequence,
            hash: existing[0].hash,
          };
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

          const previousHash = lastEntry.length
            ? lastEntry[0].hash
            : GENESIS_HASH;
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

          return {
            received: true,
            status: "completed",
            idempotencyKey: options.idempotencyKey ?? null,
            sequence,
            hash,
          };
        } catch (error: any) {
          const isUniqueViolation =
            error.code === "23505" ||
            error.message?.includes("23505") ||
            error.message?.includes("unique constraint");
          if (isUniqueViolation) {
            if (options.idempotencyKey) {
              const existing = await this.db
                .select()
                .from(auditLogs)
                .where(
                  and(
                    eq(auditLogs.organisationId, organisationId),
                    eq(auditLogs.idempotencyKey, options.idempotencyKey),
                  ),
                )
                .limit(1);
              if (existing.length > 0) {
                return {
                  received: true,
                  status: "completed",
                  idempotencyKey: options.idempotencyKey,
                  sequence: existing[0].sequence,
                  hash: existing[0].hash,
                };
              }
            }

            if (attempt === maxRetries - 1) {
              throw new Error(
                "Failed to ingest audit log due to high concurrency. Please try again.",
              );
            }
            continue;
          }
          throw error;
        }
      }

      throw new Error("Unreachable");
    } else {
      const result = await this.requestWithRetry(`${this.baseUrl}/v1/ingest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "X-Org-Id": organisationId,
        },
        body: JSON.stringify(options),
      });

      return result;
    }
  }

  /**
   * Pushes a batch of audit log events (up to 100 entries).
   */
  async ingestBatch(
    organisationId: string,
    events: IngestOptions[],
  ): Promise<any> {
    if (this.db) {
      const results = [];
      for (const event of events) {
        const res = await this.ingest(organisationId, event);
        results.push(res);
      }
      return {
        status: "completed",
        totalReceived: events.length,
        enqueuedCount: results.length,
        duplicatesSkipped: 0,
      };
    } else {
      const result = await this.requestWithRetry(
        `${this.baseUrl}/v1/ingest/batch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
            "X-Org-Id": organisationId,
          },
          body: JSON.stringify({ events }),
        },
      );

      return result;
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
              gt(auditLogs.sequence, currentSequence),
            ),
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

          const recomputed = computeHash(
            {
              organisationId: entry.organisationId,
              sequence: entry.sequence,
              action: entry.action,
              actor: entry.actor,
              target: entry.target,
              metadata: entry.metadata,
              createdAt: entry.createdAt.toISOString(),
              chainVersion: entry.chainVersion,
              hashAlgorithm: entry.hashAlgorithm,
            },
            entry.previousHash,
          );

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
      const result = await this.requestWithRetry(`${this.baseUrl}/v1/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "X-Org-Id": organisationId,
        },
      });

      return result;
    }
  }

  /**
   * Fetches audit log entries with optional pagination.
   */
  async getEntries(
    organisationId: string,
    options: GetEntriesOptions = {},
  ): Promise<GetEntriesResult> {
    if (this.db) {
      const limitCount = options.limit ?? 50;
      const orderDirection = options.order === "asc" ? asc : desc;

      let cursorCondition = undefined;
      if (options.cursor !== undefined) {
        cursorCondition =
          options.order === "asc"
            ? gt(auditLogs.sequence, options.cursor)
            : lt(auditLogs.sequence, options.cursor);
      }

      const conditions = cursorCondition
        ? and(eq(auditLogs.organisationId, organisationId), cursorCondition)
        : eq(auditLogs.organisationId, organisationId);

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
      const params = new URLSearchParams();
      if (options.limit !== undefined) {
        params.append("limit", options.limit.toString());
      }
      if (options.cursor !== undefined) {
        params.append("cursor", options.cursor.toString());
      }
      if (options.order !== undefined) {
        params.append("order", options.order);
      }

      const queryString = params.toString();
      const url = `${this.baseUrl}/v1/entries${queryString ? `?${queryString}` : ""}`;

      const result = await this.requestWithRetry(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "X-Org-Id": organisationId,
        },
      });

      return result;
    }
  }
}
