import {
  pgTable,
  uuid,
  text,
  timestamp,
  bigint,
  jsonb,
  unique,
  integer,
} from "drizzle-orm/pg-core";
import { organisations } from "./organisations";

// Audit log entries — stores sequential cryptographic blocks
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organisationId: uuid("organisation_id")
      .notNull()
      .references(() => organisations.id),
    sequence: bigint("sequence", { mode: "number" }).notNull(),
    action: text("action").notNull(),
    actor: jsonb("actor").notNull(),
    target: jsonb("target"),
    metadata: jsonb("metadata"),
    hash: text("hash").notNull(),
    previousHash: text("previous_hash").notNull(),
    idempotencyKey: text("idempotency_key"),
    chainVersion: integer("chain_version").notNull().default(1),
    hashAlgorithm: text("hash_algorithm").notNull().default("sha256"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    unique("audit_logs_org_sequence_idx").on(t.organisationId, t.sequence),
    unique("audit_logs_org_idempotency_idx").on(
      t.organisationId,
      t.idempotencyKey,
    ),
  ],
);
