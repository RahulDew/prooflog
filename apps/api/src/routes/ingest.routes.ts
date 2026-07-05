import { Hono } from "hono";
import type { AppEnv } from "../config/env";

import { validate } from "../middleware/validator.middleware";
import { IngestRequestSchema } from "../schemas/ingest.schema";
import { ingestHandler } from "../controllers/ingest.controller";
import { requireAuth } from "../middleware/auth.middleware";

const ingest = new Hono<AppEnv>();

ingest.post(
  "/",
  requireAuth("logs:write"),
  validate("json", IngestRequestSchema),
  ingestHandler,
);

export default ingest;
