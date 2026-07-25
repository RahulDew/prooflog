import type { Context } from "hono";
import { and, eq, gt, lt, asc, desc } from "drizzle-orm";
import { auditLogs } from "@prooflog/db";
import type { AppEnv } from "../config/env";
import { getDb } from "../connections/db";
import { HttpStatus } from "../config/http-status";

export async function getEntriesHandler(context: Context<AppEnv>) {
  const db = getDb(context.env.DATABASE_URL);
  const organisationId = context.var.organisationId;

  if (!organisationId) {
    return context.json(
      { success: false, error: "Unauthorized: Missing organization ID" },
      HttpStatus.UNAUTHORIZED,
    );
  }

  const query = context.req.query();
  const limitParam = query.limit ? parseInt(query.limit, 10) : 50;
  const limitCount = isNaN(limitParam) ? 50 : Math.min(limitParam, 100);
  const cursorParam = query.cursor ? parseInt(query.cursor, 10) : undefined;
  const cursor = isNaN(cursorParam as any) ? undefined : cursorParam;
  const order = query.order === "asc" ? "asc" : "desc";
  const orderDirection = order === "asc" ? asc : desc;

  let cursorCondition = undefined;
  if (cursor !== undefined) {
    cursorCondition = order === "asc"
      ? gt(auditLogs.sequence, cursor)
      : lt(auditLogs.sequence, cursor);
  }

  const conditions = cursorCondition
    ? and(eq(auditLogs.organisationId, organisationId), cursorCondition)
    : eq(auditLogs.organisationId, organisationId);

  const results = await db
    .select({
      sequence: auditLogs.sequence,
      action: auditLogs.action,
      actor: auditLogs.actor,
      target: auditLogs.target,
      metadata: auditLogs.metadata,
      hash: auditLogs.hash,
      previousHash: auditLogs.previousHash,
      createdAt: auditLogs.createdAt,
    })
    .from(auditLogs)
    .where(conditions)
    .orderBy(orderDirection(auditLogs.sequence))
    .limit(limitCount + 1);

  const hasMore = results.length > limitCount;
  const data = hasMore ? results.slice(0, limitCount) : results;

  return context.json({
    success: true,
    data: {
      data,
      hasMore,
    },
  });
}
