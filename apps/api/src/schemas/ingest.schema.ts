import { z } from "zod";

export const IngestRequestSchema = z.object({
  // "user.login", "billing.updated" — resource.verb format
  action: z
    .string()
    .min(1, "action is required")
    .regex(
      /^[a-z]+(\.[a-z]+)+$/,
      "action must be format: resource.verb e.g. user.login",
    ),

  actor: z.record(z.string(), z.unknown()).refine((val) => "id" in val, {
    message: "actor must have an id field",
  }),

  target: z.record(z.string(), z.unknown()).optional(),

  metadata: z.record(z.string(), z.unknown()).optional(),

  idempotencyKey: z.string().optional(),

  chainVersion: z.number().int().min(1).optional(),

  hashAlgorithm: z.enum(["sha256", "sha512", "sha384"]).optional(),
});

// Schema se automatically TypeScript type ban jaati hai
export type IngestRequest = z.infer<typeof IngestRequestSchema>;
