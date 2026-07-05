export interface ProofLogConfig {
  apiKey?: string;
  databaseUrl?: string;
  baseUrl?: string;
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
  sequence: number;
  hash: string;
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
