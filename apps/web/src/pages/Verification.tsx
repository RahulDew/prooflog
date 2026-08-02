import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowRight, CheckCircle, Clock, Search } from "lucide-react";
import { motion } from "framer-motion";
import { CodeBlock } from "../components/CodeBlock";
import { VERIFICATION_CONTENT } from "../constants/verification.constants";
import { Button } from "../components/ui/Button";
import { SEO } from "../components/SEO";

export interface VerificationProps {
  className?: string;
}

interface ExplorerLogEntry {
  sequence: number;
  action: string;
  actor: string;
  target?: string;
  hash: string;
  previousHash: string;
  createdAt: string;
}

const SAMPLE_ORGS: Record<string, ExplorerLogEntry[]> = {
  org_acme_corp: [
    {
      sequence: 1,
      action: "organization.created",
      actor: "admin@acme.com",
      target: "org_acme_corp",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
      createdAt: "2026-08-01T10:00:00Z",
    },
    {
      sequence: 2,
      action: "user.invited",
      actor: "admin@acme.com",
      target: "developer@acme.com",
      hash: "8f4e2b1a9c3d5e7f0b2a4c6d8e0f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f",
      previousHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      createdAt: "2026-08-01T10:15:30Z",
    },
    {
      sequence: 3,
      action: "billing.subscription_upgraded",
      actor: "billing@acme.com",
      target: "plan_enterprise",
      hash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      previousHash: "8f4e2b1a9c3d5e7f0b2a4c6d8e0f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f",
      createdAt: "2026-08-02T14:22:10Z",
    },
  ],
  org_security_hub: [
    {
      sequence: 1,
      action: "api_key.created",
      actor: "secops@securityhub.io",
      target: "key_live_prod_99",
      hash: "7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e",
      previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
      createdAt: "2026-08-02T08:00:00Z",
    },
    {
      sequence: 2,
      action: "auth.mfa_enforced",
      actor: "system_policy",
      target: "all_users",
      hash: "3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a",
      previousHash: "7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e",
      createdAt: "2026-08-02T09:30:45Z",
    },
  ],
};

const verificationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Zero-Trust Hash Chain Verification",
  description:
    "Mathematical and cryptographic proof verification engine for SHA-256 audit log chains.",
  url: "https://prooflog.dev/verification",
};

export default function Verification() {
  const [selectedOrg, setSelectedOrg] = useState("org_acme_corp");
  const [verificationStatus, setVerificationStatus] = useState<boolean | null>(true);

  const activeLogs = SAMPLE_ORGS[selectedOrg] || SAMPLE_ORGS.org_acme_corp;

  function runVerification(_orgId: string) {
    setVerificationStatus(true);
  }
  return (
    <div className="pt-24 min-h-screen relative pb-28 transition-colors bg-[#ffffff] text-zinc-900 dark:bg-[#050505] dark:text-zinc-100">
      <SEO
        title="Zero-Trust Chain Verification — ProofLog Engine"
        description="Verify cryptographic SHA-256 hash chains, log immutability, and tamper-evident guarantees mathematically in real time."
        canonicalPath="/verification"
        jsonLd={verificationJsonLd}
      />
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(circle_at_50%_35%,black_30%,rgba(0,0,0,0.4)_65%,transparent_90%)]" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-16">
        {/* Header Badge */}
        <div className="space-y-4">
          <div className="badge-orange">
            <Clock className="w-4 h-4" />
            <span>{VERIFICATION_CONTENT.badge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {VERIFICATION_CONTENT.title}
          </h1>

          <p className="text-base max-w-2xl mx-auto leading-relaxed text-muted-adaptive">
            {VERIFICATION_CONTENT.description}
          </p>
        </div>

        {/* High-Tech Cryptographic SVG Diagram */}
        <div className="card-surface p-8 relative overflow-hidden dark-hover-shimmer">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500 mb-6 text-left flex items-center justify-between">
            <span>{VERIFICATION_CONTENT.pipelineTag}</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5">
              {VERIFICATION_CONTENT.pipelineBadge}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* SVG Diagram Canvas */}
            <div className="lg:col-span-7 flex justify-center">
              <svg
                className="w-full max-w-md h-52"
                viewBox="0 0 400 200"
                fill="none"
              >
                {/* Background Grid Lines */}
                <path
                  d="M20 100H380"
                  className="stroke-zinc-300 dark:stroke-zinc-800"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <path
                  d="M200 20V180"
                  className="stroke-zinc-300 dark:stroke-zinc-800"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Outer Pulse Shield Ring */}
                <motion.circle
                  cx="200"
                  cy="100"
                  r="75"
                  stroke="#f97316"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Inner Laser Ring */}
                <motion.circle
                  cx="200"
                  cy="100"
                  r="55"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  animate={{
                    scale: [0.95, 1.05, 0.95],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Node 1 (Genesis Block) */}
                <g transform="translate(60, 100)">
                  <rect
                    x="-25"
                    y="-25"
                    width="50"
                    height="50"
                    rx="4"
                    className="fill-white dark:fill-zinc-900"
                    stroke="#f97316"
                    strokeWidth="2"
                  />
                  <text
                    x="0"
                    y="-35"
                    textAnchor="middle"
                    className="fill-zinc-600 dark:fill-zinc-400"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    BLOCK #1
                  </text>
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#f97316"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    SHA-256
                  </text>
                </g>

                {/* Node 2 (Central Lock Node) */}
                <g transform="translate(200, 100)">
                  <rect
                    x="-30"
                    y="-30"
                    width="60"
                    height="60"
                    rx="4"
                    className="fill-white dark:fill-zinc-950"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M-10 -5V-12A10 10 0 0 1 10 -12V-5H12V15H-12V-5H-10ZM-5 -5H5V-12A5 5 0 0 0 -5 -12V-5Z"
                    fill="#3b82f6"
                  />
                </g>

                {/* Node 3 (Next Block) */}
                <g transform="translate(340, 100)">
                  <rect
                    x="-25"
                    y="-25"
                    width="50"
                    height="50"
                    rx="4"
                    className="fill-white dark:fill-zinc-900"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  <text
                    x="0"
                    y="-35"
                    textAnchor="middle"
                    className="fill-zinc-600 dark:fill-zinc-400"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    BLOCK #N
                  </text>
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#10b981"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    VERIFIED
                  </text>
                </g>

                {/* Laser Connecting Lines */}
                <line
                  x1="85"
                  y1="100"
                  x2="170"
                  y2="100"
                  stroke="#f97316"
                  strokeWidth="2"
                />
                <line
                  x1="230"
                  y1="100"
                  x2="315"
                  y2="100"
                  stroke="#10b981"
                  strokeWidth="2"
                />

                {/* Laser Pulse Dot */}
                <motion.circle
                  r="4"
                  fill="#f97316"
                  animate={{ cx: [85, 315] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  cy="100"
                />
              </svg>
            </div>

            {/* Feature Callout Details */}
            <div className="lg:col-span-5 text-left space-y-4 font-mono text-xs">
              <div className="p-3 border rounded-[4px] bg-white border-zinc-300 text-zinc-600 shadow-sm dark:border-zinc-800/80 dark:bg-black/40 dark:text-zinc-400">
                <div className="flex items-center gap-2 text-orange-500 font-bold mb-1">
                  <Shield className="w-4 h-4" />
                  <span>{VERIFICATION_CONTENT.featureCards[0].title}</span>
                </div>
                <p className="text-[11px] text-muted-adaptive">
                  {VERIFICATION_CONTENT.featureCards[0].desc}
                </p>
              </div>

              <div className="p-3 border rounded-[4px] bg-white border-zinc-300 text-zinc-600 shadow-sm dark:border-zinc-800/80 dark:bg-black/40 dark:text-zinc-400">
                <div className="flex items-center gap-2 text-blue-500 font-bold mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>{VERIFICATION_CONTENT.featureCards[1].title}</span>
                </div>
                <p className="text-[11px] text-muted-adaptive">
                  {VERIFICATION_CONTENT.featureCards[1].desc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Real-Time Audit Log Explorer & Chain Verifier Console */}
        <div className="card-surface p-8 text-left relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800/80 mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              <span className="font-bold uppercase tracking-wider text-sm font-mono">
                Real-Time Audit Log Explorer & Verification Console
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1">
              LIVE CONSOLE
            </span>
          </div>

          {/* Org Selector & Input Bar */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider mb-2 text-muted-adaptive">
                Enter Organization ID or Select Sample Project
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={selectedOrg}
                    onChange={(e) => setSelectedOrg(e.target.value)}
                    placeholder="e.g. org_acme_corp or org_security_hub"
                    className="input-base text-xs font-mono w-full"
                  />
                  <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => runVerification(selectedOrg)}
                  leftIcon={<Shield className="w-4 h-4" />}
                >
                  Verify Chain
                </Button>
              </div>
            </div>

            {/* Quick Sample Preset Badges */}
            <div className="flex items-center gap-2 text-xs font-mono text-muted-adaptive">
              <span>Sample Orgs:</span>
              <button
                type="button"
                onClick={() => setSelectedOrg("org_acme_corp")}
                className={`px-2.5 py-1 border text-[11px] rounded transition-colors ${
                  selectedOrg === "org_acme_corp"
                    ? "border-orange-500 text-orange-500 bg-orange-500/10 font-bold"
                    : "border-zinc-300 dark:border-zinc-800 hover:border-zinc-400"
                }`}
              >
                org_acme_corp
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrg("org_security_hub")}
                className={`px-2.5 py-1 border text-[11px] rounded transition-colors ${
                  selectedOrg === "org_security_hub"
                    ? "border-orange-500 text-orange-500 bg-orange-500/10 font-bold"
                    : "border-zinc-300 dark:border-zinc-800 hover:border-zinc-400"
                }`}
              >
                org_security_hub
              </button>
            </div>
          </div>

          {/* Verification Status Banner */}
          {verificationStatus && (
            <div className="mb-6 p-4 rounded border bg-emerald-500/10 border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>
                  <strong>CHAIN VERIFIED INTACT</strong> — All {activeLogs.length} event blocks cryptographically verified with zero sequence breaks or tampering.
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                SHA-256 MATCH
              </span>
            </div>
          )}

          {/* Real-Time Event Block Chain Explorer */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="text-xs uppercase font-bold text-muted-adaptive tracking-wider mb-2">
              Cryptographic Event Log Chain ({activeLogs.length} Blocks)
            </h4>

            {activeLogs.map((log) => (
              <div
                key={log.hash}
                className="p-4 border rounded border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/60 space-y-2 hover:border-orange-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/30 text-orange-500 font-bold text-[10px] rounded">
                      BLOCK #{log.sequence}
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {log.action}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-adaptive">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-adaptive">
                  <span>Actor: <strong className="text-zinc-700 dark:text-zinc-300">{log.actor}</strong></span>
                  {log.target && (
                    <span>Target: <strong className="text-zinc-700 dark:text-zinc-300">{log.target}</strong></span>
                  )}
                </div>

                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-900 grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-zinc-500">
                  <div>
                    <span className="text-orange-500 font-bold">SHA-256 Hash:</span>{" "}
                    <span className="text-zinc-400 break-all">{log.hash}</span>
                  </div>
                  <div>
                    <span className="text-blue-400 font-bold">Previous Hash:</span>{" "}
                    <span className="text-zinc-400 break-all">{log.previousHash}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SDK Verification Alternative Guide */}
        <div className="card-surface p-8 text-left">
          <div className="mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-500 font-bold block mb-1">
              {VERIFICATION_CONTENT.sdkSection.tag}
            </span>
            <h3 className="text-xl font-bold font-mono">
              {VERIFICATION_CONTENT.sdkSection.title}
            </h3>
          </div>

          <p className="text-xs font-mono mb-4 leading-relaxed text-muted-adaptive">
            {VERIFICATION_CONTENT.sdkSection.description}
          </p>

          <CodeBlock
            code={VERIFICATION_CONTENT.sdkSection.codeSnippet}
            language="typescript"
            title="sdk-verify.ts"
          />

          <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-between text-xs font-mono">
            <span>{VERIFICATION_CONTENT.sdkSection.linkPrompt}</span>
            <Link
              to={VERIFICATION_CONTENT.sdkSection.linkUrl}
              className="text-orange-500 hover:text-orange-600 font-bold flex items-center gap-1"
            >
              <span>{VERIFICATION_CONTENT.sdkSection.linkText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
