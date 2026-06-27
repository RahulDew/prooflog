import { computeHash, GENESIS_HASH } from "@prooflog/crypto";
import { desc, eq } from "drizzle-orm";
import { auditLogs } from "@prooflog/db";
import type { DbClient } from "../connections/db";

// Single typed input instead of 8 loose arguments
export interface BuildHashInput {
  organisationId: string;
  sequence: number;
  action: string;
  actor: unknown;
  target: unknown;
  metadata: unknown;
  createdAt: string;
  previousHash: string;
}

// Gets the last entry for an org — needed to continue the chain
export async function getChainTip(db: DbClient, organisationId: string) {
  const lastEntry = await db
    .select({
      sequence: auditLogs.sequence,
      hash: auditLogs.hash,
    })
    .from(auditLogs)
    .where(eq(auditLogs.organisationId, organisationId))
    .orderBy(desc(auditLogs.sequence))
    .limit(1);

  // First ever entry for this org — chain starts from genesis
  if (!lastEntry.length) {
    return { previousHash: GENESIS_HASH, sequence: 0 };
  }

  return {
    previousHash: lastEntry[0].hash,
    sequence: lastEntry[0].sequence,
  };
}

// Computes hash for a new entry using previous hash — this is the chain link
export function buildHash(input: BuildHashInput): string {
  return computeHash(
    {
      organisationId: input.organisationId,
      sequence: input.sequence,
      action: input.action,
      actor: input.actor,
      target: input.target,
      metadata: input.metadata,
      createdAt: input.createdAt,
    },
    input.previousHash,
  );
}
