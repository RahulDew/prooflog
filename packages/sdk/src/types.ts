export interface ProofLogConfig {
  apiKey?: string;
  databaseUrl?: string;
  baseUrl?: string;
  timeout?: number; // Request timeout in milliseconds (default: 10000)
  retry?: {
    maxRetries?: number; // Max retry count for transient failures (default: 3)
    delay?: number;      // Delay between retries in milliseconds (default: 1000)
  };
}

export interface IngestOptions {
  action: string;
  actor: Record<string, unknown> & { id: string };
  target?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  idempotencyKey?: string;
  chainVersion?: number;
  hashAlgorithm?: "sha256" | "sha512" | "sha384";
}

export interface IngestResult {
  received: boolean;
  status: "enqueued" | "completed";
  idempotencyKey?: string | null;
  sequence?: number;
  hash?: string;
}

export interface VerifyResult {
  valid: boolean;
  totalEntries: number;
  tamperedAt?: number;
  reason?: string;
  expectedHash?: string;
  actualHash?: string;
  failedTimestamp?: string;
}

export interface GetEntriesOptions {
  limit?: number;
  cursor?: number; // Sequence number to start after
  order?: "asc" | "desc";
}

export interface AuditLogEntry {
  sequence: number;
  action: string;
  actor: Record<string, unknown> & { id: string };
  target: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  hash: string;
  previousHash: string;
  chainVersion: number;
  hashAlgorithm: string;
  createdAt: Date;
}

export interface GetEntriesResult {
  data: AuditLogEntry[];
  hasMore: boolean;
}
