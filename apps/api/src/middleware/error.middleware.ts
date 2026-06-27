import { createMiddleware } from "hono/factory";
import type { AppEnv } from "../config/env";

export const errorMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  try {
    await next();
  } catch (err) {
    console.error("[ProofLog Error]", err);
    return c.json(
      {
        success: false,
        error: "Internal server error",
      },
      500,
    );
  }
});
