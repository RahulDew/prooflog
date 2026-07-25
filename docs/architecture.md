# ProofLog Architecture & Technical Design

This document details the system design, cryptographic primitives, threat model, and key architectural decision records (ADRs) for ProofLog.

---

## 🏗️ System Architecture Flow

ProofLog decouples log ingestion (high throughput) from ledger sealing (sequencing and hash chaining) to ensure low-latency API response times.

```mermaid
flowchart TD
    Client[Application Client / SDK] -->|1. Ingest log | API[Hono Edge API]
    API -->|2. Check duplicates| Redis[(Redis Cache)]
    
    alt Request is Duplicate
        API -->|3a. Return cached metadata| Client
    else Request is New
        API -->|3b. Push raw log job| Queue[Redis BullMQ]
        API -->|4. Return 202 Accepted| Client
    end

    subgraph NestJS Worker Context
        QueueWorker[BullMQ Worker] -->|5. Pop log job| LedgerService[Ledger Service]
        LedgerService -->|6. Select current head| DB[(Neon PostgreSQL)]
        LedgerService -->|7. Hash link & check unique sequence| DB
    end
```

---

## 📝 Architecture Decision Records (ADRs)

### ADR 1: Queue-Based Asynchronous Ingestion
* **Context**: Cryptographic linking requires strict sequence synchronization. Ingesting logs synchronously during high-throughput spikes creates a database bottleneck.
* **Decision**: Defer sequence sealing and hashing to an asynchronous worker queue. The Hono API quickly checks for immediate duplicate keys, enqueues raw logs to BullMQ/Redis, and responds with a `202 Accepted` status.
* **Consequences**: Log ingestion latency is independent of DB write performance. Logs are sealed in order by the standalone NestJS worker.

### ADR 2: Decoupled Modular NestJS Worker Layout
* **Context**: Multi-concern monolithic files (like `audit.consumer.ts` performing queue listening, hashing, and raw database client queries) are hard to maintain and test.
* **Decision**: Separate the worker concerns into independent NestJS modules:
  * `ConfigModule` for startup environment validation.
  * `DatabaseModule` for Drizzle client dependency injection.
  * `LedgerModule` encapsulating hash computation and sequence collision retry loops.
  * `QueueModule` wrapping the BullMQ event listener.
* **Consequences**: Enables 100% unit test coverage using isolated mocks.

### ADR 3: Neon Serverless HTTP Connection Pooling
* **Context**: Serverless environments (like Cloudflare Workers) spin up and tear down rapidly, making traditional TCP connection pools inefficient.
* **Decision**: Utilize the `@neondatabase/serverless` driver over HTTP connections (`neon-http`).
* **Consequences**: Eliminates connection pool exhaustion risks under high client concurrency.

---

## 🔒 Threat Model

| Threat | Target | Mitigation Strategy | Security Invariant |
|--------|--------|---------------------|--------------------|
| **Database Compromise (Tampering)** | Stored Logs | A malicious attacker with full DB write access modifies a log entry's message. | Recomputing the sequence's hash will mismatch the stored hash, breaking the verification chain at that sequence number. |
| **History Deletion** | Ledger Chain | An attacker deletes the last $N$ records to hide their tracks. | Verification fails because the expected chain length does not match the actual stored count, or the genesis link is broken. |
| **Sequence Hijack (Race Conditions)** | Concurrency | Two concurrent ingestion jobs grab the same sequence number. | Database unique constraint on `(organisation_id, sequence)` throws a violation; the worker catches it and retries the sequence resolution. |
| **Replay Attacks** | Ingestion | A network packet is captured and sent again to record duplicate logs. | The client supplies an `idempotencyKey` that is validated globally before queue routing. |

---

## ⚙️ Operational Considerations

1. **Queue Backpressure**: Under extreme ingestion spikes, monitor the BullMQ active/waiting queue lengths. Scale the worker instances horizontally. Since NestJS uses a stateless standalone container, workers scale linearly.
2. **Database Partitioning**: Since audit logs are write-once, append-only, and queried primarily by `organisationId` and `sequence`, partition the `audit_logs` table by `organisationId` or range-partition by date for long-term retention.
3. **Pruning & Archiving**: For organizations requiring compliance storage (e.g., SOC2), historical ledger slices can be exported to cold-storage S3 buckets after verifying their cryptographic integrity.
