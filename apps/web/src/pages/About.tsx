import { Link } from "react-router-dom";
import {
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { ABOUT_CONTENT } from "../constants/about.constants";
import { Button } from "../components/ui/Button";
import { SEO } from "../components/SEO";

export interface AboutProps {
  className?: string;
}

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ProofLog Engine",
  url: "https://prooflog.dev/about",
  description:
    "Open-source audit logging engine designed for cryptographically verifiable log integrity and enterprise security compliance.",
};

export default function About() {
  return (
    <div className="pt-24 min-h-screen relative pb-28 transition-colors bg-[#ffffff] text-zinc-900 dark:bg-[#050505] dark:text-zinc-100">
      <SEO
        title="About & Security Architecture — ProofLog Engine"
        description="Learn about ProofLog's architectural pillars, zero-trust security model, cryptographic hash chaining guarantees, and compliance warranties."
        canonicalPath="/about"
        jsonLd={aboutJsonLd}
      />
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(circle_at_50%_35%,black_30%,rgba(0,0,0,0.4)_65%,transparent_90%)]" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 text-left space-y-16">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="badge-orange">
            <ShieldCheck size={16} strokeWidth={2} />
            <span>{ABOUT_CONTENT.badge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {ABOUT_CONTENT.title}
          </h1>

          <p className="text-base leading-relaxed text-muted-adaptive">
            {ABOUT_CONTENT.subtitle}
          </p>
        </div>

        {/* Mission Statement Card */}
        <div className="card-surface p-8 relative overflow-hidden dark-hover-shimmer">
          <span className="section-tag-orange mb-2 block">
            {ABOUT_CONTENT.missionTag}
          </span>
          <h2 className="text-2xl font-bold font-mono mb-4">
            {ABOUT_CONTENT.missionTitle}
          </h2>
          <p className="text-sm leading-relaxed text-subtle-adaptive">
            {ABOUT_CONTENT.missionText}
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="space-y-6">
          <div className="text-left">
            <span className="section-tag-blue block">Core Principles</span>
            <h2 className="text-2xl font-bold font-mono mt-1">
              Engine Architectural Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ABOUT_CONTENT.pillars.map((pillar, idx) => {
              const Icon = pillar.icon;

              return (
                <div
                  key={idx}
                  className="card-surface dark-hover-shimmer hover:border-zinc-400 dark:hover:border-zinc-700"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-[4px] bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                      <Icon size={16} strokeWidth={2} />
                    </div>
                    <h3 className="text-base font-bold font-mono">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-adaptive">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Guarantees */}
        <div className="card-surface p-8">
          <h2 className="text-xl font-bold font-mono mb-6">
            Security & Compliance Warranties
          </h2>

          <div className="space-y-4">
            {ABOUT_CONTENT.securityGuarantees.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-[4px] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border-zinc-200 dark:bg-black/50 dark:border-zinc-800/80"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-emerald-500 mt-1 shrink-0"
                  />
                  <div>
                    <h3 className="text-xs font-mono font-bold">
                      {item.title}
                    </h3>
                    <p className="text-xs mt-0.5 text-muted-adaptive">
                      {item.detail}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2.5 py-1 rounded-[4px] shrink-0 self-start sm:self-center">
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Open Source GitHub CTA */}
        <div className="card-surface p-8 text-center relative overflow-hidden dark-hover-shimmer">
          <h3 className="text-xl font-extrabold font-mono mb-2">
            {ABOUT_CONTENT.githubCtaTitle}
          </h3>
          <p className="text-xs max-w-md mx-auto mb-6 text-muted-adaptive">
            {ABOUT_CONTENT.githubCtaDesc}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              as="a"
              href={ABOUT_CONTENT.primaryCtaLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              rightIcon={<ExternalLink size={16} strokeWidth={2} />}
            >
              {ABOUT_CONTENT.primaryCtaText}
            </Button>

            <Button
              as={Link}
              to={ABOUT_CONTENT.docsCtaLink}
              variant="secondary"
              rightIcon={<ArrowRight size={16} strokeWidth={2} />}
            >
              {ABOUT_CONTENT.docsCtaText}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
