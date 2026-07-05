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
export declare const GENESIS_HASH: string;
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