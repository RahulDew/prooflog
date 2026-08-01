import { Check } from "lucide-react";
import { QUOTE_CONTENT } from "../../constants/home.constants";

export function SecurityWarranties() {
  return (
    <section className="py-20 gsap-reveal">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 text-left">
          <blockquote className="text-2xl sm:text-3xl font-extrabold italic leading-relaxed tracking-tight">
            {QUOTE_CONTENT.quote}
          </blockquote>
          <div className="mt-4 font-mono text-xs">
            <span className="font-bold text-orange-500">{QUOTE_CONTENT.author}</span>
            <span className="ml-2 text-muted-adaptive">
              — {QUOTE_CONTENT.role}, {QUOTE_CONTENT.company}
            </span>
          </div>
        </div>
        <div className="lg:col-span-5 card-surface text-left">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-orange-500 mb-3">Primary Validation Method</h4>
          <ul className="space-y-2 text-xs font-mono text-muted-adaptive">
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
