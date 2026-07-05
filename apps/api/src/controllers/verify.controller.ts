import type { Context } from "hono";
import type { AppEnv } from "../config/env";
import { getDb } from "../connections/db";
import { verifyOrgChain } from "../services/audit.service";
import { HttpStatus } from "../config/http-status";

export async function verifyHandler(context: Context<AppEnv>) {
  const db = getDb(context.env.DATABASE_URL);

  const organisationId = context.var.organisationId;
  if (!organisationId) {
    return context.json(
      { success: false, error: "Unauthorized: Missing organization ID" },
      HttpStatus.UNAUTHORIZED,
    );
  }

  const result = await verifyOrgChain(db, organisationId);

  return context.json({ success: true, data: result });
}
