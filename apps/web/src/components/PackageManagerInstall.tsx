import { useState } from "react";
import type { ReactNode } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "./ui/Button";

type PkgManager = "npm" | "pnpm" | "yarn" | "bun";

const COMMANDS: Record<PkgManager, string> = {
  npm: "npm install @prooflog/node",
  pnpm: "pnpm add @prooflog/node",
  yarn: "yarn add @prooflog/node",
  bun: "bun add @prooflog/node",
};

export function PackageManagerInstall() {
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

  let copyIconElement: ReactNode = <Copy size={16} strokeWidth={2} />;
  let copyTextElement: ReactNode = null;

  if (copied) {
    copyIconElement = (
      <Check size={16} strokeWidth={2} className="text-emerald-500" />
    );
    copyTextElement = (
      <span className="text-emerald-500 font-bold">Copied</span>
    );
  }

  return (
    <div className="space-y-3 my-4">
      {/* Package Manager Selector Tabs */}
      <div className="flex items-center gap-2">
        {(["npm", "pnpm", "yarn", "bun"] as PkgManager[]).map((mgr) => (
          <Button
            key={mgr}
            variant="pill"
            onClick={() => setActiveManager(mgr)}
            className={
              activeManager === mgr
                ? "bg-orange-600 text-white border-orange-500 shadow-sm"
                : ""
            }
          >
            {mgr}
          </Button>
        ))}
      </div>

      {/* Sleek Terminal Command Bar */}
      <div className="card-surface px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-orange-500 font-bold font-mono text-sm">
            &gt;_
          </span>
          <span className="font-mono text-xs sm:text-sm font-medium">
            {command}
          </span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          leftIcon={copyIconElement}
          title="Copy command"
        >
          {copyTextElement}
        </Button>
      </div>
    </div>
  );
}
