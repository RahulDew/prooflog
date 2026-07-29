import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Shield, ArrowRight, CheckCircle, Clock, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function Verification() {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  const sdkSnippet = `import { ProofLog } from '@prooflog/node';

const client = new ProofLog({ apiKey: process.env.PROOFLOG_API_KEY });

// Execute zero-trust cryptographic chain verification locally
const result = await client.verifyChain('org_1234');
console.log('Chain Intact:', result.valid);`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sdkSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className={`pt-24 min-h-screen relative pb-28 transition-colors ${
        isDark ? "bg-[#050505] text-zinc-100" : "bg-white text-zinc-900"
      }`}
    >
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)"
              : "linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            WebkitMaskImage: "radial-gradient(circle at 50% 35%, black 30%, rgba(0, 0, 0, 0.4) 65%, transparent 90%)",
            maskImage: "radial-gradient(circle at 50% 35%, black 30%, rgba(0, 0, 0, 0.4) 65%, transparent 90%)"
          }}
        />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-16">
        {/* Header Badge */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none border text-xs font-mono uppercase tracking-wider border-orange-500/40 bg-orange-500/10 text-orange-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Live Portal — Coming Soon</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Cryptographic Chain Verification
          </h1>

          <p className={`text-base max-w-2xl mx-auto leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            The web-based hosted verification dashboard is currently under deployment. Zero-trust chain verification is fully operational via the Node.js SDK primitive.
          </p>
        </div>

        {/* High-Tech Cryptographic SVG Diagram */}
        <div
          className={`p-8 rounded-none border relative overflow-hidden dark-hover-shimmer ${
            isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-zinc-50 border-zinc-300 shadow-md"
          }`}
        >
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500 mb-6 text-left flex items-center justify-between">
            <span>Cryptographic Verification Pipeline (SHA-256)</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5">
              SDK PRIMITIVE ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* SVG Diagram Canvas */}
            <div className="lg:col-span-7 flex justify-center">
              <svg className="w-full max-w-md h-52" viewBox="0 0 400 200" fill="none">
                {/* Background Grid Lines */}
                <path d="M20 100H380" stroke={isDark ? "#27272a" : "#cbd5e1"} strokeWidth="1" strokeDasharray="4 4" />
                <path d="M200 20V180" stroke={isDark ? "#27272a" : "#cbd5e1"} strokeWidth="1" strokeDasharray="4 4" />

                {/* Outer Pulse Shield Ring */}
                <motion.circle
                  cx="200"
                  cy="100"
                  r="75"
                  stroke="#f97316"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Laser Ring */}
                <motion.circle
                  cx="200"
                  cy="100"
                  r="55"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Node 1 (Genesis Block) */}
                <g transform="translate(60, 100)">
                  <rect x="-25" y="-25" width="50" height="50" fill={isDark ? "#18181b" : "#ffffff"} stroke="#f97316" strokeWidth="2" />
                  <text x="0" y="-35" textAnchor="middle" fill={isDark ? "#a1a1aa" : "#475569"} fontSize="9" fontFamily="monospace" fontWeight="bold">BLOCK #1</text>
                  <text x="0" y="4" textAnchor="middle" fill="#f97316" fontSize="10" fontFamily="monospace" fontWeight="bold">SHA-256</text>
                </g>

                {/* Node 2 (Central Lock Node) */}
                <g transform="translate(200, 100)">
                  <rect x="-30" y="-30" width="60" height="60" fill={isDark ? "#09090b" : "#ffffff"} stroke="#3b82f6" strokeWidth="2.5" />
                  <path d="M-10 -5V-12A10 10 0 0 1 10 -12V-5H12V15H-12V-5H-10ZM-5 -5H5V-12A5 5 0 0 0 -5 -12V-5Z" fill="#3b82f6" />
                </g>

                {/* Node 3 (Next Block) */}
                <g transform="translate(340, 100)">
                  <rect x="-25" y="-25" width="50" height="50" fill={isDark ? "#18181b" : "#ffffff"} stroke="#10b981" strokeWidth="2" />
                  <text x="0" y="-35" textAnchor="middle" fill={isDark ? "#a1a1aa" : "#475569"} fontSize="9" fontFamily="monospace" fontWeight="bold">BLOCK #N</text>
                  <text x="0" y="4" textAnchor="middle" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">VERIFIED</text>
                </g>

                {/* Laser Connecting Lines */}
                <line x1="85" y1="100" x2="170" y2="100" stroke="#f97316" strokeWidth="2" />
                <line x1="230" y1="100" x2="315" y2="100" stroke="#10b981" strokeWidth="2" />

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
              <div className="p-3 border border-zinc-800/80 bg-black/40">
                <div className="flex items-center gap-2 text-orange-500 font-bold mb-1">
                  <Shield className="w-4 h-4" />
                  <span>Sequential Hash Linking</span>
                </div>
                <p className="text-zinc-400 text-[11px]">Re-computes SHA-256 digests across historical event payloads.</p>
              </div>

              <div className="p-3 border border-zinc-800/80 bg-black/40">
                <div className="flex items-center gap-2 text-blue-400 font-bold mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Zero-Trust Tamper Alert</span>
                </div>
                <p className="text-zinc-400 text-[11px]">Detects modified database bytes instantly with zero false positives.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Disabled Form Section */}
        <div
          className={`p-8 rounded-none border text-left relative overflow-hidden ${
            isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-white border-zinc-300 shadow-sm"
          }`}
        >
          {/* Overlay Coming Soon Ribbon */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-6">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-500" />
              <span className="font-bold uppercase tracking-wider text-xs font-mono">Web Verification Portal</span>
            </div>
            <span className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 border border-orange-500/30 px-3 py-1">
              COMING SOON
            </span>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">
                API Key (Hosted Portal Disabled)
              </label>
              <div className="relative">
                <input
                  type="password"
                  disabled
                  value=""
                  placeholder="Web form verification will be live soon — Use SDK verification below"
                  className={`w-full px-4 py-3 text-xs font-mono rounded-none border cursor-not-allowed opacity-60 ${
                    isDark
                      ? "bg-black/60 border-zinc-800 text-zinc-500"
                      : "bg-zinc-100 border-zinc-300 text-zinc-500"
                  }`}
                />
                <Lock className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            <button
              type="button"
              disabled
              className="w-full py-3.5 px-6 rounded-none bg-zinc-800 text-zinc-500 font-mono font-bold text-xs uppercase tracking-wider cursor-not-allowed border border-zinc-700 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Verify Chain (Web Form Disabled — Coming Soon)</span>
            </button>
          </form>
        </div>

        {/* SDK Verification Alternative Guide */}
        <div
          className={`p-8 rounded-none border text-left dark-hover-shimmer ${
            isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-[#18181b] border-zinc-800 text-gray-100"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                Active Alternative
              </span>
              <h3 className="text-xl font-bold font-mono text-white">Execute Verification via Node.js SDK</h3>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 border border-zinc-700 bg-black/60 hover:border-zinc-500 text-zinc-300 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs font-mono text-zinc-400 mb-4 leading-relaxed">
            Run zero-trust cryptographic chain validation programmatically in your microservices or background health checks:
          </p>

          <div className="p-4 rounded-none bg-black/80 border border-zinc-800 text-xs font-mono text-zinc-300 leading-relaxed overflow-x-auto">
            <pre>
              <code>{sdkSnippet}</code>
            </pre>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Need documentation on client.verifyChain()?</span>
            <Link to="/docs" className="text-orange-500 hover:text-orange-400 font-bold flex items-center gap-1">
              <span>Read Documentation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
