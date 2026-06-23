import { pgTable, uuid, text, timestamp, boolean, bigint, jsonb} from "drizzle-orm/pg-core";

export const organisations = pgTable("organisations", {
    id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  plan: text('plan').notNull().default('free'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  organisationId: uuid('organisation_id')
    .notNull()
    .references(() => organisations.id),
  keyHash: text('key_hash').notNull().unique(),
  name: text('name').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// Audit log entries — hash chain yahan store hoti hai
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  organisationId: uuid('organisation_id')
    .notNull()
    .references(() => organisations.id),
  sequence: bigint('sequence', { mode: 'number' }).notNull(),
  action: text('action').notNull(),
  actor: jsonb('actor').notNull(),
  target: jsonb('target'),
  metadata: jsonb('metadata'),
  hash: text('hash').notNull(),
  previousHash: text('previous_hash').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})