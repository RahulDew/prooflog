import { createMiddleware } from "hono/factory";
import type { AppEnv } from "../config/env";
import { HttpStatus } from "../config/http-status";

export const errorMiddleware = createMiddleware<AppEnv>(
  async (context, next) => {
    try {
      await next();
    } catch (err) {
      // Log full error details
      console.error(
        "[ProofLog Error]",
        JSON.stringify(err, Object.getOwnPropertyNames(err)),
      );
      return context.json(
        {
          success: false,
          error: "Internal server error",
          // Temporary — remove before deploy
          debug: err instanceof Error ? err.message : String(err),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  },
);
