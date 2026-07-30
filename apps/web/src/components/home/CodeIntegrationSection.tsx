import { Check } from "lucide-react";
import { CodeBlock } from "../CodeBlock";

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
          <CodeBlock
            title="prooflog-server.ts"
            language="typescript"
            isDark={isDark}
            code={`import { ProofLog } from '@prooflog/node';

// Initialize client instance
const client = new ProofLog({ apiKey: process.env.PROOFLOG_API_KEY });

// Ingest immutable audit event block
await client.ingest('org_1234', {
  action: 'billing.invoice_paid',
  actor: { id: 'usr_99' },
  idempotencyKey: 'req_invoice_99'
});`}
          />
        </div>
      </div>
    </section>
  );
}
