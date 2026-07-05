import { describe, it, expect, vi, beforeEach } from "vitest";
import app from "../index";
import { mockEnv, mockActiveKey, createIngestBody } from "./stubs";
import { GENESIS_HASH } from "@prooflog/crypto";

// Mock the Neon serverless driver and drizzle connection to avoid real DB hits
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
        limit: mockLimit,
      }),
    }),
  })),
}));

describe("ProofLog API - Authentication Middleware & Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should reject request with 401 if Authorization header is missing", async () => {
    const res = await app.request("/v1/ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createIngestBody()),
    }, mockEnv);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toEqual({
      success: false,
      error: "Missing Authorization header",
    });
  });

  it("should reject request with 401 if Authorization header is malformed", async () => {
    const res = await app.request("/v1/ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic dummy-token",
      },
      body: JSON.stringify(createIngestBody()),
    }, mockEnv);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toEqual({
      success: false,
      error: "Malformed Authorization header",
    });
  });

  it("should reject request with 401 if API key is not found in database", async () => {
    mockLimit.mockResolvedValueOnce([]); // No key record matched

    const res = await app.request("/v1/ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer pl_live_invalidkey",
      },
      body: JSON.stringify(createIngestBody()),
    }, mockEnv);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toEqual({
      success: false,
      error: "Invalid API key",
    });
  });

  it("should reject request with 401 if API key is revoked", async () => {
    mockLimit.mockResolvedValueOnce([
      { ...mockActiveKey, status: "revoked" },
    ]);

    const res = await app.request("/v1/ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer pl_live_revokedkey",
      },
      body: JSON.stringify(createIngestBody()),
    }, mockEnv);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toEqual({
      success: false,
      error: "API key has been revoked",
    });
  });

  it("should reject request with 401 if API key is expired", async () => {
    mockLimit.mockResolvedValueOnce([
      {
        ...mockActiveKey,
        expiresAt: new Date(Date.now() - 5000).toISOString(),
      },
    ]);

    const res = await app.request("/v1/ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer pl_live_expiredkey",
      },
      body: JSON.stringify(createIngestBody()),
    }, mockEnv);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toEqual({
      success: false,
      error: "API key has expired",
    });
  });

  it("should reject request with 403 if API key lacks required scope", async () => {
    mockLimit.mockResolvedValueOnce([
      { ...mockActiveKey, scopes: ["logs:read"] }, // lacks logs:write
    ]);

    const res = await app.request("/v1/ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer pl_live_wrongscope",
      },
      body: JSON.stringify(createIngestBody()),
    }, mockEnv);

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json).toEqual({
      success: false,
      error: "Forbidden: API key lacks required scope logs:write",
    });
  });

  it("should accept ingest and return 202 if authenticated with valid scope", async () => {
    // mock api keys fetch
    mockLimit.mockResolvedValueOnce([mockActiveKey]);
    // mock chain tip fetch (empty result means first ever log / sequence 1)
    mockLimit.mockResolvedValueOnce([]);
    // mock db insert success
    mockValues.mockResolvedValueOnce({ inserted: true });

    const res = await app.request("/v1/ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer pl_live_goodkey",
      },
      body: JSON.stringify(createIngestBody()),
    }, mockEnv);

    expect(res.status).toBe(202);
    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.data.received).toBe(true);
    expect(json.data.sequence).toBe(1);
    expect(json.data.hash).toBeTypeOf("string");
  });

  it("should accept verify and return 200 if authenticated with valid scope", async () => {
    // mock api keys fetch
    mockLimit.mockResolvedValueOnce([mockActiveKey]);
    // mock verify audit logs batch fetch (empty result means valid verify with 0 logs)
    mockLimit.mockResolvedValueOnce([]);

    const res = await app.request("/v1/verify", {
      method: "GET",
      headers: {
        "Authorization": "Bearer pl_live_goodkey",
      },
    }, mockEnv);

    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.data).toEqual({ valid: true, totalEntries: 0 });
  });

  it("should process ingestion and write to database when a new idempotencyKey is used", async () => {
    mockLimit.mockResolvedValueOnce([mockActiveKey]);
    mockLimit.mockResolvedValueOnce([]);
    mockLimit.mockResolvedValueOnce([]);
    mockValues.mockResolvedValueOnce({ inserted: true });

    const res = await app.request("/v1/ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer pl_live_goodkey",
      },
      body: JSON.stringify({
        ...createIngestBody(),
        idempotencyKey: "idem_1",
      }),
    }, mockEnv);

    expect(res.status).toBe(202);
    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.data.sequence).toBe(1);
    expect(mockInsert).toHaveBeenCalledTimes(1);
  });

  it("should bypass DB insert and return cached result when duplicate idempotencyKey is used", async () => {
    mockLimit.mockResolvedValueOnce([mockActiveKey]);
    mockLimit.mockResolvedValueOnce([
      {
        sequence: 42,
        hash: "cached_hash_123",
      },
    ]);

    const res = await app.request("/v1/ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer pl_live_goodkey",
      },
      body: JSON.stringify({
        ...createIngestBody(),
        idempotencyKey: "idem_1",
      }),
    }, mockEnv);

    expect(res.status).toBe(202);
    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.data.sequence).toBe(42);
    expect(json.data.hash).toBe("cached_hash_123");
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("should support ingestion with custom hashAlgorithm and chainVersion", async () => {
    mockLimit.mockResolvedValueOnce([mockActiveKey]);
    mockLimit.mockResolvedValueOnce([]);
    mockValues.mockResolvedValueOnce({ inserted: true });

    const res = await app.request("/v1/ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer pl_live_goodkey",
      },
      body: JSON.stringify({
        ...createIngestBody(),
        chainVersion: 2,
        hashAlgorithm: "sha512",
      }),
    }, mockEnv);

    expect(res.status).toBe(202);
    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.data.sequence).toBe(1);
    expect(json.data.hash).toBeTypeOf("string");
    expect(json.data.hash.length).toBe(128);
  });

  it("should return a detailed report on chain verification mismatch/tampering", async () => {
    mockLimit.mockResolvedValueOnce([mockActiveKey]);
    mockLimit.mockResolvedValueOnce([
      {
        sequence: 1,
        action: "user.login",
        actor: { id: "u_1" },
        target: null,
        metadata: null,
        hash: "tampered_stored_hash_value",
        previousHash: GENESIS_HASH,
        createdAt: new Date("2026-07-05T12:00:00.000Z"),
        chainVersion: 1,
        hashAlgorithm: "sha256",
      },
    ]);

    const res = await app.request("/v1/verify", {
      method: "GET",
      headers: {
        "Authorization": "Bearer pl_live_goodkey",
      },
    }, mockEnv);

    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.data.valid).toBe(false);
    expect(json.data.tamperedAt).toBe(1);
    expect(json.data.expectedHash).toBeTypeOf("string");
    expect(json.data.expectedHash.length).toBe(64);
    expect(json.data.actualHash).toBe("tampered_stored_hash_value");
    expect(json.data.failedTimestamp).toBe("2026-07-05T12:00:00.000Z");
  });
});
