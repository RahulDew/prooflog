import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CTA_FOOTER_CONTENT } from "../../constants/home.constants";

export interface CtaFooterSectionProps {
  isDark: boolean;
}

export function CtaFooterSection({ isDark }: CtaFooterSectionProps) {
  return (
    <section className="py-24 text-center gsap-reveal">
      <div
        className={`p-12 rounded-[4px] border relative overflow-hidden ${
          isDark
            ? "bg-[#0a0a0c] border-zinc-800"
            : "bg-zinc-50 border-zinc-300"
        }`}
      >
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          {CTA_FOOTER_CONTENT.title}
        </h2>
        <p className={`text-base max-w-xl mx-auto mb-8 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
          {CTA_FOOTER_CONTENT.description}
        </p>
        <div className="flex justify-center">
          <Link
            to={CTA_FOOTER_CONTENT.primaryCtaLink}
            className="btn-primary"
          >
            <span>{CTA_FOOTER_CONTENT.primaryCtaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
