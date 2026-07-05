import { describe, it, expect } from "vitest";
import { computeHash, verifyChain, GENESIS_HASH } from "../hash";
import type { AuditEvent, ChainEntry } from "../types";

describe("crypto hash logic", () => {
  it("should compute a deterministic hash regardless of object key ordering", () => {
    const event1: AuditEvent = {
      organisationId: "org_1",
      sequence: 1,
      action: "test.event",
      actor: { b: 2, a: 1 },
      metadata: { z: 9, y: 8 },
      createdAt: "2026-06-01T00:00:00Z",
    };

    const event2: AuditEvent = {
      organisationId: "org_1",
      sequence: 1,
      action: "test.event",
      actor: { a: 1, b: 2 }, // Keys swapped
      metadata: { y: 8, z: 9 }, // Keys swapped
      createdAt: "2026-06-01T00:00:00Z",
    };

    const hash1 = computeHash(event1, GENESIS_HASH);
    const hash2 = computeHash(event2, GENESIS_HASH);

    expect(hash1).toBe(hash2);
    expect(hash1).toBeTypeOf("string");
    expect(hash1.length).toBe(64); // SHA-256 hex is 64 chars
  });

  it("should generate a completely different hash if properties change", () => {
    const event1: AuditEvent = {
      organisationId: "org_1",
      sequence: 1,
      action: "test.event",
      actor: { a: 1 },
      createdAt: "2026-06-01T00:00:00Z",
    };

    const event2 = { ...event1, sequence: 2 };
    
    const hash1 = computeHash(event1, GENESIS_HASH);
    const hash2 = computeHash(event2, GENESIS_HASH);

    expect(hash1).not.toBe(hash2);
  });

  describe("verifyChain", () => {
    it("should return valid for an empty chain", () => {
      const result = verifyChain([]);
      expect(result.valid).toBe(true);
      expect(result.totalEntries).toBe(0);
    });

    it("should successfully verify a valid hash chain", () => {
      const event1: AuditEvent = {
        organisationId: "org_1", sequence: 1, action: "login", actor: { id: "user_1" }, createdAt: "2026-06-01T00:00:00Z"
      };
      const hash1 = computeHash(event1, GENESIS_HASH);

      const event2: AuditEvent = {
        organisationId: "org_1", sequence: 2, action: "logout", actor: { id: "user_1" }, createdAt: "2026-06-01T01:00:00Z"
      };
      const hash2 = computeHash(event2, hash1);

      const chain: ChainEntry[] = [
        { ...event1, hash: hash1, previousHash: GENESIS_HASH },
        { ...event2, hash: hash2, previousHash: hash1 },
      ];

      const result = verifyChain(chain);
      expect(result.valid).toBe(true);
      expect(result.totalEntries).toBe(2);
    });

    it("should fail verification if a link is broken (previousHash mismatch)", () => {
      const event1: AuditEvent = {
        organisationId: "org_1", sequence: 1, action: "login", actor: { id: "user_1" }, createdAt: "2026-06-01T00:00:00Z"
      };
      const hash1 = computeHash(event1, GENESIS_HASH);

      const event2: AuditEvent = {
        organisationId: "org_1", sequence: 2, action: "logout", actor: { id: "user_1" }, createdAt: "2026-06-01T01:00:00Z"
      };
      const hash2 = computeHash(event2, hash1);

      const chain: ChainEntry[] = [
        { ...event1, hash: hash1, previousHash: GENESIS_HASH },
        // Tamper with previous hash string
        { ...event2, hash: hash2, previousHash: "bogus_hash" },
      ];

      const result = verifyChain(chain);
      expect(result.valid).toBe(false);
      expect(result.tamperedAt).toBe(2);
      expect(result.reason).toContain("Chain broken at sequence 2");
    });

    it("should fail verification if the payload was tampered with", () => {
      const event1: AuditEvent = {
        organisationId: "org_1", sequence: 1, action: "login", actor: { id: "user_1" }, createdAt: "2026-06-01T00:00:00Z"
      };
      const hash1 = computeHash(event1, GENESIS_HASH);

      const chain: ChainEntry[] = [
        // Action was changed from "login" to "malicious_action", but original hash was kept!
        { ...event1, action: "malicious_action", hash: hash1, previousHash: GENESIS_HASH },
      ];

      const result = verifyChain(chain);
      expect(result.valid).toBe(false);
      expect(result.tamperedAt).toBe(1);
      expect(result.reason).toContain("Hash mismatch at sequence 1");
    });
  });
});
