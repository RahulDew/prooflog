import { eq, asc, and, gt } from "drizzle-orm";
import { auditLogs } from "@prooflog/db";
import { GENESIS_HASH, computeHash } from "@prooflog/crypto";
import type { DbClient } from "../connections/db";
import type { IngestRequest } from "../schemas/ingest.schema";
import { getChainTip, buildHash } from "./hash.service";

export async function ingestEvent(
  db: DbClient,
  organisationId: string,
  body: IngestRequest,
) {
  // Return cached result immediately if this request has already been processed.
  if (body.idempotencyKey) {
    const existing = await db
      .select()
      .from(auditLogs)
      .where(
        and(
          eq(auditLogs.organisationId, organisationId),
          eq(auditLogs.idempotencyKey, body.idempotencyKey)
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
      // Resolve current head of the ledger chain.
      const { previousHash, sequence: lastSequence } = await getChainTip(
        db,
        organisationId,
      );
 
      const sequence = lastSequence + 1;
      const createdAt = new Date().toISOString();
      const chainVersion = body.chainVersion ?? 1;
      const hashAlgorithm = body.hashAlgorithm ?? "sha256";
 
      // Link the new block to the preceding cryptographic hash.
      const hash = buildHash({
        organisationId,
        sequence,
        action: body.action,
        actor: body.actor,
        target: body.target ?? null,
        metadata: body.metadata ?? null,
        createdAt,
        previousHash,
        chainVersion,
        hashAlgorithm,
      });
 
      await db.insert(auditLogs).values({
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
 
      return { sequence, hash };
    } catch (error: any) {
      // Handle sequence conflicts (retry) and concurrent idempotency races (fallback return).
      const isUniqueViolation = error.code === '23505' || error.message?.includes('23505') || error.message?.includes('unique constraint');
      if (isUniqueViolation) {
        if (body.idempotencyKey) {
          const existing = await db
            .select()
            .from(auditLogs)
            .where(
              and(
                eq(auditLogs.organisationId, organisationId),
                eq(auditLogs.idempotencyKey, body.idempotencyKey)
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
}

export async function verifyOrgChain(db: DbClient, organisationId: string) {
  const batchSize = 1000;
  let hasMore = true;
  let currentSequence = 0;
  let totalEntries = 0;
  let expectedPreviousHash = GENESIS_HASH;

  while (hasMore) {
    // Process chain verification in chunked batches to protect memory allocation bounds.
    const batch = await db
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
}
