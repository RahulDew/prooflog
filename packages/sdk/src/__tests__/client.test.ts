import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProofLog } from "../client";
import { GENESIS_HASH } from "@prooflog/crypto";

// We use vi.mock to mock the @neondatabase/serverless and drizzle-orm
// since we don't want to connect to a real DB during unit tests.

vi.mock("@neondatabase/serverless", () => ({
  neon: vi.fn(() => "mock-sql"),
}));

const mockInsert = vi.fn();
const mockValues = vi.fn();
const mockSelect = vi.fn();
const mockFrom = vi.fn();
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();
const mockLimit = vi.fn();

vi.mock("drizzle-orm/neon-http", () => ({
  drizzle: vi.fn(() => ({
    insert: mockInsert.mockReturnValue({ values: mockValues }),
    select: mockSelect.mockReturnValue({
      from: mockFrom.mockReturnValue({
        where: mockWhere.mockReturnValue({
          orderBy: mockOrderBy.mockReturnValue({
            limit: mockLimit,
          }),
          limit: mockLimit,
        }),
      }),
    }),
  })),
}));

describe("ProofLog SDK", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with correct config", () => {
    expect(() => new ProofLog({})).toThrow("Either apiKey or databaseUrl is required");
    const logDb = new ProofLog({ databaseUrl: "postgres://fake" });
    expect(logDb).toBeInstanceOf(ProofLog);
    const logApi = new ProofLog({ apiKey: "test-key" });
    expect(logApi).toBeInstanceOf(ProofLog);
  });

  it("should ingest a new log with genesis hash if it's the first log", async () => {
    mockLimit.mockResolvedValueOnce([]); // No previous entries

    const log = new ProofLog({ databaseUrl: "postgres://fake" });
    const result = await log.ingest("org_1", {
      action: "login",
      actor: { id: "user_1" }
    });

    expect(mockLimit).toHaveBeenCalledWith(1); // Checked for previous entry
    expect(mockInsert).toHaveBeenCalled();
    expect(mockValues).toHaveBeenCalled();
    
    const insertedValues = mockValues.mock.calls[0][0];
    expect(insertedValues.sequence).toBe(1);
    expect(insertedValues.previousHash).toBe(GENESIS_HASH);
    expect(result.sequence).toBe(1);
    expect(result.hash).toBeTypeOf("string");
  });

  it("should retry on unique constraint violation (concurrency)", async () => {
    // 1st attempt: return an entry, but simulate a race condition crash on insert
    mockLimit.mockResolvedValueOnce([{ sequence: 1, hash: "hash1" }]);
    mockValues.mockRejectedValueOnce({ code: "23505" }); // Postgres unique violation

    // 2nd attempt: return the new tip (sequence 2), and insert succeeds
    mockLimit.mockResolvedValueOnce([{ sequence: 2, hash: "hash2" }]);
    mockValues.mockResolvedValueOnce({ inserted: true });

    const log = new ProofLog({ databaseUrl: "postgres://fake" });
    const result = await log.ingest("org_1", {
      action: "login",
      actor: { id: "user_1" }
    });

    expect(mockLimit).toHaveBeenCalledTimes(2);
    expect(mockValues).toHaveBeenCalledTimes(2);
    
    // The successful insert should use sequence 3
    const finalInsertedValues = mockValues.mock.calls[1][0];
    expect(finalInsertedValues.sequence).toBe(3);
    expect(finalInsertedValues.previousHash).toBe("hash2");
    expect(result.sequence).toBe(3);
  });

  describe("ProofLog SDK - Hosted API mode", () => {
    beforeEach(() => {
      vi.stubGlobal("fetch", vi.fn());
    });

    it("should ingest via fetch in hosted mode", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: { sequence: 5, hash: "mock-hash" }
        })
      });
      vi.stubGlobal("fetch", mockFetch);

      const log = new ProofLog({ apiKey: "test-key", baseUrl: "https://api-test.prooflog.dev" });
      const result = await log.ingest("org_1", {
        action: "login",
        actor: { id: "user_1" }
      });

      expect(mockFetch).toHaveBeenCalledWith("https://api-test.prooflog.dev/v1/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer test-key",
          "X-Org-Id": "org_1",
        },
        body: JSON.stringify({
          action: "login",
          actor: { id: "user_1" }
        })
      });
      expect(result).toEqual({ sequence: 5, hash: "mock-hash" });
    });

    it("should verify via fetch in hosted mode", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: { valid: true, totalEntries: 10 }
        })
      });
      vi.stubGlobal("fetch", mockFetch);

      const log = new ProofLog({ apiKey: "test-key", baseUrl: "https://api-test.prooflog.dev" });
      const result = await log.verify("org_1");

      expect(mockFetch).toHaveBeenCalledWith("https://api-test.prooflog.dev/v1/verify", {
        method: "GET",
        headers: {
          "Authorization": "Bearer test-key",
          "X-Org-Id": "org_1",
        }
      });
      expect(result).toEqual({ valid: true, totalEntries: 10 });
    });

    it("should throw error for getEntries in hosted mode", async () => {
      const log = new ProofLog({ apiKey: "test-key" });
      await expect(log.getEntries("org_1")).rejects.toThrow(
        "getEntries is not yet supported in hosted API mode. Please configure databaseUrl."
      );
    });
  });

  describe("ProofLog SDK - Idempotency checks", () => {
    it("should return cached results immediately in DB mode if idempotency key exists", async () => {
      // Mock db lookup for idempotency key -> returns existing record
      mockLimit.mockResolvedValueOnce([{ sequence: 100, hash: "hash100" }]);

      const log = new ProofLog({ databaseUrl: "postgres://fake" });
      const result = await log.ingest("org_1", {
        action: "login",
        actor: { id: "user_1" },
        idempotencyKey: "test_idem_1",
      });

      expect(mockLimit).toHaveBeenCalledTimes(1); // Only checked for idempotency
      expect(mockInsert).not.toHaveBeenCalled();
      expect(result).toEqual({ sequence: 100, hash: "hash100" });
    });

    it("should recover and return cached result on insert conflict in DB mode", async () => {
      // Attempt 1: check idempotency key -> empty
      mockLimit.mockResolvedValueOnce([]);
      // Attempt 1: get chain tip -> resolves genesis tip
      mockLimit.mockResolvedValueOnce([]);
      // Attempt 1: insert -> unique constraint clash
      mockValues.mockRejectedValueOnce({ code: "23505" });
      // Catch block: search db for the idempotency key -> resolves existing record (inserted concurrently)
      mockLimit.mockResolvedValueOnce([{ sequence: 105, hash: "hash105" }]);

      const log = new ProofLog({ databaseUrl: "postgres://fake" });
      const result = await log.ingest("org_1", {
        action: "login",
        actor: { id: "user_1" },
        idempotencyKey: "test_idem_1",
      });

      // Checked idempotency (1), tip (2), and post-conflict lookup (3)
      expect(mockLimit).toHaveBeenCalledTimes(3);
      expect(result).toEqual({ sequence: 105, hash: "hash105" });
    });

    it("should pass idempotencyKey in request body in hosted mode", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: { sequence: 200, hash: "hash200" }
        })
      });
      vi.stubGlobal("fetch", mockFetch);

      const log = new ProofLog({ apiKey: "test-key" });
      await log.ingest("org_1", {
        action: "login",
        actor: { id: "user_1" },
        idempotencyKey: "test_idem_1",
      });

      const fetchArgs = mockFetch.mock.calls[0][1];
      const parsedBody = JSON.parse(fetchArgs.body);
      expect(parsedBody.idempotencyKey).toBe("test_idem_1");
    });
  });
});
