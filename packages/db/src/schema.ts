import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  bigint,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";

export const organisations = pgTable("organisations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  plan: text("plan").notNull().default("free"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});



// Audit log entries — hash chain yahan store hoti hai
export const auditLogs = pgTable("audit_logs", {
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  unique("audit_logs_org_sequence_idx").on(t.organisationId, t.sequence)
]);
