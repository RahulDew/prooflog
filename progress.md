# ProofLog Current Progress

## Current Rating

Current project rating: 6.5/10

Reason:

ProofLog has a strong core idea and a real implementation started, but it still needs security hardening, product consistency, API authentication, idempotency, a real verification UI, production docs, and clean CI before it reads as a senior-level project.

## What Exists Today

ProofLog is a TypeScript monorepo using pnpm workspaces and Turbo.

Current structure:

```txt
apps/api       Hono API for ingestion and verification
apps/web       React/Vite marketing and docs website
packages/sdk   Node/TypeScript SDK
packages/crypto shared hash-chain logic
packages/db    Drizzle Postgres schema
packages/react embeddable audit timeline widget
```

## Core Idea Implemented

The main cryptographic primitive exists.

Implemented:

- `GENESIS_HASH`
- deterministic `computeHash(event, previousHash)`
- `verifyChain(entries)`
- stable JSON stringification
- SHA-256 hashing
- previous-hash linking

Core file:

```txt
packages/crypto/src/hash.ts
```

This is the heart of the project.

## Database Progress

The Drizzle schema exists.

Implemented tables:

- `organisations`
- `audit_logs`

Important audit log fields:

- `organisationId`
- `sequence`
- `action`
- `actor`
- `target`
- `metadata`
- `hash`
- `previousHash`
- `createdAt`

Current useful constraint:

- unique `(organisationId, sequence)`

Core file:

```txt
packages/db/src/schema.ts
```

## API Progress

The API app exists and uses Hono.

Implemented routes:

- `GET /`
- `POST /v1/ingest`
- `GET /v1/verify`

Implemented behavior:

- ingest request validation with Zod
- organisation ID read from `X-Org-Id`
- chain tip lookup
- new sequence calculation
- hash calculation
- audit row insert
- retry on unique constraint conflict
- batch verification in sequence order

Core files:

```txt
apps/api/src/index.ts
apps/api/src/controllers/ingest.controller.ts
apps/api/src/controllers/verify.controller.ts
apps/api/src/services/audit.service.ts
apps/api/src/services/hash.service.ts
apps/api/src/schemas/ingest.schema.ts
```

## SDK Progress

The Node SDK exists.

Implemented:

- `ProofLog` class
- constructor with `databaseUrl`
- `ingest()`
- `verify()`
- `getEntries()`
- retry on unique constraint conflicts
- typed request/response interfaces

Core files:

```txt
packages/sdk/src/client.ts
packages/sdk/src/types.ts
packages/sdk/src/index.ts
```

Important note:

The SDK currently connects directly to the database. For the senior-level hosted product version, the primary SDK should call the hosted ProofLog API with an API key instead.

## React Widget Progress

The React timeline widget exists.

Implemented:

- `ProofLogTimeline`
- log list rendering
- timestamp display
- action display
- metadata preview
- hash preview
- verified badge
- empty state
- CSS styling

Core files:

```txt
packages/react/src/ProofLogTimeline.tsx
packages/react/src/styles.css
packages/react/src/index.ts
```

## Web App Progress

The web app exists.

Implemented pages:

- home page
- docs page
- verification page
- changelog page
- navbar

Core files:

```txt
apps/web/src/App.tsx
apps/web/src/pages/Home.tsx
apps/web/src/pages/Docs.tsx
apps/web/src/pages/Verification.tsx
apps/web/src/pages/Changelog.tsx
```

Important note:

The verification page is currently mostly mock UI. It should be wired to the real verification API.

## Tests Progress

Useful tests already exist.

Implemented test coverage:

- deterministic hash generation
- stable object key ordering
- hash changes when payload changes
- valid chain verification
- broken previous hash detection
- tampered payload detection
- SDK constructor validation
- SDK first-log genesis hash behavior
- SDK retry on unique constraint conflict

Core test files:

```txt
packages/crypto/src/__tests__/hash.test.ts
packages/sdk/src/__tests__/client.test.ts
```

## Current Rough Edges

These are the main gaps blocking the project from feeling production-ready.

### Security/Auth

- API currently trusts `X-Org-Id`.
- No real API key authentication yet.
- No key hashing.
- No key scopes.
- No key revocation.
- No tenant resolution from credentials.

### Product Consistency

- README, docs, homepage examples, and SDK behavior are not fully aligned.
- Some examples mention `secret`.
- Actual SDK currently requires `databaseUrl`.
- Product model is unclear between hosted API and direct DB SDK.

### Ingestion Robustness

- No idempotency key support.
- Duplicate events can happen during client retries.
- Concurrency handling exists, but should be documented and improved.

### Verification UX

- Verification API exists.
- Verification page is not wired to real data.
- Verification report could be more detailed.

### API Hardening

- Error middleware returns debug details.
- DB connection logs `console.log(sql)`.
- No request IDs.
- No structured logs.
- No rate limiting.
- No explicit CORS policy.
- No `/ready` endpoint.

### CI/Build

- GitHub Actions exists.
- Need to ensure root `pnpm test`, `pnpm build`, `pnpm lint`, and `pnpm typecheck` all pass reliably.
- `packages/db` has a placeholder failing test script.

### Documentation

- README exists and is useful.
- Missing senior-level docs:
  - architecture
  - threat model
  - hash-chain design
  - API design
  - database design
  - deployment
  - ADRs

## Git Status Observed

Current observed uncommitted state:

```txt
M .gitignore
?? packages/crypto/src/__tests__/hash.test.d.ts
?? packages/crypto/src/__tests__/hash.test.d.ts.map
?? skills-lock.json
```

Need to decide whether generated `.d.ts` test artifacts should be ignored or removed.

## What Makes This Project Strong Already

- The project is not a basic CRUD app.
- It has a real security/infrastructure angle.
- It uses a modern TypeScript monorepo.
- It has shared packages and app/package separation.
- The hash-chain concept is implemented.
- The SDK, API, database schema, web app, and React widget are all started.
- There are already meaningful tests for the crypto core.

## Current Best Resume Framing

Current honest framing:

> Built an MVP of a tamper-evident audit logging platform using TypeScript, Hono, Drizzle, Neon/Postgres, SHA-256 hash chaining, and React. Implemented deterministic hash-chain verification, multi-package monorepo structure, Node SDK, API service, and embeddable timeline widget.

After the planned improvements, stronger framing:

> Built a serverless tamper-evident audit logging platform for B2B SaaS apps using TypeScript, Hono, Cloudflare Workers, Neon Postgres, Drizzle ORM, and React. Implemented SHA-256 hash-chained event storage, deterministic verification, scoped API-key authentication, idempotent ingestion, OpenAPI documentation, and a typed SDK.

## Next Best Work Order

Recommended next steps:

1. Fix product model and docs consistency.
2. Add API key authentication.
3. Add idempotency keys.
4. Improve verification response details.
5. Wire the verification UI to the API.
6. Fix CI/test scripts.
7. Remove debug leaks.
8. Add OpenAPI docs.
9. Add threat model and architecture docs.
10. Add polished demo data and screenshots.

## Target Outcome

The target is not to make ProofLog look huge. The target is to make it look thoughtfully engineered.

A 9.5/10 version should demonstrate:

- correctness
- security thinking
- clean API design
- strong TypeScript
- reliable tests
- product clarity
- production readiness
- documentation discipline
- good tradeoff judgment
