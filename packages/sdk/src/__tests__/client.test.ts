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
    expect(() => new ProofLog({ databaseUrl: "" })).toThrow("databaseUrl is required");
    const log = new ProofLog({ databaseUrl: "postgres://fake" });
    expect(log).toBeInstanceOf(ProofLog);
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
});
