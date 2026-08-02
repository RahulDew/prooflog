import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Play } from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

interface BlockItem {
  id: number;
  action: string;
  prevHash: string;
  hash: string;
  status: "VERIFIED" | "LINKED" | "NEW";
}

const SAMPLE_ACTIONS = [
  "auth.mfa_enabled",
  "billing.invoice_paid",
  "org.role_updated",
  "data.export_requested",
  "api.token_rotated",
  "user.password_reset",
];

export function HeroHashChainVisualizer() {
  const { isDark } = useTheme();
  const [blocks, setBlocks] = useState<BlockItem[]>([
    {
      id: 1041,
      action: "billing.invoice_paid",
      prevHash: "sha256_000...00",
      hash: "sha256_e8f23...a9b",
      status: "VERIFIED",
    },
    {
      id: 1042,
      action: "auth.session_created",
      prevHash: "sha256_e8f23...a9b",
      hash: "sha256_d7e12...b8c",
      status: "LINKED",
    },
  ]);

  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    const lastBlock = blocks[blocks.length - 1];
    const nextId = lastBlock.id + 1;
    const randomAction =
      SAMPLE_ACTIONS[Math.floor(Math.random() * SAMPLE_ACTIONS.length)];
    const randomHex = Math.random().toString(36).substring(2, 7);
    const newHash = `sha256_${randomHex}...${Math.floor(Math.random() * 899 + 100)}`;

    const newBlock: BlockItem = {
      id: nextId,
      action: randomAction,
      prevHash: lastBlock.hash,
      hash: newHash,
      status: "NEW",
    };

    setTimeout(() => {
      setBlocks((prev) => [...prev.slice(-1), newBlock]);
      setIsSimulating(false);
    }, 400);
  };

  const block1 = blocks[0];
  const block2 = blocks[1];

  return (
    <div className="lg:col-span-5 w-full text-left">
      <div
        className={`p-5 rounded-none border font-mono text-xs relative transition-colors ${
          isDark
            ? "bg-[#0a0a0c] border-zinc-800 text-zinc-200"
            : "bg-white border-zinc-300 text-zinc-900 shadow-md"
        }`}
      >
        {/* Header Bar */}
        <div
          className={`flex items-center justify-between pb-3 border-b mb-4 ${
            isDark ? "border-zinc-800/80" : "border-zinc-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-none bg-emerald-500 animate-pulse" />
            <span
              className={`font-bold uppercase tracking-wider text-[11px] ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Hash Chain Flow (SHA-256)
            </span>
          </div>
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className={`text-[10px] font-bold border px-2.5 py-1 transition-all flex items-center gap-1.5 cursor-pointer ${
              isDark
                ? "border-orange-500/40 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20"
                : "border-orange-500/50 bg-orange-50 text-orange-600 hover:bg-orange-100"
            }`}
          >
            <Play
              size={12}
              strokeWidth={2}
              className={isSimulating ? "animate-spin" : ""}
            />
            <span>{isSimulating ? "COMPUTING..." : "INGEST BLOCK"}</span>
          </button>
        </div>

        {/* Block 1 */}
        <motion.div
          key={block1.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`p-3.5 border mb-3 relative ${
            isDark
              ? "bg-black/60 border-zinc-800"
              : "bg-zinc-50 border-zinc-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-orange-500">
              BLOCK #{block1.id}
            </span>
            <span className="text-[10px] text-emerald-500 font-bold">
              VERIFIED
            </span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className={isDark ? "text-zinc-500" : "text-zinc-400"}>
                PREV_HASH:
              </span>
              <span className={isDark ? "text-zinc-400" : "text-zinc-600"}>
                {block1.prevHash}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? "text-zinc-500" : "text-zinc-400"}>
                ACTION:
              </span>
              <span className="text-blue-500 font-bold">{block1.action}</span>
            </div>
            <div
              className={`flex justify-between pt-1 border-t ${
                isDark ? "border-zinc-800/60" : "border-zinc-200"
              }`}
            >
              <span className={isDark ? "text-zinc-500" : "text-zinc-400"}>
                COMPUTED_HASH:
              </span>
              <span className="text-orange-500 font-bold font-mono bg-orange-500/10 px-1">
                {block1.hash}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Animated Connecting Hash Chain Laser Pipeline */}
        <div className="py-2 relative flex items-center justify-center">
          <svg className="w-full h-8" viewBox="0 0 300 32">
            <line
              x1="150"
              y1="0"
              x2="150"
              y2="32"
              stroke={isDark ? "#3f3f46" : "#cbd5e1"}
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <motion.circle
              cx="150"
              cy="0"
              r="4"
              fill="#f97316"
              animate={{ cy: [0, 32] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </svg>
          <div
            className={`absolute px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest text-orange-500 border border-orange-500/40 ${
              isDark ? "bg-[#0a0a0c]" : "bg-white"
            }`}
          >
            SHA-256 COMPUTE & LINK
          </div>
        </div>

        {/* Block 2 */}
        <motion.div
          key={block2.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`p-3.5 border relative ${
            isDark
              ? "bg-black/80 border-orange-500/40"
              : "bg-white border-blue-500/40 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-blue-500">
              BLOCK #{block2.id} ({block2.status})
            </span>
            <span className="text-[10px] text-emerald-500 font-bold">
              LINKED
            </span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className={isDark ? "text-zinc-500" : "text-zinc-400"}>
                PREV_HASH:
              </span>
              <span className="text-orange-500 font-bold font-mono bg-orange-500/10 px-1">
                {block2.prevHash}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? "text-zinc-500" : "text-zinc-400"}>
                ACTION:
              </span>
              <span className="text-emerald-500 font-bold">
                {block2.action}
              </span>
            </div>
            <div
              className={`flex justify-between pt-1 border-t ${
                isDark ? "border-zinc-800/60" : "border-zinc-200"
              }`}
            >
              <span className={isDark ? "text-zinc-500" : "text-zinc-400"}>
                NEW_HASH:
              </span>
              <span className="text-blue-500 font-bold font-mono">
                {block2.hash}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Status Footer */}
        <div
          className={`mt-4 pt-3 border-t flex items-center justify-between text-[10px] ${
            isDark
              ? "border-zinc-800/80 text-zinc-400"
              : "border-zinc-200 text-zinc-600"
          }`}
        >
          <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
            <CheckCircle size={14} strokeWidth={2} />
            CHAIN STATUS: 100% INTACT
          </span>
          <span>ZERO TAMPERING</span>
        </div>
      </div>
    </div>
  );
}
