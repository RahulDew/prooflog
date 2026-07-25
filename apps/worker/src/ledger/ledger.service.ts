import { Injectable, Logger } from '@nestjs/common';
import { DrizzleConnection } from '../database/database.provider';
import { eq, desc, and } from 'drizzle-orm';
import { auditLogs } from '@prooflog/db';
import { computeHash, GENESIS_HASH } from '@prooflog/crypto';

@Injectable()
export class LedgerService {
  private readonly logger = new Logger(LedgerService.name);

  constructor(
    private readonly db: DrizzleConnection,
  ) {}

  /**
   * Appends an audit log entry cryptographically.
   * Handles duplicate detection and automatic concurrency retries under database conflicts.
   */
  async appendLog(
    organisationId: string,
    body: any,
  ): Promise<{ sequence: number; hash: string }> {
    // 1. Double check idempotency key in DB
    if (body.idempotencyKey) {
      const existing = await this.db
        .select()
        .from(auditLogs)
        .where(
          and(
            eq(auditLogs.organisationId, organisationId),
            eq(auditLogs.idempotencyKey, body.idempotencyKey),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        this.logger.log(
          `Idempotency duplicate detected for key "${body.idempotencyKey}". Returning existing entry metadata.`,
        );
        return { sequence: existing[0].sequence, hash: existing[0].hash };
      }
    }

    // 2. Core ledger sequencing execution with concurrency retry loop
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
        const chainVersion = body.chainVersion ?? 1;
        const hashAlgorithm = body.hashAlgorithm ?? 'sha256';

        // Cryptographically hash the block
        const hash = computeHash(
          {
            organisationId,
            sequence,
            action: body.action,
            actor: body.actor,
            target: body.target ?? null,
            metadata: body.metadata ?? null,
            createdAt,
            chainVersion,
            hashAlgorithm,
          },
          previousHash,
        );

        // Store ledger block row
        await this.db.insert(auditLogs).values({
          organisationId,
          sequence,
          action: body.action,
          actor: body.actor,
          target: body.target ?? null,
          metadata: body.metadata ?? null,
          hash,
          previousHash,
          idempotencyKey: body.idempotencyKey ?? null,
          chainVersion,
          hashAlgorithm,
          createdAt: new Date(createdAt),
        });

        this.logger.log(
          `Successfully appended ledger block: sequence ${sequence}, hash ${hash}`,
        );
        return { sequence, hash };
      } catch (error: any) {
        // Handle postgres unique constraint (concurrency check)
        const isUniqueViolation =
          error.code === '23505' ||
          error.message?.includes('23505') ||
          error.message?.includes('unique constraint');

        if (isUniqueViolation) {
          this.logger.warn(
            `Database sequence conflict detected on attempt ${attempt + 1}. Retrying ledger computation...`,
          );
          if (attempt === maxRetries - 1) {
            throw new Error(
              'Failed to process audit log due to high concurrency lock conflicts.',
            );
          }
          continue;
        }
        throw error;
      }
    }
    throw new Error('Unreachable');
  }
}
