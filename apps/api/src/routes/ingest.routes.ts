import { Hono } from "hono";
import type { AppEnv } from "../config/env";

import { validate } from "../middleware/validator.middleware";
import {
  IngestRequestSchema,
  BatchIngestRequestSchema,
} from "../schemas/ingest.schema";
import {
  ingestHandler,
  batchIngestHandler,
} from "../controllers/ingest.controller";
import { requireAuth } from "../middleware/auth.middleware";

const ingest = new Hono<AppEnv>();

ingest.post(
  "/",
  requireAuth("logs:write"),
  validate("json", IngestRequestSchema),
  ingestHandler,
);

ingest.post(
  "/batch",
  requireAuth("logs:write"),
  validate("json", BatchIngestRequestSchema),
  batchIngestHandler,
);

export default ingest;
