import type { Context } from "hono";
import type { AppEnv } from "../config/env";
import type { IngestRequest } from "../schemas/ingest.schema";
import { getDb } from "../connections/db";
import { ingestEvent } from "../services/audit.service";
import { HttpStatus } from "../config/http-status";

// Define a specialized Context type that registers the validated JSON schema payload type
type IngestContext = Context<AppEnv, "/", { out: { json: IngestRequest } }>;

export async function ingestHandler(context: IngestContext) {
  const db = getDb(context.env.DATABASE_URL);

  const organisationId = context.var.organisationId;
  if (!organisationId) {
    return context.json(
      { success: false, error: "Unauthorized: Missing organization ID" },
      HttpStatus.UNAUTHORIZED,
    );
  }

  // Retrieve the validated JSON body without any type bypasses or 'as never' casts
  const body = context.req.valid("json");

  const result = await ingestEvent(db, organisationId, body);

  return context.json(
    {
      success: true,
      data: {
        received: true,
        sequence: result.sequence,
        hash: result.hash,
      },
    },
    HttpStatus.ACCEPTED,
  );
}
