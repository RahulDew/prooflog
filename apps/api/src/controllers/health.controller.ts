import type { Context } from "hono";
import type { AppEnv } from "../config/env";

export async function healthHandler(c: Context<AppEnv>) {
  return c.json({
    success: true,
    data: {
      status: "ok",
      service: "prooflog-api",
      version: "0.0.1",
      timestamp: new Date().toISOString(),
    },
  });
}
