import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  bigint,
} from "drizzle-orm/pg-core";
import { DbMode } from "@prooflog/enums";

// Define the native PostgreSQL enum type using uppercase values
export const dbModeEnum = pgEnum("db_mode", [DbMode.HOSTED, DbMode.BYODB]);

export const organisations = pgTable("organisations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  plan: text("plan").notNull().default("free"),
  dbMode: dbModeEnum("db_mode").notNull().default(DbMode.HOSTED),
  encryptedConnectionUrl: text("encrypted_connection_url"),
  kmsIv: text("kms_iv"),
  // Tip Anchors (Centralized security checkpoints to prevent history rewrite attacks)
  lastSealedHash: text("last_sealed_hash"),
  lastSealedSequence: bigint("last_sealed_sequence", { mode: "number" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
