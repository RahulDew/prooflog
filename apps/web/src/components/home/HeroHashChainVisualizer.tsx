import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface HeroHashChainVisualizerProps {
  isDark: boolean;
}

export function HeroHashChainVisualizer({ isDark }: HeroHashChainVisualizerProps) {
  return (
    <div className="lg:col-span-5 w-full text-left">
      <div
        className={`p-5 rounded-none border font-mono text-xs relative ${
          isDark ? "bg-[#0a0a0c] border-zinc-800 text-zinc-200" : "bg-white border-zinc-300 text-zinc-900 shadow-lg"
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400" />
            <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-400">Hash Chain Flow (SHA-256)</span>
          </div>
          <span className="text-[10px] text-orange-500 font-bold border border-orange-500/30 bg-orange-500/10 px-2 py-0.5">
            LIVE SECURED
          </span>
        </div>

        {/* Block #1041 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-3.5 border mb-3 relative ${
            isDark ? "bg-black/60 border-zinc-800" : "bg-zinc-50 border-zinc-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-orange-500">BLOCK #1041</span>
            <span className="text-[10px] text-emerald-400 font-bold">VERIFIED</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-zinc-500">PREV_HASH:</span>
              <span className="text-zinc-400 font-mono">sha256_000...00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">ACTION:</span>
              <span className="text-blue-400 font-bold">billing.invoice_paid</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-zinc-800/60">
              <span className="text-zinc-500">COMPUTED_HASH:</span>
              <span className="text-orange-400 font-bold font-mono">sha256_e8f23...a9b</span>
            </div>
          </div>
        </motion.div>

        {/* Animated Connecting Hash Chain Laser Pipeline */}
        <div className="py-2 relative flex items-center justify-center">
          <svg className="w-full h-8" viewBox="0 0 300 32">
            <line x1="150" y1="0" x2="150" y2="32" stroke={isDark ? "#3f3f46" : "#cbd5e1"} strokeWidth="2" strokeDasharray="4 4" />
            <motion.circle
              cx="150"
              cy="0"
              r="4"
              fill="#f97316"
              animate={{ cy: [0, 32] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </svg>
          <div className="absolute px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest text-orange-500 bg-[#0a0a0c] border border-orange-500/40">
            SHA-256 COMPUTE & LINK
          </div>
        </div>

        {/* Block #1042 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`p-3.5 border relative ${
            isDark ? "bg-black/80 border-orange-500/40" : "bg-white border-blue-600/40 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-blue-500">BLOCK #1042 (NEW)</span>
            <span className="text-[10px] text-emerald-400 font-bold">LINKED</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-zinc-500">PREV_HASH:</span>
              <span className="text-orange-400 font-bold font-mono bg-orange-500/10 px-1">sha256_e8f23...a9b</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">ACTION:</span>
              <span className="text-emerald-400 font-bold">auth.session_created</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-zinc-800/60">
              <span className="text-zinc-500">NEW_HASH:</span>
              <span className="text-blue-400 font-bold font-mono">sha256_d7e12...b8c</span>
            </div>
          </div>
        </motion.div>

        {/* Status Footer */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle className="w-3.5 h-3.5" />
            CHAIN STATUS: 100% INTACT
          </span>
          <span>ZERO TAMPERING</span>
        </div>
      </div>
    </div>
  );
}
