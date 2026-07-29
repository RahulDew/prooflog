import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Terminal, Check, Copy } from "lucide-react";
import { HeroHashChainVisualizer } from "./HeroHashChainVisualizer";

interface HeroSectionProps {
  isDark: boolean;
}

export function HeroSection({ isDark }: HeroSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("npm i @prooflog/node");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <header className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-16">
      <div className="lg:col-span-7 text-left space-y-6">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-none border text-xs font-mono uppercase tracking-wider ${
            isDark
              ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
              : "border-blue-600/40 bg-blue-50 text-blue-600 font-bold"
          }`}
        >
          <span className="w-1.5 h-1.5 bg-orange-500" />
          ProofLog Engine v0.1.2 Released
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08]">
          Immutable Audit Logs.
          <br />
          <span className={isDark ? "text-orange-500" : "text-blue-600"}>
            Zero Trust Required.
          </span>
        </h1>

        <p className={`text-base leading-relaxed max-w-xl ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
          ProofLog is an open-source audit logging system using cryptographic hash chaining to guarantee log integrity. Each log entry is linked to its preceding event payload.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            to="/docs"
            className="h-12 px-6 rounded-none bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer dark-hover-shimmer"
          >
            <span>Read Documentation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={handleCopy}
            className={`h-12 px-5 rounded-none border font-mono text-xs transition-all flex items-center gap-3 cursor-pointer dark-hover-shimmer ${
              isDark
                ? "bg-[#0a0a0c] border-zinc-800 hover:border-zinc-700 text-zinc-300"
                : "bg-white border-zinc-300 hover:border-zinc-400 text-zinc-800"
            }`}
          >
            <Terminal className="w-4 h-4 text-orange-500" />
            <span>npm install @prooflog/node</span>
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-500" />}
          </button>
        </div>
      </div>

      <HeroHashChainVisualizer isDark={isDark} />
    </header>
  );
}
