export interface ProofLogConfig {
  databaseUrl: string;
  organisationId: string;
}

export interface IngestOptions {
  action: string;
  actor: Record<string, unknown> & { id: string };
  target?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
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
}
