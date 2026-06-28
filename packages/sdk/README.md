# @prooflog/node

Cryptographically tamper-proof audit logging for Node.js.

Every audit log entry is SHA-256 hash-chained — if anyone modifies a historical record, 
the chain breaks and verification fails instantly.

## Install

```bash
npm install @prooflog/node
```



## Usage

```typescript
import { ProofLog } from '@prooflog/node'

const log = new ProofLog({
  databaseUrl: process.env.DATABASE_URL,
})

// Log an event
await log.ingest('your-org-id', {
  action: 'user.login',
  actor: { id: 'usr_123', email: 'alice@example.com' },
  target: { id: 'proj_456', type: 'project' },
  metadata: { ip: '203.0.113.4' }
})

// Verify chain integrity
const result = await log.verify('your-org-id')
console.log(result)
// { valid: true, totalEntries: 42 }

// Fetch logs
const logs = await log.getEntries('your-org-id', { limit: 10, order: 'desc' })
console.log(logs.data)
```

## API

### `new ProofLog(config)`

| Option | Type | Required | Description |
|---|---|---|---|
| `databaseUrl` | `string` | ✅ | PostgreSQL connection string |

### `log.ingest(organisationId, options)`

| Option | Type | Required | Description |
|---|---|---|---|
| `action` | `string` | ✅ | Event name e.g. `user.login` |
| `actor` | `{ id: string, ...}` | ✅ | Who performed the action |
| `target` | `object` | ❌ | What was acted upon |
| `metadata` | `object` | ❌ | Extra context e.g. IP, userAgent |

Returns `{ sequence, hash }`.

### `log.verify(organisationId)`

Recomputes every hash in the chain and returns:

```typescript
{
  valid: boolean        // true if chain is intact
  totalEntries: number  // entries verified
  tamperedAt?: number   // sequence number where tampering detected
  reason?: string       // human readable explanation
}
```

### `log.getEntries(organisationId, options)`

Fetches logs from the database, ready to be displayed in a UI.

| Option | Type | Required | Description |
|---|---|---|---|
| `limit` | `number` | ❌ | Max entries to return (default `50`) |
| `cursor` | `number` | ❌ | Sequence number to paginate after |
| `order` | `'asc' \| 'desc'` | ❌ | Sort direction (default `'desc'`) |

Returns `{ data: AuditLogEntry[], hasMore: boolean }`.

## How it works

Each log entry stores a SHA-256 hash computed from its own data plus the previous entry's hash — forming a chain. Modifying any historical entry breaks every subsequent hash, making tampering instantly detectable.

## License

MIT
