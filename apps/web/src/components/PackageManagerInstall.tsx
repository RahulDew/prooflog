import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface PackageManagerInstallProps {
  isDark: boolean;
}

type PkgManager = "npm" | "pnpm" | "yarn" | "bun";

const COMMANDS: Record<PkgManager, string> = {
  npm: "npm install @prooflog/node",
  pnpm: "pnpm add @prooflog/node",
  yarn: "yarn add @prooflog/node",
  bun: "bun add @prooflog/node",
};

export function PackageManagerInstall({ isDark }: PackageManagerInstallProps) {
  const [activeManager, setActiveManager] = useState<PkgManager>("npm");
  const [copied, setCopied] = useState(false);

  const command = COMMANDS[activeManager];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-3 my-4">
      {/* Package Manager Selector Tabs */}
      <div className="flex items-center gap-2">
        {(["npm", "pnpm", "yarn", "bun"] as PkgManager[]).map((mgr) => (
          <button
            key={mgr}
            onClick={() => setActiveManager(mgr)}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-[4px] border transition-all cursor-pointer ${
              activeManager === mgr
                ? "bg-orange-600 text-white border-orange-500 shadow-sm"
                : isDark
                ? "bg-[#0a0a0c] border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                : "bg-zinc-100 border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400"
            }`}
          >
            {mgr}
          </button>
        ))}
      </div>

      {/* Image 2 Sleek Terminal Command Bar */}
      <div
        className={`px-4 py-3.5 rounded-[4px] border font-mono text-xs flex items-center justify-between transition-colors ${
          isDark
            ? "bg-[#0a0a0c] border-zinc-800 text-zinc-200"
            : "bg-white border-zinc-300 text-zinc-900 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-orange-500 font-bold font-mono text-sm">&gt;_</span>
          <span className="font-mono text-xs sm:text-sm font-medium">{command}</span>
        </div>

        <button
          onClick={handleCopy}
          className={`p-1.5 rounded-[4px] border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono ${
            isDark
              ? "border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 bg-black/40"
              : "border-zinc-200 hover:border-zinc-300 text-zinc-600 hover:text-zinc-900 bg-zinc-50"
          }`}
          title="Copy command"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
