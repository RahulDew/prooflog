export interface SidebarCategory {
  title: string;
  links: { name: string; id: string }[];
}

export interface DocSection {
  id: string;
  category: string;
  title: string;
  description: string;
  callout?: {
    type: "note" | "important" | "tip";
    text: string;
  };
  codeBlock?: string;
  codeLanguage?: string;
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export const DOC_CATEGORIES: SidebarCategory[] = [
  {
    title: "Getting Started",
    links: [
      { name: "Introduction", id: "introduction" },
      { name: "Quick Installation", id: "installation" },
      { name: "Quickstart Guide", id: "quickstart" }
    ]
  },
  {
    title: "Node.js SDK Reference",
    links: [
      { name: "client.ingest()", id: "sdk-ingest" },
      { name: "client.verifyChain()", id: "sdk-verify" },
      { name: "client.getHistory()", id: "sdk-history" }
    ]
  },
  {
    title: "Idempotency & Security",
    links: [
      { name: "Idempotency Policies", id: "idempotency" },
      { name: "Hashing Algorithms", id: "hashing-algorithms" }
    ]
  },
  {
    title: "Framework Integration",
    links: [
      { name: "NestJS Module", id: "nestjs-integration" },
      { name: "Express / Fastify", id: "express-middleware" }
    ]
  },
  {
    title: "REST API Reference",
    links: [
      { name: "HTTP Endpoints", id: "rest-api" }
    ]
  }
];

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "introduction",
    category: "Getting Started",
    title: "Introduction to ProofLog",
    description: "ProofLog is a zero-trust, open-source audit logging engine designed for high-concurrency cloud applications. Every log entry ingested is hashed alongside its predecessor payload using deterministic SHA signatures, creating an immutable cryptographic hash chain stored in PostgreSQL.",
    callout: {
      type: "note",
      text: "ProofLog guarantees zero-trust log verification. If a database administrator or malicious actor retroactively modifies a single byte in any audit log row, the validation signature breaks immediately."
    }
  },
  {
    id: "installation",
    category: "Getting Started",
    title: "Quick Installation",
    description: "Install the official ProofLog Node.js SDK using your package manager of choice:",
    codeBlock: "$ pnpm add @prooflog/node\n# Or with npm / yarn / bun:\n$ npm install @prooflog/node",
    codeLanguage: "terminal"
  },
  {
    id: "quickstart",
    category: "Getting Started",
    title: "Quickstart Guide",
    description: "Initialize the ProofLog client with your secret API key and ingest your first audit event payload in under 60 seconds:",
    codeBlock: `import { ProofLog } from '@prooflog/node';

// Initialize ProofLog client
const client = new ProofLog({
  apiKey: process.env.PROOFLOG_API_KEY || 'pl_live_secret_key'
});

// Ingest an audit event
await client.ingest('org_1234', {
  action: 'user.login',
  actor: { id: 'usr_99', email: 'alice@example.com' },
  metadata: { ip: '192.168.1.1', userAgent: 'Mozilla/5.0' }
});`,
    codeLanguage: "typescript",
    callout: {
      type: "tip",
      text: "Store PROOFLOG_API_KEY securely in your environment variables. Never expose private API keys in client-side code."
    }
  },
  {
    id: "sdk-ingest",
    category: "Node.js SDK Reference",
    title: "client.ingest(orgId, payload)",
    description: "Appends an immutable audit block to the tenant ledger queue. Computes SHA-256 signatures incorporating the previous block's hash signature.",
    codeBlock: `await client.ingest('org_1234', {
  action: 'billing.invoice_paid',
  actor: { id: 'usr_88' },
  idempotencyKey: 'req_invoice_99a81',
  chainVersion: 1
});`,
    codeLanguage: "typescript",
    table: {
      headers: ["Parameter", "Type", "Required", "Description"],
      rows: [
        ["orgId", "string", "Yes", "Unique tenant / organization context identifier"],
        ["action", "string", "Yes", "Dot-delimited action tag (e.g. auth.mfa_enabled)"],
        ["actor", "Record<string, unknown>", "Yes", "User or system agent payload metadata"],
        ["idempotencyKey", "string", "No", "Unique request key for safe deduplication retries"],
        ["chainVersion", "number", "No", "Explicit ledger block version metadata (default: 1)"]
      ]
    }
  },
  {
    id: "sdk-verify",
    category: "Node.js SDK Reference",
    title: "client.verifyChain(orgId)",
    description: "Performs a complete zero-trust mathematical verification over historical tenant blocks. Recomputes every block hash sequentially from Genesis to present.",
    codeBlock: `const verification = await client.verifyChain('org_1234');

if (verification.valid) {
  console.log(\`Chain intact! Total blocks verified: \${verification.totalEntries}\`);
} else {
  console.error(\`TAMPERING DETECTED at block #\${verification.tamperedAt}\`);
  console.error(\`Expected: \${verification.expectedHash}, Got: \${verification.actualHash}\`);
}`,
    codeLanguage: "typescript",
    callout: {
      type: "important",
      text: "Run client.verifyChain() periodically in background cron jobs to verify database compliance and generate automated audit attestations."
    }
  },
  {
    id: "sdk-history",
    category: "Node.js SDK Reference",
    title: "client.getHistory(orgId, options)",
    description: "Fetches historical audit log entries with cursor pagination and sequence bounds filtering.",
    codeBlock: `const history = await client.getHistory('org_1234', {
  limit: 20,
  order: 'desc'
});

console.log(history.data); // Array of verified AuditEntry objects`,
    codeLanguage: "typescript"
  },
  {
    id: "idempotency",
    category: "Idempotency & Security",
    title: "Idempotency & Retry Safety",
    description: "Under high-concurrency network failures, API clients may retry HTTP requests. Passing an idempotencyKey ensures duplicate requests return the existing block hash without creating duplicate ledger records.",
    codeBlock: `// Passing a unique UUID or request ID as idempotencyKey
await client.ingest('org_1234', {
  action: 'org.member_removed',
  actor: { id: 'usr_1' },
  idempotencyKey: 'req_88f12-uuid-v4'
});`,
    codeLanguage: "typescript"
  },
  {
    id: "hashing-algorithms",
    category: "Idempotency & Security",
    title: "Cryptographic Hashing Algorithms",
    description: "ProofLog supports dynamic cryptographic hashing primitives. Choose the algorithm that satisfies your compliance mandate:",
    table: {
      headers: ["Algorithm", "Digest Size", "Performance", "Use Case"],
      rows: [
        ["SHA-256", "256 bits (32 bytes)", "Fast (Default)", "Standard audit logging"],
        ["SHA-384", "384 bits (48 bytes)", "High Security", "HIPAA & SOC-2 compliance"],
        ["SHA-512", "512 bits (64 bytes)", "Maximum Security", "Financial & Defense grade ledgers"]
      ]
    }
  },
  {
    id: "nestjs-integration",
    category: "Framework Integration",
    title: "NestJS Module Integration",
    description: "Integrate ProofLog into NestJS applications using the dedicated `@prooflog/nestjs` provider module:",
    codeBlock: `@Module({
  imports: [
    ProofLogModule.forRoot({
      apiKey: process.env.PROOFLOG_API_KEY,
    }),
  ],
})
export className AppModule {}`,
    codeLanguage: "typescript"
  },
  {
    id: "express-middleware",
    category: "Framework Integration",
    title: "Express & Fastify Middleware",
    description: "Automatically capture incoming HTTP mutation requests (POST, PUT, DELETE) as audit entries:",
    codeBlock: `import { createProofLogMiddleware } from '@prooflog/node';

app.use(createProofLogMiddleware({
  client,
  orgIdResolver: (req) => req.user.orgId
}));`,
    codeLanguage: "typescript"
  },
  {
    id: "rest-api",
    category: "REST API Reference",
    title: "REST API Reference",
    description: "Interact directly with the Fastify API server over HTTP REST endpoints:",
    table: {
      headers: ["Method", "Endpoint", "Auth Header", "Description"],
      rows: [
        ["POST", "/v1/ingest", "Bearer pl_live_...", "Ingest a new audit log event payload"],
        ["GET", "/v1/verify", "Bearer pl_live_...", "Execute cryptographic chain verification check"],
        ["GET", "/v1/entries", "Bearer pl_live_...", "Query historical tenant audit entries"]
      ]
    }
  }
];
