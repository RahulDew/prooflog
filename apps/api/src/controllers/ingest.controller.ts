import type { Context } from "hono";
import type { AppEnv } from "../config/env";
import type { IngestRequest } from "../schemas/ingest.schema";
import { getDb } from "../connections/db";
import { ingestEvent } from "../services/audit.service";

export async function ingestHandler(c: Context<AppEnv>) {
  const db = getDb(c.env.DATABASE_URL);
  const organisationId = c.get("organisationId");

  // body is already validated by zValidator in the route — safe to cast
  const body = c.req.valid("json" as never) as IngestRequest;

  const result = await ingestEvent(db, organisationId, body);

  return c.json(
    {
      success: true,
      data: {
        received: true,
        sequence: result.sequence,
        hash: result.hash,
      },
    },
    202,
  );
}
