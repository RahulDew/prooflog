import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REFERENCE_CONTENT } from "../../constants/home.constants";
import { cn } from "../../lib/utils";

export function DeveloperManual() {
  const [activeTab, setActiveTab] = useState<string>("auth");

  return (
    <section className="py-20 gsap-reveal">
      <div className="text-left mb-12">
        <span className="section-tag-blue">{REFERENCE_CONTENT.tag}</span>
        <h2 className="text-3xl font-extrabold mt-1">
          {REFERENCE_CONTENT.title}
        </h2>
        <p className="text-sm mt-1 max-w-xl text-muted-adaptive">
          {REFERENCE_CONTENT.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Tabs */}
        <div className="lg:col-span-4 space-y-2">
          {REFERENCE_CONTENT.tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full p-4 rounded-[4px] border font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer text-left",
                  isActive
                    ? "bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400 dark:bg-orange-500/10 dark:border-orange-500 shadow-sm"
                    : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 dark:bg-[#0a0a0c] dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:border-zinc-700",
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={16}
                    strokeWidth={2}
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive ? "text-orange-500" : "text-zinc-400",
                    )}
                  />
                  <span>{tab.label}</span>
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Tab Content */}
        <div className="lg:col-span-8 card-surface text-left min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "auth" && (
                <div>
                  <h3 className="text-xl font-bold mb-3">
                    API Key Authentication
                  </h3>
                  <p className="text-sm leading-relaxed mb-4 text-muted-adaptive">
                    Authenticate SDK requests using bearer token headers
                    (`Authorization: Bearer pl_live_...`). Scopes isolate write,
                    read, and verification privileges across tenant accounts.
                  </p>
                  <div className="p-4 rounded-[4px] font-mono text-xs border bg-zinc-50 text-orange-600 border-zinc-200 dark:bg-black/60 dark:text-orange-500 dark:border-zinc-800">
                    Authorization: Bearer pl_live_99f23a88c12b
                  </div>
                </div>
              )}
              {activeTab === "ingest" && (
                <div>
                  <h3 className="text-xl font-bold mb-3">
                    Log Ingestion Specification
                  </h3>
                  <p className="text-sm leading-relaxed mb-4 text-muted-adaptive">
                    Pass arbitrary action tags and JSON payloads. ProofLog
                    canonicalizes the JSON string representation
                    deterministically before computing the cryptographic SHA
                    hash chain.
                  </p>
                  <div className="p-4 rounded-[4px] font-mono text-xs border bg-zinc-50 text-blue-600 border-zinc-200 dark:bg-black/60 dark:text-blue-400 dark:border-zinc-800">
                    await client.ingest('org_123', &#123; action: 'user.login'
                    &#125;);
                  </div>
                </div>
              )}
              {activeTab === "dedupe" && (
                <div>
                  <h3 className="text-xl font-bold mb-3">
                    Idempotency & Deduplication
                  </h3>
                  <p className="text-sm leading-relaxed mb-4 text-muted-adaptive">
                    Specify unique idempotency keys during retries. If a
                    duplicate request occurs due to network timeouts, the system
                    returns the original sequence hash without inserting
                    duplicate records.
                  </p>
                </div>
              )}
              {activeTab === "verify" && (
                <div>
                  <h3 className="text-xl font-bold mb-3">
                    Cryptographic Chain Verification
                  </h3>
                  <p className="text-sm leading-relaxed mb-4 text-muted-adaptive">
                    Executes zero-trust verification routines over historical
                    blocks to ensure no database administrator or malicious
                    actor has retroactively modified audit records.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
