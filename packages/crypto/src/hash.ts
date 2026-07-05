import { sha256, sha384, sha512 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import stringify from "fast-json-stable-stringify";
import type { AuditEvent, ChainEntry, VerificationResult } from "./types";

/**
 * ProofLog Cryptographic Core Utility
 *
 * This module is responsible for computing and verifying SHA-256/384/512 hash chains
 * to ensure audit log integrity.
 *
 * Every audit log entry is linked to its preceding entry by including the
 * previous entry's hash in its payload. If any historical record is modified,
 * deleted, or reordered, the cryptographic chain is broken.
 */

// The hardcoded starting link for any organization's audit trail.
export const GENESIS_HASH = "0".repeat(64);

// Reused across hashing invocations to avoid performance overhead in loops.
const encoder = new TextEncoder();

/**
 * Computes a deterministic hash for a given audit event.
 *
 * We use stable JSON stringification to ensure that different runtime
 * environments or object key orderings produce the exact same byte
 * sequence, ensuring consistent hashes.
 *
 * @param event The audit log event containing data to hash
 * @param previousHash The hash of the previous log entry (or GENESIS_HASH if first)
 * @returns The hexadecimal hash string
 */
export function computeHash(event: AuditEvent, previousHash: string): string {
  const algo = event.hashAlgorithm ? event.hashAlgorithm.toLowerCase() : "sha256";
  let hashFn: (message: Uint8Array) => Uint8Array;
  if (algo === "sha512") {
    hashFn = sha512;
  } else if (algo === "sha384") {
    hashFn = sha384;
  } else {
    hashFn = sha256;
  }

  const version = event.chainVersion ?? 1;
  const payloadObj: Record<string, any> = {
    organisationId: event.organisationId,
    sequence: event.sequence,
    action: event.action,
    actor: event.actor,
    target: event.target ?? null,
    metadata: event.metadata ?? null,
    createdAt: event.createdAt,
    previousHash,
  };

  // For version 2 and above, we bind configuration parameters to the payload
  if (version >= 2) {
    payloadObj.chainVersion = version;
    payloadObj.hashAlgorithm = algo;
  }

  const payload = stringify(payloadObj);
  return bytesToHex(hashFn(encoder.encode(payload)));
}

/**
 * Mathematically verifies an entire chain of audit log entries.
 *
 * It sorts the logs by their sequence number, then checks:
 * 1. That each log's `previousHash` matches the actual hash of the previous log.
 * 2. That each log's current hash matches a recomputed hash of its contents.
 *
 * If any check fails, the chain is broken, pointing to the exact sequence where
 * tampering occurred.
 *
 * @param entries The array of chained audit logs to verify
 * @returns A VerificationResult object stating validity, entry count, and error details if broken
 */
export function verifyChain(entries: ChainEntry[]): VerificationResult {
  if (entries.length === 0) {
    return { valid: true, totalEntries: 0 };
  }

  const sorted = [...entries].sort((a, b) => a.sequence - b.sequence);

  for (let i = 0; i < sorted.length; i++) {
    const entry = sorted[i];
    const expectedPreviousHash = i === 0 ? GENESIS_HASH : sorted[i - 1].hash;

    if (entry.previousHash !== expectedPreviousHash) {
      return {
        valid: false,
        totalEntries: entries.length,
        tamperedAt: entry.sequence,
        reason: `Chain broken at sequence ${entry.sequence}`,
        expectedHash: expectedPreviousHash,
        actualHash: entry.previousHash,
        failedTimestamp: entry.createdAt,
      };
    }

    const recomputed = computeHash(entry, entry.previousHash);

    if (recomputed !== entry.hash) {
      return {
        valid: false,
        totalEntries: entries.length,
        tamperedAt: entry.sequence,
        reason: `Hash mismatch at sequence ${entry.sequence} — data tampered`,
        expectedHash: recomputed,
        actualHash: entry.hash,
        failedTimestamp: entry.createdAt,
      };
    }
  }

  return { valid: true, totalEntries: entries.length };
}
