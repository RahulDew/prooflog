import type { Context } from "hono";
import { and, eq } from "drizzle-orm";
import { auditLogs } from "@prooflog/db";
import { Queue } from "bullmq";
import type { AppEnv } from "../config/env";
import type { IngestRequest } from "../schemas/ingest.schema";
import { getDb } from "../connections/db";
import { HttpStatus } from "../config/http-status";

type IngestContext = Context<AppEnv, "/", { out: { json: IngestRequest } }>;

// Module-level cache to keep the Redis connection alive between requests
let auditLogQueue: Queue | null = null;

function getQueue(redisUrl: string) {
  if (!auditLogQueue) {
    auditLogQueue = new Queue("audit-logs", {
      connection: {
        url: redisUrl,
      },
    });
  }

  return auditLogQueue;
}

export async function ingestHandler(context: IngestContext) {
  const db = getDb(context.env.DATABASE_URL);
  const organisationId = context.var.organisationId;

  if (!organisationId) {
    return context.json(
      { success: false, error: "Unauthorized: Missing organization ID" },
      HttpStatus.UNAUTHORIZED,
    );
  }

  const body = context.req.valid("json");

  // 1. Double check idempotency in DB before enqueuing to prevent duplicates.
  if (body.idempotencyKey) {
    const existing = await db
      .select()
      .from(auditLogs)
      .where(
        and(
          eq(auditLogs.organisationId, organisationId),
          eq(auditLogs.idempotencyKey, body.idempotencyKey),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      return context.json(
        {
          success: true,
          data: {
            received: true,
            status: "completed",
            sequence: existing[0].sequence,
            hash: existing[0].hash,
          },
        },
        HttpStatus.ACCEPTED,
      );
    }
  }

  // 2. Enqueue the ingestion job into BullMQ
  const redisUrl = context.env.REDIS_URL;

  try {
    const queue = getQueue(redisUrl);

    // Set the jobId to the idempotencyKey if provided to use BullMQ's built-in deduplication
    await queue.add(
      "ingest",
      { organisationId, body },
      {
        jobId: body.idempotencyKey ?? undefined,
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    return context.json(
      {
        success: true,
        data: {
          received: true,
          status: "enqueued",
          idempotencyKey: body.idempotencyKey ?? null,
        },
      },
      HttpStatus.ACCEPTED,
    );
  } catch (error: any) {
    console.error("Queue ingestion failed:", error);
    return context.json(
      {
        success: false,
        error: "Failed to queue audit log event for ingestion.",
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
