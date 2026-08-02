import { createMiddleware } from "hono/factory";
import type { AppEnv } from "../config/env";
import { HttpStatus } from "../config/http-status";

export interface RateLimitConfig {
  windowMs?: number; // Window size in milliseconds (default: 60,000ms = 1 minute)
  maxRequests?: number; // Max requests allowed per window (default: 100)
}

// In-memory sliding window cache for rate-limiting
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Resets the in-memory rate limiter store (useful for clean unit testing isolation).
 */
export function resetRateLimitStore(): void {
  rateLimitStore.clear();
}

/**
 * High-performance sliding-window rate-limiting middleware for Hono.
 * Injects standard HTTP headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)
 * and enforces HTTP 429 Too Many Requests when request limits are exceeded.
 */
export function rateLimit(config: RateLimitConfig = {}) {
  const windowMs = config.windowMs ?? 60_000;
  const maxRequests = config.maxRequests ?? 100;

  return createMiddleware<AppEnv>(async (context, next) => {
    // 1. Identify client key: organisationId from auth context, or fallback to client IP
    const organisationId = context.get("organisationId");
    const ip =
      context.req.header("cf-connecting-ip") ||
      context.req.header("x-forwarded-for") ||
      "anonymous";

    const clientKey = organisationId ? `org:${organisationId}` : `ip:${ip}`;

    const now = Date.now();
    let record = rateLimitStore.get(clientKey);

    if (!record || now >= record.resetAt) {
      record = {
        count: 0,
        resetAt: now + windowMs,
      };
    }

    record.count += 1;
    rateLimitStore.set(clientKey, record);

    const remaining = Math.max(0, maxRequests - record.count);
    const resetTimeSeconds = Math.ceil(record.resetAt / 1000);

    // 2. Attach standard rate-limit headers
    context.header("X-RateLimit-Limit", maxRequests.toString());
    context.header("X-RateLimit-Remaining", remaining.toString());
    context.header("X-RateLimit-Reset", resetTimeSeconds.toString());

    // 3. Enforce 429 Too Many Requests if exceeded
    if (record.count > maxRequests) {
      return context.json(
        {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await next();
  });
}
