# @prooflog/node

Cryptographically tamper-proof audit logging SDK for Node.js backends.

ProofLog is a free, open-source audit logging solution that writes cryptographically verified logs directly to your own Postgres/Neon database using a blockchain-like hash chain.

## Features
- **Tamper-Evident**: Every log is cryptographically linked to the previous log using SHA-256. If a row is modified or deleted, the hash chain breaks, alerting you to the tampering.
- **Bring Your Own DB (BYODB)**: Writes directly to your Neon serverless database. No middleman API, no latency, no subscription.
- **Race-Condition Safe**: Built-in retry mechanisms protect the hash chain from branching during high-concurrency environments.

## Installation

```bash
npm install @prooflog/node
# or
pnpm add @prooflog/node
# or
yarn add @prooflog/node
```

> **Note:** You must have initialized the ProofLog database schema (the `audit_logs` table) in your Postgres database before using this SDK. 

## Usage

### 1. Initialize the Client

Initialize the `ProofLog` client with your database connection URL and the ID of the tenant/organisation you are logging for.

```typescript
import { ProofLog } from '@prooflog/node';

const log = new ProofLog({
  databaseUrl: process.env.DATABASE_URL, // e.g., postgres://user:pass@ep-cool-db.neon.tech/dbname
  organisationId: 'org_12345',
});
```

### 2. Ingest an Audit Event

Log an event whenever a critical action occurs in your application.

```typescript
await log.ingest({
  action: 'user.login',
  actor: { id: 'usr_abc', email: 'user@example.com' },
  // Optional metadata and target
  target: { id: 'sys_xyz' },
  metadata: { ip: '192.168.1.1' }
});
```

### 3. Verify the Hash Chain

You can verify the cryptographic integrity of an organisation's audit log at any time. ProofLog will recompute every hash from the genesis block up to the current tip and verify the cryptographic chain link.

```typescript
const result = await log.verify();

if (result.valid) {
  console.log(`✅ Chain is cryptographically secure. Validated ${result.totalEntries} entries.`);
} else {
  console.error(`🚨 TAMPERING DETECTED at sequence ${result.tamperedAt}!`);
  console.error(`Reason: ${result.reason}`);
}
```

## Security Design

ProofLog uses deterministic JSON stringification and SHA-256 hashing. Each event incorporates the `previousHash` into its payload before hashing. If a malicious actor alters a record directly in the database (even bypassing your application logic), the subsequent hash will not match the recomputed hash, proving the data has been tampered with.

## License
MIT
