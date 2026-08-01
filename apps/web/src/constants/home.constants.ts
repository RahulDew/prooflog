import {
  Zap,
  Cpu,
  Database,
  Shield,
  Key,
  FileText,
  RefreshCw,
} from "lucide-react";

export interface LiveLog {
  sequence: number;
  action: string;
  idempotencyKey: string;
  hash: string;
  status: "Verified" | "Pending";
  timestamp: string;
}

export const HERO_CONTENT = {
  badge: "ProofLog Engine v0.1.2 Released",
  headlineFirst: "Immutable Audit Logs.",
  headlineSecond: "Zero Trust Required.",
  description:
    "ProofLog is an open-source audit logging system using cryptographic hash chaining to guarantee log integrity. Each log entry is linked to its preceding event payload.",
  primaryCtaText: "Read Documentation",
  primaryCtaLink: "/docs",
  installCommand: "npm install @prooflog/node",
};

export const LIFECYCLE_CONTENT = {
  tag: "Lifecycle",
  title: "The Secured Cryptographic Lifecycle",
  description:
    "Every event block is validated against the previous cryptographic hash payload to ensure sequential integrity.",
  cards: [
    {
      q: "Q1",
      title: "Event Ingestion",
      desc: "API receives structured payloads with metadata and idempotency parameters.",
      icon: Zap,
    },
    {
      q: "Q2",
      title: "Hash Calculation",
      desc: "Computes deterministic SHA-256 signatures incorporating previous block links.",
      icon: Cpu,
    },
    {
      q: "Q3",
      title: "Block Append",
      desc: "Appends immutable records to Neon Postgres with strict sequence isolation.",
      icon: Database,
    },
    {
      q: "Q4",
      title: "Chain Verification",
      desc: "Mathematically verifies zero historical tampering across tenant ledgers.",
      icon: Shield,
    },
  ],
};

export const CODE_INTEGRATION_CONTENT = {
  tag: "Developer Primitive",
  title: "5 Lines of Code to Cryptographic Auditability",
  description:
    "Instantiate the Node.js SDK and record critical user actions, billing invoices, or security policy updates with zero setup overhead.",
  features: [
    "Automatic SHA-256 canonical digest computation",
    "Built-in Redis BullMQ async background queueing",
    "Strict TS sequence tracking with idempotency guardrails",
  ],
  codeSnippet: `import { ProofLog } from '@prooflog/node';

const prooflog = new ProofLog({
  apiKey: process.env.PROOFLOG_API_KEY
});

// Ingest immutable audit event
await prooflog.ingest('org_1234', {
  action: 'billing.invoice_paid',
  actor: { id: 'usr_882', email: 'alex@company.com' },
  metadata: { amount: 4900, currency: 'USD' }
});`,
};

export const INITIAL_LIVE_LOGS: LiveLog[] = [
  {
    sequence: 1042,
    action: "auth.session_created",
    idempotencyKey: "req_99a81",
    hash: "sha256_e8f23...a9b",
    status: "Verified",
    timestamp: "Just now",
  },
  {
    sequence: 1041,
    action: "billing.invoice_paid",
    idempotencyKey: "req_88f12",
    hash: "sha256_d7e12...b8c",
    status: "Verified",
    timestamp: "2s ago",
  },
  {
    sequence: 1040,
    action: "user.password_reset",
    idempotencyKey: "req_77c34",
    hash: "sha256_c6d01...c7d",
    status: "Verified",
    timestamp: "5s ago",
  },
  {
    sequence: 1039,
    action: "org.member_invited",
    idempotencyKey: "req_66b56",
    hash: "sha256_b5c90...d6e",
    status: "Verified",
    timestamp: "12s ago",
  },
];

export const LIVE_FEED_CONTENT = {
  tag: "Live Ledger",
  title: "Real-Time Event Audit Stream",
  description:
    "Incoming events are sequentially hashed and cryptographically linked to the previous block signature in real-time.",
  statusBadge: "LIVE STREAM ACTIVE",
  headers: [
    "SEQ #",
    "ACTION EVENT",
    "IDEMPOTENCY KEY",
    "COMPUTED HASH",
    "STATUS",
  ],
};

export const METRICS_CONTENT = {
  tag: "Performance",
  title: "Built for Ultra-Low Latency & High Scale",
  description:
    "Zero-blocking client SDK execution coupled with high-efficiency BullMQ queue worker workers.",
  metrics: [
    {
      label: "P99 INGESTION LATENCY",
      value: "4.2ms",
      detail: "Asynchronous queue submission",
    },
    {
      label: "CHAIN VERIFICATION ACCURACY",
      value: "100%",
      detail: "Zero false positive tamper detection",
    },
    {
      label: "THROUGHPUT CAPACITY",
      value: "50,000+",
      detail: "Events per second per worker node",
    },
  ],
};

export const REFERENCE_CONTENT = {
  tag: "API Reference",
  title: "Comprehensive SDK Methods & Types",
  description:
    "Fully typed TypeScript SDK with end-to-end support for custom event structures, client credentials, and verification primitives.",
  tabs: [
    { id: "auth", label: "Authentication", icon: Key },
    { id: "ingest", label: "Log Ingestion", icon: FileText },
    { id: "dedupe", label: "Deduplication", icon: RefreshCw },
    { id: "verify", label: "Cryptographic Verification", icon: Shield },
  ],
};

export const QUOTE_CONTENT = {
  quote:
    "“With ProofLog, we passed our SOC2 Type II compliance audit in record time. Having a cryptographically provable audit ledger meant zero pushback from enterprise security reviewers.”",
  author: "Elena Rostova",
  role: "VP of Security Engineering",
  company: "HyperScale Infrastructure",
};

export const CTA_FOOTER_CONTENT = {
  title: "Ready to Secure Your Audit Trail?",
  description:
    "Get started with ProofLog in under 5 minutes. Free and open-source forever under the MIT license.",
  primaryCtaText: "Get Started Now",
  primaryCtaLink: "/docs",
  secondaryCtaText: "Star on GitHub",
  secondaryCtaLink: "https://github.com/RahulDew/prooflog",
};

// Backwards compatibility export
export const LIFECYCLE_CARDS = LIFECYCLE_CONTENT.cards;
export const REFERENCE_TABS = REFERENCE_CONTENT.tabs;
