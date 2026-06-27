import { eq } from "drizzle-orm";
import { apiKeys } from "@prooflog/db";
import type { DbClient } from "../connections/db";

// Returns key record if valid and active, null otherwise
export async function validateApiKey(db: DbClient, rawKey: string) {
  const record = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.keyHash, rawKey))
    .limit(1);

  if (!record.length || !record[0].isActive) {
    return null;
  }

  return record[0];
}

// Updates lastUsedAt timestamp — called after successful auth
export async function markKeyUsed(db: DbClient, keyId: string) {
  await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, keyId));
}
