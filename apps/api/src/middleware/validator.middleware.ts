import { zValidator } from "@hono/zod-validator";
import type { ZodSchema } from "zod";

export const validate = (
  target: "json" | "query" | "param" | "header",
  schema: ZodSchema,
) =>
  zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          message: "Invalid request",
          errors: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        422,
      );
    }
  });
