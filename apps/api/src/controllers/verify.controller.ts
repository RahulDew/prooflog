import type { Context } from "hono";
import type { AppEnv } from "../config/env";
import { getDb } from "../connections/db";
import { verifyOrgChain } from "../services/audit.service";

export async function verifyHandler(c: Context<AppEnv>) {
  const db = getDb(c.env.DATABASE_URL);
  const organisationId = c.get("organisationId");

  const result = await verifyOrgChain(db, organisationId);

  return c.json({ success: true, data: result });
}
