# ProofLog 9.5/10 Project Plan

## Goal

Turn ProofLog into a senior-level portfolio project: a serverless tamper-evident audit logging platform for B2B SaaS apps.

The project should demonstrate production-minded engineering, not just a good idea:

- secure multi-tenant API design
- cryptographic hash-chain verification
- retry-safe ingestion
- typed SDK design
- real verification UI
- clean CI and tests
- OpenAPI documentation
- threat modeling and architecture tradeoffs

## Target Positioning

ProofLog is a tamper-evident audit logging platform that lets SaaS teams ingest security/audit events and later prove whether the audit trail was modified.

Primary architecture:

```txt
Customer App
  -> @prooflog/node SDK
  -> apps/api (Hono on Cloudflare Workers)  -- Fast entry gate (authenticates, queues, returns 202)
  -> Queue (BullMQ + Redis)                 -- Event buffering layer
  -> apps/worker (NestJS Standalone Docker) -- Asynchronous processing & hash chaining
  -> Neon/Postgres audit_logs table
  -> Verification API + Dashboard
```

The main product path should be the hosted API. A direct database/self-hosted SDK can come later, but it should not confuse the first version.

## Final Tech Stack

- TypeScript
- pnpm workspaces + Turbo
- Hono for API (Cloudflare Workers runtime target)
- NestJS (Standalone Node.js application in Docker) for background worker
- BullMQ + Redis for asynchronous ingestion queue
- Neon Postgres
- Drizzle ORM
- Zod validation
- `@noble/hashes` for SHA-256
- stable JSON canonicalization for deterministic hashes
- React + Vite for web app
- Tailwind CSS for UI
- Vitest for tests
- tsup for SDK/package builds
- OpenAPI for API contract docs
- GitHub Actions for CI

Avoid for now:

- Kafka
- Kubernetes
- ClickHouse
- Elasticsearch
- Terraform
- microservice splitting

Those are not needed for the current scale and may make the project look over-engineered.

## Phase 1: Product Clarity

Objective: make the product model consistent across code, docs, SDK, and website.

Tasks:

- Decide that hosted API is the primary path.
- Update README examples to use `apiKey`, not direct `databaseUrl`.
- Update web docs and homepage examples to match real SDK behavior.
- Keep direct DB access as an internal/self-hosted option only if needed.
- Rename confusing docs/examples that mention `secret` if the SDK does not support it.

Definition of done:

- A new developer can understand the product flow from README in under 5 minutes.
- README, docs site, SDK types, and API behavior all match.

## Phase 2: Real API Authentication

Objective: replace `X-Org-Id` trust with real API key authentication.

Tasks:

- Add API key table/schema.
- Store only hashed API keys.
- Use key prefixes such as `pl_live_...`.
- Add scopes:
  - `logs:write`
  - `logs:read`
  - `logs:verify`
- Add revoked/active status.
- Add key creation and rotation design.
- Add Hono auth middleware.
- Resolve `organisationId` from the API key, not from an untrusted header.

Request flow:

```txt
Incoming request
  -> extract Authorization bearer token
  -> hash token
  -> find active key
  -> check scope
  -> resolve organisation/project
  -> continue request
```

Definition of done:

- Ingest/verify endpoints reject missing, invalid, revoked, or wrong-scope keys.
- Tests cover auth success and failure paths.

## Phase 3: Idempotent Ingestion

Objective: make log ingestion safe under retries.

Tasks:

- Add `idempotencyKey` to ingest request.
- Add nullable/required `idempotency_key` column.
- Add unique index on `(organisationId, idempotencyKey)`.
- If a duplicate idempotency key is received, return the original result.
- Add SDK support for passing `idempotencyKey`.
- Document recommended usage with request IDs.

Definition of done:

- Repeated identical ingest request does not create duplicate audit events.
- Tests prove duplicate requests return the same sequence/hash.

## Phase 4: Hash Chain Hardening

Objective: make the cryptographic design explicit and versioned.

Tasks:

- Add `hashAlgorithm`, e.g. `sha256`.
- Add `chainVersion`, e.g. `1`.
- Keep deterministic stable JSON serialization.
- Add verification details:
  - first tampered sequence
  - reason
  - expected hash
  - actual hash
  - previous hash
- Document exactly what fields are included in the hash.

Definition of done:

- Verification reports are useful for debugging and demo.
- Hash-chain design is documented in `docs/hash-chain-design.md`.

## Phase 5: Asynchronous Ingestion & NestJS Worker

Objective: decouple log ingestion from database writes to handle high concurrency and ensure safe sequence appending.

Tasks:

- Set up `apps/worker` as a standalone NestJS application in the monorepo workspace.
- Integrate `@nestjs/bullmq` inside the NestJS worker for consuming jobs.
- Update `apps/api` (Hono) to write incoming events to the Redis BullMQ queue instead of directly writing to Postgres.
- Implement the BullMQ worker job handler in NestJS:
  - Retrieve the current chain tip.
  - Compute the deterministic SHA-256 hash.
  - Append the log to the database.
- Configure queue concurrency options so that logs for the same organization are processed sequentially (preserving hash chain order).
- Implement database retry and logging inside the NestJS worker.
- Write unit/integration tests for the NestJS worker and Hono queue integration.
- Document the queue architecture in a design document.

Definition of done:

- Ingestion API immediately accepts logs and pushes them to Redis.
- NestJS worker successfully consumes events, computes hash chains, and writes to Postgres.
- Tests prove end-to-end integration and queue reliability.

## Phase 6: SDK Quality

Objective: make the SDK feel like a real package.

Tasks:

- SDK should call ProofLog API as the primary path.
- Use `apiKey` config.
- Add timeout option.
- Add retry option for safe retryable failures.
- Add structured error classes.
- Add typed request/response exports.
- Add README examples for common use cases.

Example target usage:

```ts
const prooflog = new ProofLog({
  apiKey: process.env.PROOFLOG_API_KEY,
});

await prooflog.ingest({
  action: "user.login",
  actor: { id: "user_123" },
  metadata: { ip: "127.0.0.1" },
  idempotencyKey: requestId,
});
```

Definition of done:

- SDK can be used without understanding internal database details.
- SDK tests mock fetch/API behavior.

## Phase 7: Verification Dashboard

Objective: make the project demoable.

Tasks:

- Replace mock verification page with real API call.
- Show valid/invalid status.
- Show total entries verified.
- Show first tampered sequence.
- Show expected vs actual hash.
- Show recent audit events.
- Add empty/loading/error states.

Definition of done:

- In an interview, the project can be demoed visually in under 2 minutes.

## Phase 8: OpenAPI Contract

Objective: make API behavior explicit and professional.

Tasks:

- Add `openapi.yaml`.
- Document:
  - auth
  - ingest
  - verify
  - get entries
  - error response format
- Add request/response examples.
- Link OpenAPI docs from README and docs site.

Definition of done:

- API consumers can integrate without reading source code.

## Phase 9: Production Readiness

Objective: remove demo-grade rough edges.

Tasks:

- Remove debug error responses from production.
- Remove `console.log(sql)`.
- Add request IDs.
- Add structured JSON logs.
- Add consistent error response shape.
- Add `/health`.
- Add `/ready` for DB readiness.
- Add environment validation.
- Add rate limiting plan or lightweight implementation.
- Add CORS policy.

Definition of done:

- API does not leak internals.
- Failure behavior is predictable and documented.

## Phase 10: Tests And CI

Objective: make quality visible.

CI should run:

```txt
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Test coverage areas:

- crypto hash determinism
- valid chain verification
- tampered payload detection
- broken previous hash detection
- auth middleware
- invalid scopes
- idempotency behavior
- sequence conflict retry
- API request validation
- SDK request building
- SDK error handling

Definition of done:

- GitHub Actions is green.
- Root test command does not fail because of placeholder scripts.

## Phase 11: Senior-Level Documentation

Objective: show senior development approach.

Add:

```txt
docs/architecture.md
docs/hash-chain-design.md
docs/threat-model.md
docs/api-design.md
docs/database-design.md
docs/deployment.md
docs/production-readiness.md
docs/adr/
```

Important ADRs:

```txt
0001-use-hash-chain-for-tamper-evidence.md
0002-use-hono-cloudflare-workers.md
0003-use-postgres-jsonb-for-event-metadata.md
0004-use-idempotency-keys-for-safe-retries.md
0005-use-api-key-auth-for-mvp.md
```

Threat model must cover:

- database row modification
- deleted rows
- reordered rows
- compromised API keys
- replay attacks
- compromised customer backend
- malicious ProofLog admin
- clock manipulation
- metadata privacy

Definition of done:

- The repo explains not only what was built, but why tradeoffs were chosen.

## Phase 12: Demo Polish

Objective: make the project easy to judge quickly.

Tasks:

- Add seed/demo data.
- Add local quickstart.
- Add screenshots/GIF to README.
- Add architecture diagram.
- Add one-click-ish local demo instructions.
- Add resume bullets in README.

Definition of done:

- A reviewer can clone, run, and understand the project without asking you.

## Resume Positioning

Final resume description:

> Built ProofLog, a serverless tamper-evident audit logging platform for B2B SaaS apps using TypeScript, Hono, Cloudflare Workers, Neon Postgres, Drizzle ORM, and React. Implemented SHA-256 hash-chained event storage, deterministic verification, scoped API-key authentication, idempotent ingestion, OpenAPI documentation, and a typed SDK.

Strong bullets:

- Designed cryptographic hash-chain verification to detect tampering across multi-tenant audit trails.
- Implemented retry-safe, idempotent ingestion with per-tenant sequence constraints and deterministic JSON hashing.
- Built a typed TypeScript SDK, Hono API, Drizzle/Postgres schema, and React verification dashboard.
- Added OpenAPI contracts, CI quality gates, structured errors, and threat-model documentation.
- Created production-focused architecture docs covering trust boundaries, replay risks, key compromise, and database tampering.

## Rating Milestones

- Current state: 6.5/10
- After auth, SDK cleanup, real verification UI, and CI: 8/10
- After threat model, OpenAPI, idempotency, docs, deployment guide, and polished demo: 9.5/10

