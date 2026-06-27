import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export function getDb(databaseUrl: string) {
  const sql = neon(databaseUrl);
  console.log(sql);
  return drizzle(sql);
}

export type DbClient = ReturnType<typeof getDb>;
