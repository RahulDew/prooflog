import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REFERENCE_CONTENT } from "../../constants/home.constants";
import { Button } from "../ui/Button";

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
              <Button
                key={tab.id}
                variant="pill"
                onClick={() => setActiveTab(tab.id)}
                leftIcon={<Icon className="w-4 h-4 shrink-0" />}
                className={`w-full p-4 justify-start ${
                  isActive
                    ? "bg-blue-600 border-blue-600 text-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white font-bold"
                    : ""
                }`}
              >
                {tab.label}
              </Button>
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
