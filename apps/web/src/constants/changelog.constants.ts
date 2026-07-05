export interface ReleaseInfo {
  version: string;
  date: string;
  title: string;
  type: "major" | "feature" | "fix";
  description: string;
  changes: string[];
}

export const RELEASES: ReleaseInfo[] = [
  {
    version: "v0.1.2",
    date: "July 5, 2026",
    title: "Cryptographic Hardening & Idempotent Ingestion",
    type: "feature",
    description: "Added support for custom cryptographic hashing algorithms (SHA-384, SHA-512) and explicit ledger block version metadata. Integrated unique idempotency keys to guarantee query duplication recovery under high concurrency retry scenarios.",
    changes: [
      "Dynamic SHA-256/384/512 cryptographic ledger links",
      "Idempotency constraints for log Ingestion safety",
      "Detailed verify verification failure diagnostics",
      "Outfit typography integration and custom branding logo"
    ]
  },
  {
    version: "v0.1.1",
    date: "June 29, 2026",
    title: "Performance Optimizations & React Support",
    type: "feature",
    description: "Added code-splitting via React.lazy and optimized the Vite build process. The SDK now uses highly optimized cryptographic hashing algorithms internally.",
    changes: [
      "Introduced @prooflog/web core landing page",
      "Code splitting and lazy loading for web client",
      "Removed unnecessary dependencies (clsx, tailwind-merge)"
    ]
  },
  {
    version: "v0.1.0",
    date: "June 25, 2026",
    title: "Initial Alpha Release",
    type: "major",
    description: "The very first release of the ProofLog Node.js SDK. Introduces the core primitives for zero-trust immutable audit logging.",
    changes: [
      "log.ingest() for appending secure logs",
      "log.verify() for cryptographic chain validation",
      "log.getEntries() to fetch history"
    ]
  }
];
