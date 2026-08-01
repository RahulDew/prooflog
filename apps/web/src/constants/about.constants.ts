import { Shield, Cpu, GitBranch, Zap } from "lucide-react";
import type { AboutPillar, SecurityGuarantee } from "../types/about.types";

export const ABOUT_CONTENT = {
  badge: "About ProofLog",
  title: "Cryptographic Integrity for Modern SaaS Applications",
  subtitle: "ProofLog was created to eliminate silent database tampering and solve the zero-trust audit trail problem for engineering teams worldwide.",
  missionTag: "Our Mission",
  missionTitle: "Trust Through Computation, Not Promises",
  missionText: "Traditional audit logs rely on database permissions and cloud provider claims. ProofLog introduces mathematical certainty through SHA-256 cryptographic hash chaining—linking every audit event directly to its predecessor, so any retroactive modification breaks the chain instantly.",
  
  pillars: [
    {
      title: "Immutable Hash Chaining",
      desc: "Every log record computes a canonical digest of its payload concatenated with the prior block's signature.",
      icon: Shield
    },
    {
      title: "Zero Blocking SDKs",
      desc: "Non-blocking event dispatch backed by Redis BullMQ async queues ensures zero impact on primary API latency.",
      icon: Zap
    },
    {
      title: "Open Source Engine",
      desc: "Fully open-source under the MIT license, giving teams complete visibility and full self-hosting control.",
      icon: GitBranch
    },
    {
      title: "Microsecond Verification",
      desc: "Run full-ledger zero-trust integrity audits locally or in CI pipelines to verify database records.",
      icon: Cpu
    }
  ] as AboutPillar[],

  securityGuarantees: [
    {
      title: "Tamper Evident Ledger",
      detail: "Any unauthorized UPDATE or DELETE query on PostgreSQL invalidates subsequent cryptographic hash digests.",
      badge: "SHA-256 / SHA-384"
    },
    {
      title: "Idempotent Queueing",
      detail: "Built-in idempotency key deduplication prevents duplicate event insertions during network retries.",
      badge: "DEDUPE ACTIVE"
    },
    {
      title: "Enterprise Ready",
      detail: "Designed for SOC2 Type II, HIPAA, and GDPR audit trails with minimal developer setup overhead.",
      badge: "COMPLIANCE READY"
    }
  ] as SecurityGuarantee[],

  githubCtaTitle: "Explore the Open Source Codebase",
  githubCtaDesc: "Check out the monorepo architecture, read our RFCs, or contribute to the Node.js SDK and NestJS queue engine on GitHub.",
  primaryCtaText: "View Repository on GitHub",
  primaryCtaLink: "https://github.com/RahulDew/prooflog",
  docsCtaText: "Read Documentation",
  docsCtaLink: "/docs"
};
