import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

const schemaFilesList = [
  "./src/db/schema/api_keys.ts",
  "./src/db/schema/audit_logs.ts",
  "./src/db/schema/organisations.ts",
];

export default defineConfig({
  schema: schemaFilesList,
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
});
