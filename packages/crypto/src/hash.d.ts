export declare const GENESIS_HASH: string;
export interface AuditEvent {
    organisationId: string;
    sequence: number;
    action: string;
    actor: unknown;
    target?: unknown;
    metadata?: unknown;
    createdAt: string;
}
export declare function computeHash(event: AuditEvent, previousHash: string): string;
export interface ChainEntry extends AuditEvent {
    hash: string;
    previousHash: string;
}
export interface VerificationResult {
    valid: boolean;
    totalEntries: number;
    tamperedAt?: number;
    reason?: string;
}
export declare function verifyChain(entries: ChainEntry[]): VerificationResult;
//# sourceMappingURL=hash.d.ts.map