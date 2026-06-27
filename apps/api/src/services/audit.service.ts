import { eq } from "drizzle-orm";
import { auditLogs } from "@prooflog/db";
import { verifyChain } from "@prooflog/crypto";
import type { DbClient } from "../connections/db";
import type { IngestRequest } from "../schemas/ingest.schema";
import { getChainTip, buildHash } from "./hash.service";

export async function ingestEvent(
  db: DbClient,
  organisationId: string,
  body: IngestRequest,
) {
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
}

export async function verifyOrgChain(db: DbClient, organisationId: string) {
  // Fetch all entries for this org
  const entries = await db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.organisationId, organisationId));

  // Recomputes every hash and checks chain links
  return verifyChain(
    entries.map((e) => ({
      organisationId: e.organisationId,
      sequence: e.sequence,
      action: e.action,
      actor: e.actor,
      target: e.target,
      metadata: e.metadata,
      createdAt: e.createdAt.toISOString(),
      hash: e.hash,
      previousHash: e.previousHash,
    })),
  );
}
