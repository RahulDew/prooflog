import { sha256 } from '@noble/hashes/sha2.js'
import { bytesToHex } from '@noble/hashes/utils.js'

export const GENESIS_HASH = '0'.repeat(64)

export interface AuditEvent {
  organisationId: string
  sequence: number
  action: string
  actor: unknown
  target?: unknown
  metadata?: unknown
  createdAt: string
}

export function computeHash(
  event: AuditEvent,
  previousHash: string
): string {
  const payload = JSON.stringify({
    organisationId: event.organisationId,
    sequence: event.sequence,
    action: event.action,
    actor: event.actor,
    target: event.target ?? null,
    metadata: event.metadata ?? null,
    createdAt: event.createdAt,
    previousHash,
  })
  return bytesToHex(sha256(new TextEncoder().encode(payload)));
}

export interface ChainEntry extends AuditEvent {
  hash: string
  previousHash: string
}

export interface VerificationResult {
  valid: boolean
  totalEntries: number
  tamperedAt?: number
  reason?: string
}

export function verifyChain(entries: ChainEntry[]): VerificationResult {
  if (entries.length === 0) {
    return { valid: true, totalEntries: 0 }
  }

  const sorted = [...entries].sort((a, b) => a.sequence - b.sequence)

  for (let i = 0; i < sorted.length; i++) {
    const entry = sorted[i]
    const expectedPreviousHash = i === 0
      ? GENESIS_HASH
      : sorted[i - 1].hash

    if (entry.previousHash !== expectedPreviousHash) {
      return {
        valid: false,
        totalEntries: entries.length,
        tamperedAt: entry.sequence,
        reason: `Chain broken at sequence ${entry.sequence}`
      }
    }

    const recomputed = computeHash(entry, entry.previousHash)

    if (recomputed !== entry.hash) {
      return {
        valid: false,
        totalEntries: entries.length,
        tamperedAt: entry.sequence,
        reason: `Hash mismatch at sequence ${entry.sequence} — data tampered`
      }
    }
  }

  return { valid: true, totalEntries: entries.length }
}