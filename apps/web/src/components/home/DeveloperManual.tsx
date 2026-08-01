import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REFERENCE_CONTENT } from "../../constants/home.constants";

import { useTheme } from "../../context/ThemeContext";

export function DeveloperManual() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<string>("auth");

  return (
    <section className="py-20 gsap-reveal">
      <div className="text-left mb-12">
        <span className="section-tag-blue">
          {REFERENCE_CONTENT.tag}
        </span>
        <h2 className="text-3xl font-extrabold mt-1">{REFERENCE_CONTENT.title}</h2>
        <p className={`text-sm mt-1 max-w-xl ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
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
                onClick={() => setActiveTab(tab.id)}
                className={`w-full p-4 rounded-[4px] text-left font-mono text-xs uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer ${
                  isActive
                    ? isDark
                      ? "bg-zinc-800 text-white border border-zinc-700 font-bold"
                      : "bg-blue-600 text-white border border-blue-600 font-bold"
                    : isDark
                    ? "bg-[#0a0a0c] border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                    : "bg-zinc-100 border border-zinc-300 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tab Content */}
        <div className={`lg:col-span-8 p-8 rounded-[4px] border text-left min-h-[220px] ${isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-white border-zinc-300 shadow-sm"}`}>
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
                  <h3 className="text-xl font-bold mb-3">API Key Authentication</h3>
                  <p className={`text-sm leading-relaxed mb-4 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    Authenticate SDK requests using bearer token headers (`Authorization: Bearer pl_live_...`). Scopes isolate write, read, and verification privileges across tenant accounts.
                  </p>
                  <div className={`p-4 rounded-[4px] font-mono text-xs border ${isDark ? "bg-black/60 text-orange-500 border-zinc-800" : "bg-zinc-50 text-orange-600 border-zinc-200"}`}>
                    Authorization: Bearer pl_live_99f23a88c12b
                  </div>
                </div>
              )}
              {activeTab === "ingest" && (
                <div>
                  <h3 className="text-xl font-bold mb-3">Log Ingestion Specification</h3>
                  <p className={`text-sm leading-relaxed mb-4 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    Pass arbitrary action tags and JSON payloads. ProofLog canonicalizes the JSON string representation deterministically before computing the cryptographic SHA hash chain.
                  </p>
                  <div className={`p-4 rounded-[4px] font-mono text-xs border ${isDark ? "bg-black/60 text-blue-400 border-zinc-800" : "bg-zinc-50 text-blue-600 border-zinc-200"}`}>
                    await client.ingest('org_123', &#123; action: 'user.login' &#125;);
                  </div>
                </div>
              )}
              {activeTab === "dedupe" && (
                <div>
                  <h3 className="text-xl font-bold mb-3">Idempotency & Deduplication</h3>
                  <p className={`text-sm leading-relaxed mb-4 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    Specify unique idempotency keys during retries. If a duplicate request occurs due to network timeouts, the system returns the original sequence hash without inserting duplicate records.
                  </p>
                </div>
              )}
              {activeTab === "verify" && (
                <div>
                  <h3 className="text-xl font-bold mb-3">Cryptographic Chain Verification</h3>
                  <p className={`text-sm leading-relaxed mb-4 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    Executes zero-trust verification routines over historical blocks to ensure no database administrator or malicious actor has retroactively modified audit records.
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
