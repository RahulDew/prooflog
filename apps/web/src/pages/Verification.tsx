import { Link } from "react-router-dom";
import { Lock, Shield, ArrowRight, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { CodeBlock } from "../components/CodeBlock";
import { VERIFICATION_CONTENT } from "../constants/verification.constants";
import { Button } from "../components/ui/Button";

export interface VerificationProps {
  className?: string;
}

export default function Verification() {
  return (
    <div className="pt-24 min-h-screen relative pb-28 transition-colors bg-[#ffffff] text-zinc-900 dark:bg-[#050505] dark:text-zinc-100">
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
              <svg className="w-full max-w-md h-52" viewBox="0 0 400 200" fill="none">
                {/* Background Grid Lines */}
                <path d="M20 100H380" className="stroke-zinc-300 dark:stroke-zinc-800" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M200 20V180" className="stroke-zinc-300 dark:stroke-zinc-800" strokeWidth="1" strokeDasharray="4 4" />

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
                  <rect x="-25" y="-25" width="50" height="50" rx="4" className="fill-white dark:fill-zinc-900" stroke="#f97316" strokeWidth="2" />
                  <text x="0" y="-35" textAnchor="middle" className="fill-zinc-600 dark:fill-zinc-400" fontSize="9" fontFamily="monospace" fontWeight="bold">BLOCK #1</text>
                  <text x="0" y="4" textAnchor="middle" fill="#f97316" fontSize="10" fontFamily="monospace" fontWeight="bold">SHA-256</text>
                </g>

                {/* Node 2 (Central Lock Node) */}
                <g transform="translate(200, 100)">
                  <rect x="-30" y="-30" width="60" height="60" rx="4" className="fill-white dark:fill-zinc-950" stroke="#3b82f6" strokeWidth="2.5" />
                  <path d="M-10 -5V-12A10 10 0 0 1 10 -12V-5H12V15H-12V-5H-10ZM-5 -5H5V-12A5 5 0 0 0 -5 -12V-5Z" fill="#3b82f6" />
                </g>

                {/* Node 3 (Next Block) */}
                <g transform="translate(340, 100)">
                  <rect x="-25" y="-25" width="50" height="50" rx="4" className="fill-white dark:fill-zinc-900" stroke="#10b981" strokeWidth="2" />
                  <text x="0" y="-35" textAnchor="middle" className="fill-zinc-600 dark:fill-zinc-400" fontSize="9" fontFamily="monospace" fontWeight="bold">BLOCK #N</text>
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

        {/* Disabled Form Section */}
        <div className="card-surface p-8 text-left relative overflow-hidden">
          {/* Overlay Coming Soon Ribbon */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800/80 mb-6">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-500" />
              <span className="font-bold uppercase tracking-wider text-xs font-mono">
                {VERIFICATION_CONTENT.formSection.title}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 border border-orange-500/30 px-3 py-1">
              {VERIFICATION_CONTENT.formSection.ribbon}
            </span>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider mb-2 text-muted-adaptive">
                {VERIFICATION_CONTENT.formSection.label}
              </label>
              <div className="relative">
                <input
                  type="password"
                  disabled
                  value=""
                  placeholder={VERIFICATION_CONTENT.formSection.placeholder}
                  className="input-base cursor-not-allowed opacity-60"
                />
                <Lock className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              </div>
            </div>

            <Button
              type="button"
              variant="disabled"
              disabled
              leftIcon={<Lock className="w-4 h-4" />}
            >
              {VERIFICATION_CONTENT.formSection.buttonText}
            </Button>
          </form>
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

          <CodeBlock code={VERIFICATION_CONTENT.sdkSection.codeSnippet} language="typescript" title="sdk-verify.ts" />

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
