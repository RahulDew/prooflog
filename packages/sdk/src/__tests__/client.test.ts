import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProofLog } from "../client";
import { GENESIS_HASH } from "@prooflog/crypto";
import {
  TimeoutError,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  ServerError,
  NetworkError,
} from "../errors";

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

  describe("ProofLog SDK - Database Mode", () => {
    it("should ingest a new log with genesis hash if it's the first log", async () => {
      mockLimit.mockResolvedValueOnce([]); // No previous entries

      const log = new ProofLog({ databaseUrl: "postgres://fake" });
      const result = await log.ingest("org_1", {
        action: "login",
        actor: { id: "user_1" }
      });

      expect(mockLimit).toHaveBeenCalledWith(1);
      expect(mockInsert).toHaveBeenCalled();
      expect(mockValues).toHaveBeenCalled();
      
      const insertedValues = mockValues.mock.calls[0][0];
      expect(insertedValues.sequence).toBe(1);
      expect(insertedValues.previousHash).toBe(GENESIS_HASH);
      expect(result.status).toBe("completed");
      expect(result.sequence).toBe(1);
      expect(result.hash).toBeTypeOf("string");
    });
  });

  describe("ProofLog SDK - Hosted API mode", () => {
    beforeEach(() => {
      vi.stubGlobal("fetch", vi.fn());
    });

    it("should ingest via fetch and map to enqueued status in hosted mode", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: { received: true, status: "enqueued", idempotencyKey: null }
        })
      });
      vi.stubGlobal("fetch", mockFetch);

      const log = new ProofLog({ apiKey: "test-key", baseUrl: "https://api-test.prooflog.dev" });
      const result = await log.ingest("org_1", {
        action: "login",
        actor: { id: "user_1" }
      });

      expect(mockFetch).toHaveBeenCalledWith("https://api-test.prooflog.dev/v1/ingest", expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer test-key",
          "X-Org-Id": "org_1",
        },
      }));
      expect(result).toEqual({ received: true, status: "enqueued", idempotencyKey: null });
    });

    it("should throw AuthenticationError on 401 response", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => "Invalid API key"
      });
      vi.stubGlobal("fetch", mockFetch);

      const log = new ProofLog({ apiKey: "invalid-key" });
      await expect(log.ingest("org_1", {
        action: "login",
        actor: { id: "user_1" }
      })).rejects.toThrow(AuthenticationError);
    });

    it("should throw ValidationError on 400 response", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => "Validation failed"
      });
      vi.stubGlobal("fetch", mockFetch);

      const log = new ProofLog({ apiKey: "test-key" });
      await expect(log.ingest("org_1", {
        action: "",
        actor: { id: "user_1" }
      })).rejects.toThrow(ValidationError);
    });

    it("should throw TimeoutError on request timeout", async () => {
      const mockFetch = vi.fn().mockImplementation(() => {
        const error = new Error("The operation was aborted.");
        error.name = "AbortError";
        return Promise.reject(error);
      });
      vi.stubGlobal("fetch", mockFetch);

      const log = new ProofLog({ 
        apiKey: "test-key", 
        timeout: 50,
        retry: { maxRetries: 0 }
      });
      await expect(log.ingest("org_1", {
        action: "login",
        actor: { id: "user_1" }
      })).rejects.toThrow(TimeoutError);
    });

    it("should retry transient ServerErrors and succeed if next attempt succeeds", async () => {
      const mockFetch = vi.fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 502,
          text: async () => "Bad Gateway"
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: { received: true, status: "enqueued" }
          })
        });
      vi.stubGlobal("fetch", mockFetch);

      const log = new ProofLog({
        apiKey: "test-key",
        retry: { maxRetries: 2, delay: 1 }
      });

      const result = await log.ingest("org_1", {
        action: "login",
        actor: { id: "user_1" }
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result.status).toBe("enqueued");
    });
  });
});
