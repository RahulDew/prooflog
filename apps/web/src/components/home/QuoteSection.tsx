import { Check } from "lucide-react";

interface QuoteSectionProps {
  isDark: boolean;
}

export function QuoteSection({ isDark }: QuoteSectionProps) {
  return (
    <section className="py-20 gsap-reveal">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 text-left">
          <blockquote className="text-2xl sm:text-3xl font-extrabold italic leading-relaxed tracking-tight">
            "Every record carries its own mathematical proof of integrity. Trust is not required — it is computed."
          </blockquote>
        </div>
        <div className={`lg:col-span-5 p-6 rounded-none border text-left ${isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-white border-zinc-300 shadow-sm"}`}>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-orange-500 mb-3">Primary Validation Method</h4>
          <ul className={`space-y-2 text-xs font-mono ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>SHA-256/384/512 Hashing</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Sequential cryptographic chain linking</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Idempotency deduplication keys</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
