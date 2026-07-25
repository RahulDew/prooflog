import { Hono } from "hono";
import type { AppEnv } from "../config/env";
import { getEntriesHandler } from "../controllers/entries.controller";
import { requireAuth } from "../middleware/auth.middleware";

const entries = new Hono<AppEnv>();

entries.get("/", requireAuth("logs:read"), getEntriesHandler);

export default entries;
