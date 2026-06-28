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
  const maxRetries = 3;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Step 1 — get last hash and sequence number for this org
      const { previousHash, sequence: lastSequence } = await getChainTip(
        db,
        organisationId,
      );

      const sequence = lastSequence + 1;
      const createdAt = new Date().toISOString();

      // Step 2 — compute new hash linking to previous
      const hash = buildHash({
        organisationId,
        sequence,
        action: body.action,
        actor: body.actor,
        target: body.target ?? null,
        metadata: body.metadata ?? null,
        createdAt,
        previousHash,
      });

      // Step 3 — write to DB
      await db.insert(auditLogs).values({
        organisationId,
        sequence,
        action: body.action,
        actor: body.actor,
        target: body.target ?? null,
        metadata: body.metadata ?? null,
        hash,
        previousHash,
        createdAt: new Date(createdAt),
      });

      return { sequence, hash };
    } catch (error: any) {
      // Check for unique constraint violation (Postgres error code 23505)
      // This happens if a race condition occurred and another request took the sequence.
      if (error.code === '23505' || error.message?.includes('23505') || error.message?.includes('unique constraint')) {
        if (attempt === maxRetries - 1) {
          throw new Error("Failed to ingest audit log due to high concurrency. Please try again.");
        }
        // Retry
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
    // Fetch in batches to prevent Out-Of-Memory (OOM) on Cloudflare Workers
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
