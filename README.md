<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-check.svg" alt="ProofLog Logo" width="120" height="120">
  <h1 align="center">ProofLog</h1>
  <p align="center">
    <strong>Zero-Trust Cryptographic Audit Logging for Modern Apps</strong>
  </p>
  <p align="center">
    <a href="https://github.com/RahulDew/prooflog/actions"><img src="https://img.shields.io/badge/build-passing-brightgreen" alt="Build Status"></a>
    <a href="https://www.npmjs.com/package/@prooflog/node"><img src="https://img.shields.io/npm/v/@prooflog/node.svg" alt="NPM Version"></a>
    <a href="https://github.com/RahulDew/prooflog/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  </p>
</div>

---

**ProofLog** is a blazing-fast, serverless-ready audit logging system that uses cryptographic hash chaining to ensure your logs are immutable and tamper-proof. If an attacker breaches your database and alters a log, the cryptographic chain breaks, making the tampering instantly detectable.

## 📦 Packages

This is a monorepo managed with `pnpm` containing the following packages:

| Package | Description | Version |
|---------|-------------|---------|
| [`@prooflog/node`](./packages/sdk) | Core Node.js/TypeScript SDK for ingesting and verifying logs | `0.1.2` |
| [`@prooflog/react`](./packages/react) | Embeddable React Widget for displaying secure audit timelines | `0.1.0` |
| [`@prooflog/crypto`](./packages/crypto) | Pure cryptographic hash functions and primitives | `0.0.1` |
| [`@prooflog/db`](./packages/db) | Drizzle ORM schema definitions for PostgreSQL | `0.0.1` |
| [`@prooflog/web`](./apps/web) | The official documentation and marketing website | `private` |

## 🚀 Why ProofLog?

1. **Cryptographic Integrity**: Every log entry hashes itself combined with the hash of the *previous* log entry.
2. **Serverless & Edge Ready**: Built on top of Neon Database and Drizzle ORM via HTTP, making it perfect for Cloudflare Workers, Vercel Edge, or Hono.
3. **Drop-in React Widget**: Includes `@prooflog/react` for a beautifully styled, zero-dependency timeline UI out of the box.

---

## 💻 Installation

Install the core SDK and the React widget:

```bash
npm install @prooflog/node @prooflog/react
```

## 🛠️ Usage

### 1. Backend: Ingesting Logs (Works great with Hono, Express, etc.)

Because `@prooflog/node` is a pure TypeScript SDK, you can use it in any Node.js or Edge framework.

```typescript
// Example using Hono
import { Hono } from 'hono';
import { ProofLog } from '@prooflog/node';

const app = new Hono();
const prooflog = new ProofLog({ databaseUrl: process.env.DATABASE_URL });

app.post('/login', async (c) => {
  const { userId } = await c.req.json();
  
  // 1. Do your business logic...
  
  // 2. Log the action securely
  await prooflog.ingest('org_1234', {
    action: 'USER_LOGIN',
    actor: userId,
    metadata: { ip: '192.168.1.1' }
  });

  return c.json({ success: true });
});
```

### 2. Backend: Verifying the Chain

Run this periodically or via a cron job to ensure no logs have been tampered with:

```typescript
const result = await prooflog.verify('org_1234');

if (!result.valid) {
  console.error(`🚨 ALERT: Log tampering detected at sequence ${result.tamperedAt}!`);
} else {
  console.log(`✅ All ${result.totalEntries} logs are cryptographically secure.`);
}
```

### 3. Frontend: Displaying the Timeline

Use our highly optimized, glassmorphic React widget to display logs to your users.

```tsx
import { ProofLogTimeline } from '@prooflog/react';
import '@prooflog/react/dist/index.css'; // Optional: if you want the default premium styles

function AuditLogPage({ logs }) {
  return (
    <div className="p-8 bg-zinc-950 min-h-screen">
      <ProofLogTimeline 
        logs={logs} 
        title="Security Audit Trail" 
      />
    </div>
  );
}
```

---

## 🧠 Architecture

```mermaid
graph TD
    A[Client App] -->|1. Perform Action| B(Your API e.g. Hono/Express)
    B -->|2. prooflog.ingest| C{@prooflog/node}
    C -->|3. Compute Hash n + Hash n-1| D[Neon PostgreSQL]
    E[Cron Job] -->|Verify Chain| C
    F[React Dashboard] -->|View Timeline| G{@prooflog/react}
```

1. **Genesis Log**: The first log uses a hardcoded `GENESIS_HASH`.
2. **Subsequent Logs**: Compute `SHA-256(current_data + previous_hash)`.
3. **Verification**: The SDK fetches the chain and re-computes every hash. If a single bit in the database changes, the re-computed hash won't match, and the chain breaks.

## 🤝 Contributing

1. Clone the repo
2. Install dependencies: `pnpm install`
3. Setup PostgreSQL database and put the URL in `.env`
4. Push database schema: `pnpm --filter @prooflog/db run push`
5. Start development: `pnpm -r dev`

## License

MIT
