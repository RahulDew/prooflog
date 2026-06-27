import { createMiddleware } from "hono/factory";
import { eq } from "drizzle-orm";
import { apiKeys } from "@prooflog/db";
import { getDb } from "../connections/db";
import type { AppEnv } from "../config/env";

export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json(
      { success: false, error: "Missing or invalid Authorization header" },
      401,
    );
  }

  const apiKey = authHeader.replace("Bearer ", "").trim();

  if (!apiKey) {
    return c.json({ success: false, error: "API key is empty" }, 401);
  }

  const db = getDb(c.env.DATABASE_URL);

  const keyRecord = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.keyHash, apiKey))
    .limit(1);

  if (!keyRecord.length || !keyRecord[0].isActive) {
    return c.json(
      { success: false, error: "Invalid or inactive API key" },
      401,
    );
  }

  c.set("organisationId", keyRecord[0].organisationId);

  await next();
});
