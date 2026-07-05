export interface AuditEvent {
    organisationId: string;
    sequence: number;
    action: string;
    actor: unknown;
    target?: unknown;
    metadata?: unknown;
    createdAt: string;
    chainVersion?: number;
    hashAlgorithm?: string;
}
export interface ChainEntry extends AuditEvent {
    hash: string;
    previousHash: string;
}
export interface VerificationResult {
    valid: boolean;
    totalEntries: number;
    tamperedAt?: number;
    reason?: string;
    expectedHash?: string;
    actualHash?: string;
    failedTimestamp?: string;
}
//# sourceMappingURL=types.d.ts.map