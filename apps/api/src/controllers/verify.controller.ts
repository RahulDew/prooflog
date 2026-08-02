import type { Context } from "hono";
import type { AppEnv } from "../config/env";
import { getDb } from "../connections/db";
import { verifyOrgChain } from "../services/audit.service";
import { HttpStatus } from "../config/http-status";

async function dispatchTamperWebhook(
  webhookUrl: string,
  payload: Record<string, unknown>,
) {
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "audit.tamper_detected",
        ...payload,
        detectedAt: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error("Failed to dispatch tamper alert webhook:", error);
  }
}

export async function verifyHandler(context: Context<AppEnv>) {
  const db = getDb(context.env.DATABASE_URL);

  const organisationId = context.var.organisationId;
  if (!organisationId) {
    return context.json(
      { success: false, error: "Unauthorized: Missing organization ID" },
      HttpStatus.UNAUTHORIZED,
    );
  }

  const result = await verifyOrgChain(db, organisationId);

  // If tampering detected and webhook URL configured, trigger alert
  if (!result.valid && (context.env as any).WEBHOOK_URL) {
    void dispatchTamperWebhook((context.env as any).WEBHOOK_URL, {
      organisationId,
      tamperedAtSequence: result.tamperedAt,
      expectedHash: result.expectedHash,
      actualHash: result.actualHash,
      failedTimestamp: result.failedTimestamp,
    });
  }

  return context.json({ success: true, data: result });
}
