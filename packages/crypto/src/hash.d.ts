/**
 * ProofLog Cryptographic Core Utility
 *
 * This module is responsible for computing and verifying SHA-256 hash chains
 * to ensure audit log integrity.
 *
 * Every audit log entry is linked to its preceding entry by including the
 * previous entry's hash in its payload. If any historical record is modified,
 * deleted, or reordered, the cryptographic chain is broken.
 *
 * Example:
 *
 *   const genesisHash = "0".repeat(64);
 *
 *   const event1 = {
 *     organisationId: "org_1",
 *     sequence: 1,
 *     action: "user.login",
 *     actor: { id: "usr_123" },
 *     createdAt: new Date().toISOString()
 *   };
 *
 *   // Compute hash of the first entry
 *   const hash1 = computeHash(event1, genesisHash);
 *
 *   const event2 = {
 *     organisationId: "org_1",
 *     sequence: 2,
 *     action: "project.create",
 *     actor: { id: "usr_123" },
 *     createdAt: new Date().toISOString()
 *   };
 *
 *   // Link second entry to the first
 *   const hash2 = computeHash(event2, hash1);
 */
import type { AuditEvent, ChainEntry, VerificationResult } from "./types";
export declare const GENESIS_HASH: string;
/**
 * Computes a deterministic SHA-256 hash for a given audit event.
 *
 * We use stable JSON stringification to ensure that different runtime
 * environments or object key orderings produce the exact same byte
 * sequence, ensuring consistent hashes.
 *
 * @param event The audit log event containing data to hash
 * @param previousHash The hash of the previous log entry (or GENESIS_HASH if first)
 * @returns The SHA-256 hexadecimal hash string (64 characters)
 */
export declare function computeHash(event: AuditEvent, previousHash: string): string;
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
export declare function verifyChain(entries: ChainEntry[]): VerificationResult;
//# sourceMappingURL=hash.d.ts.map