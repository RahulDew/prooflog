import { zValidator } from "@hono/zod-validator";
import type { ZodSchema } from "zod";
import { HttpStatus } from "../config/http-status";

export const validate = (
  target: "json" | "query" | "param" | "header",
  schema: ZodSchema,
) =>
  zValidator(target, schema, (result, context) => {
    if (!result.success) {
      return context.json(
        {
          success: false,
          message: "Invalid request",
          errors: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  });
