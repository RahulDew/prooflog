export interface IngestRequest {
  action: string;
  actor: Record<string, unknown>;
  target?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface IngestResponse {
  received: boolean;
  sequence: number;
  hash: string;
}
