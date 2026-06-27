export interface VerifyResponse {
  valid: boolean;
  totalEntries: number;
  tamperedAt?: number;
  reason?: string;
}
