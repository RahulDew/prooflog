import {
  Zap,
  Cpu,
  Database,
  Shield,
  Key,
  FileText,
  RefreshCw
} from "lucide-react";

export interface LiveLog {
  sequence: number;
  action: string;
  idempotencyKey: string;
  hash: string;
  status: "Verified" | "Pending";
  timestamp: string;
}

export const INITIAL_LIVE_LOGS: LiveLog[] = [
  { sequence: 1042, action: "auth.session_created", idempotencyKey: "req_99a81", hash: "sha256_e8f23...a9b", status: "Verified", timestamp: "Just now" },
  { sequence: 1041, action: "billing.invoice_paid", idempotencyKey: "req_88f12", hash: "sha256_d7e12...b8c", status: "Verified", timestamp: "2s ago" },
  { sequence: 1040, action: "user.password_reset", idempotencyKey: "req_77c34", hash: "sha256_c6d01...c7d", status: "Verified", timestamp: "5s ago" },
  { sequence: 1039, action: "org.member_invited", idempotencyKey: "req_66b56", hash: "sha256_b5c90...d6e", status: "Verified", timestamp: "12s ago" },
];

export const LIFECYCLE_CARDS = [
  { q: "Q1", title: "Event Ingestion", desc: "API receives structured payloads with metadata and idempotency parameters.", icon: Zap },
  { q: "Q2", title: "Hash Calculation", desc: "Computes deterministic SHA-256 signatures incorporating previous block links.", icon: Cpu },
  { q: "Q3", title: "Block Append", desc: "Appends immutable records to Neon Postgres with strict sequence isolation.", icon: Database },
  { q: "Q4", title: "Chain Verification", desc: "Mathematically verifies zero historical tampering across tenant ledgers.", icon: Shield }
];

export const ARCHITECTURE_STEPS = [
  { step: "1", title: "Ingest Payload", desc: "Receive JSON event attributes" },
  { step: "2", title: "Compute Hash", desc: "SHA-256 canonical string hashing" },
  { step: "3", title: "Insert Block", desc: "Lock sequence in PostgreSQL" },
  { step: "4", title: "Verify Chain", desc: "Mathematical integrity audit" }
];

export const REFERENCE_TABS = [
  { id: "auth", label: "Authentication", icon: Key },
  { id: "ingest", label: "Log Ingestion", icon: FileText },
  { id: "dedupe", label: "Deduplication", icon: RefreshCw },
  { id: "verify", label: "Cryptographic Verification", icon: Shield }
];

export const PRICING_ROWS = [
  { feature: "Open Source Engine", self: "MIT License", cloud: "Included", ent: "Custom SLA" },
  { feature: "Audit Chain Ingestion", self: "Unlimited", cloud: "1M Logs/mo", ent: "Unlimited" },
  { feature: "Verification Dashboard", self: "Local UI", cloud: "Hosted Dashboard", ent: "Dedicated Node" },
  { feature: "Support SLA", self: "Community", cloud: "Standard Email", ent: "24/7 Dedicated" }
];
