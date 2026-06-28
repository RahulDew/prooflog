import { createMiddleware } from "hono/factory";
import type { AppEnv } from "../config/env";

export const errorMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  try {
    await next();
  } catch (err) {
    // Log full error details
    console.error(
      "[ProofLog Error]",
      JSON.stringify(err, Object.getOwnPropertyNames(err)),
    );
    return c.json(
      {
        success: false,
        error: "Internal server error",
        // Temporary — remove before deploy
        debug: err instanceof Error ? err.message : String(err),
      },
      500,
    );
  }
});
