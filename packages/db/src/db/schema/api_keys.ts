import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { organisations } from "./organisations";
import { ApiKeyStatus } from "@prooflog/enums";

// API Keys table mapping org identifiers and credentials scopes
export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  hashedKey: text("hashed_key").notNull().unique(),
  prefix: text("prefix").notNull().default("pl_live_"),
  name: text("name"),
  scopes: jsonb("scopes").$type<string[]>().notNull().default([]),
  status: text("status").notNull().default(ApiKeyStatus.ACTIVE), // Defaulting to uppercase "ACTIVE"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
});
