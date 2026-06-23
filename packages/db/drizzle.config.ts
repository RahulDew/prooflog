import {defineConfig} from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL is not set')

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle", 
  dialect: "postgresql",
  dbCredentials: {url},
});