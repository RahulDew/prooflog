import type { Context } from "hono";
import type { AppEnv } from "../config/env";

export async function healthHandler(context: Context<AppEnv>) {
  return context.json({
    success: true,
    data: {
      status: "ok",
      service: "prooflog-api",
      version: "0.0.1",
      timestamp: new Date().toISOString(),
    },
  });
}
