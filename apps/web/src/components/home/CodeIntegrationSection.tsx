import { Check } from "lucide-react";

interface CodeIntegrationSectionProps {
  isDark: boolean;
}

export function CodeIntegrationSection({ isDark }: CodeIntegrationSectionProps) {
  return (
    <section className="py-20 gsap-reveal">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 text-left space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-500 font-bold">Integration</span>
          <h2 className="text-3xl font-extrabold">Two Lines of Code for Eternal Validity.</h2>
          <p className={`text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            Drop the ProofLog Node.js SDK into your microservices or API routes to generate tamper-proof audit trails out of the box.
          </p>
          <div className="space-y-3">
            {[
              "Zero client configuration required",
              "Dynamic hash chaining & sequence locking",
              "Built-in idempotency key handling"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-medium">
                <div className="w-4 h-4 bg-emerald-500/10 border border-emerald-500/40 grid place-items-center shrink-0 rounded-none">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Code Editor Window */}
        <div className="lg:col-span-7">
          <div
            className={`rounded-none border transition-colors ${
              isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-[#18181b] border-zinc-800 text-gray-100"
            }`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-black/40">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500" />
                <div className="w-3 h-3 bg-yellow-500" />
                <div className="w-3 h-3 bg-green-500" />
                <span className="ml-2 text-xs font-mono text-zinc-400">prooflog-server.ts</span>
              </div>
              <span className="text-xs font-mono text-zinc-500">TypeScript</span>
            </div>
            <div className="p-6 text-xs font-mono leading-relaxed text-left overflow-x-auto">
              <pre>
                <code className="text-blue-400">import</code> {"{ ProofLog }"}{" "}
                <code className="text-blue-400">from</code>{" "}
                <code className="text-emerald-400">'@prooflog/node'</code>;<br />
                <br />
                <code className="text-zinc-500">// Initialize client instance</code><br />
                <code className="text-blue-400">const</code> client ={" "}
                <code className="text-blue-400">new</code> ProofLog({"{"} apiKey:{" "}
                <code className="text-emerald-400">process.env.PROOFLOG_API_KEY</code> {"}"});<br />
                <br />
                <code className="text-zinc-500">// Ingest immutable audit event block</code><br />
                <code className="text-blue-400">await</code> client.ingest(
                <code className="text-emerald-400">'org_1234'</code>, {"{"}<br />
                {"  "}action: <code className="text-emerald-400">'billing.invoice_paid'</code>,<br />
                {"  "}actor: {"{"} id: <code className="text-emerald-400">'usr_99'</code> {"}"},<br />
                {"  "}idempotencyKey: <code className="text-emerald-400">'req_invoice_99'</code><br />
                {"}"});
              </pre>
            </div>
            <div className="px-6 py-3 border-t border-zinc-800 bg-black/60 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400" />
                Info: Block #1042 successfully appended & verified
              </span>
              <span className="text-zinc-500">Latency: 8ms</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
