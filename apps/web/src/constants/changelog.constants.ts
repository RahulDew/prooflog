export interface ReleaseInfo {
  version: string;
  date: string;
  title: string;
  type: "major" | "minor" | "patch";
  commitSha: string;
  description: string;
  changes: string[];
}

export const CHANGELOG_CONTENT = {
  badge: "Engine Changelog & Roadmap",
  title: "ProofLog Release Notes",
  description:
    "Track every major feature, performance optimization, and cryptographic hardening patch released across the ProofLog ecosystem.",
  categories: ["All Releases", "Major", "Minor", "Patch"],
  roadmapNotice:
    "View complete commit log history and submit feature requests directly on our open-source GitHub repository.",
  ctaTitle: "Stay Ahead with ProofLog Updates",
  ctaDescription:
    "Follow along on GitHub for new Node.js SDK primitive additions, worker queue optimizations, and zero-trust security enhancements.",
  primaryCtaText: "Star Repository on GitHub",
  primaryCtaLink: "https://github.com/RahulDew/prooflog"
};

export const RELEASES: ReleaseInfo[] = [
  {
    version: "v0.1.2",
    date: "July 5, 2026",
    title: "Cryptographic Hardening & Idempotent Ingestion",
    type: "patch",
    commitSha: "e8f23a9",
    description:
      "Added support for custom cryptographic hashing algorithms (SHA-384, SHA-512) and explicit ledger block version metadata. Integrated unique idempotency keys to guarantee query duplication recovery under high concurrency retry scenarios.",
    changes: [
      "Dynamic SHA-256/384/512 cryptographic ledger links",
      "Idempotency constraints for log ingestion safety",
      "Detailed chain verification failure diagnostics",
      "Outfit typography integration and custom branding logo"
    ]
  },
  {
    version: "v0.1.1",
    date: "June 29, 2026",
    title: "Performance Optimizations & React Support",
    type: "patch",
    commitSha: "d7e12b8",
    description:
      "Added code-splitting via React.lazy and optimized the Vite build process. The SDK now uses highly optimized cryptographic hashing algorithms internally.",
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
    type: "minor",
    commitSha: "38fbb48",
    description:
      "The very first release of the ProofLog Node.js SDK. Introduces the core primitives for zero-trust immutable audit logging.",
    changes: [
      "log.ingest() for appending secure logs",
      "log.verify() for cryptographic chain validation",
      "log.getEntries() to fetch history"
    ]
  }
];
