/**
 * Reusable test stubs and fixtures for Hono API integration tests.
 * 
 * Provides mock data shapes and request builders to avoid duplication
 * across different test suites.
 */

export const mockEnv = { DATABASE_URL: "postgresql://mock-db-url" };

export const mockActiveKey = {
  id: "key_123",
  organisationId: "org_123",
  hashedKey: "mock-hash",
  prefix: "pl_live_",
  name: "Production Key",
  scopes: ["logs:write", "logs:verify"],
  status: "active",
  expiresAt: null,
  createdAt: new Date("2026-07-05T00:00:00.000Z"),
  updatedAt: new Date("2026-07-05T00:00:00.000Z"),
};

/**
 * Generates a standard request body for the ingestion endpoint.
 */
export function createIngestBody(action = "user.login", actorId = "usr_1") {
  return {
    action,
    actor: { id: actorId },
    target: { id: "project_99" },
    metadata: { ip: "127.0.0.1" },
  };
}
