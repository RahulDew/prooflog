import type { Context } from "hono";
import type { AppEnv } from "../config/env";
import { getDb } from "../connections/db";
import { sql } from "drizzle-orm";

export async function healthHandler(context: Context<AppEnv>) {
  let dbStatus = "up";
  let redisStatus = "up";
  let errorMsg: string | undefined = undefined;

  // 1. Probe the Postgres database using a lightweight SELECT 1 query
  try {
    const db = getDb(context.env.DATABASE_URL);
    await db.execute(sql`SELECT 1`);
  } catch (err: any) {
    dbStatus = "down";
    errorMsg = `Database connection failed: ${err.message}`;
  }

  // 2. Probe Redis configuration availability
  if (!context.env.REDIS_URL) {
    redisStatus = "down";
    const msg = "REDIS_URL is not configured in the environment";
    errorMsg = errorMsg ? `${errorMsg}; ${msg}` : msg;
  }

  const isHealthy = dbStatus === "up" && redisStatus === "up";

  return context.json(
    {
      success: isHealthy,
      data: {
        status: isHealthy ? "ok" : "degraded",
        service: "prooflog-api",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        details: {
          database: dbStatus,
          redis: redisStatus,
        },
      },
      ...(errorMsg ? { error: errorMsg } : {}),
    },
    isHealthy ? 200 : 503
  );
}
