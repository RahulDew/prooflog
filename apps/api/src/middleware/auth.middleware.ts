import { createMiddleware } from "hono/factory";
import { eq } from "drizzle-orm";
import { apiKeys } from "@prooflog/db";
import type { AppEnv } from "../config/env";
import { getDb } from "../connections/db";
import { HttpStatus } from "../config/http-status";

/**
 * Computes a SHA-256 hex digest of the raw API key for matching against the hashed db record.
 * Uses edge-compatible Web Crypto API.
 */
async function hashApiKey(key: string): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
  return Array.from(new Uint8Array(hashBuffer), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Reusable authentication middleware to protect Hono routes with scoped API keys.
 *
 * It extracts the Bearer token, hashes it, checks the database for an active key,
 * asserts the presence of the required scope, and populates the request context.
 *
 * @param requiredScope The permission scope required (e.g. 'logs:write', 'logs:verify')
 */
export function requireAuth(requiredScope: string) {
  return createMiddleware<AppEnv>(async (context, next) => {
    const authHeader = context.req.header("Authorization");
    if (!authHeader) {
      return context.json(
        { success: false, error: "Missing Authorization header" },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
      return context.json(
        { success: false, error: "Malformed Authorization header" },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = parts[1];
    const hashedKey = await hashApiKey(token);

    const db = getDb(context.env.DATABASE_URL);
    const keyRecords = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.hashedKey, hashedKey))
      .limit(1);

    if (keyRecords.length === 0) {
      return context.json(
        { success: false, error: "Invalid API key" },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const keyRecord = keyRecords[0];

    if (keyRecord.status !== "active") {
      return context.json(
        { success: false, error: "API key has been revoked" },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (keyRecord.expiresAt && new Date(keyRecord.expiresAt) < new Date()) {
      return context.json(
        { success: false, error: "API key has expired" },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const scopes = (keyRecord.scopes || []) as string[];
    if (!scopes.includes(requiredScope)) {
      return context.json(
        {
          success: false,
          error: `Forbidden: API key lacks required scope ${requiredScope}`,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // Set properties downstream
    context.set("organisationId", keyRecord.organisationId);
    context.set("scopes", scopes);

    await next();
  });
}
