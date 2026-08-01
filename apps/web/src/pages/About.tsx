import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { ABOUT_CONTENT } from "../constants/about.constants";

export interface AboutProps {
  className?: string;
}

export default function About() {
  const { isDark } = useTheme();

  return (
    <div
      className={`pt-24 min-h-screen relative pb-28 transition-colors ${
        isDark ? "bg-[#050505] text-zinc-100" : "bg-white text-zinc-900"
      }`}
    >
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)"
              : "linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            WebkitMaskImage: "radial-gradient(circle at 50% 35%, black 30%, rgba(0, 0, 0, 0.4) 65%, transparent 90%)",
            maskImage: "radial-gradient(circle at 50% 35%, black 30%, rgba(0, 0, 0, 0.4) 65%, transparent 90%)"
          }}
        />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 text-left space-y-16">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="badge-orange">
            <ShieldCheck className="w-4 h-4" />
            <span>{ABOUT_CONTENT.badge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {ABOUT_CONTENT.title}
          </h1>

          <p className={`text-base leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            {ABOUT_CONTENT.subtitle}
          </p>
        </div>

        {/* Mission Statement Card */}
        <div
          className={`p-8 rounded-[4px] border relative overflow-hidden dark-hover-shimmer ${
            isDark ? "card-dark" : "card-light"
          }`}
        >
          <span className="section-tag-orange mb-2 block">
            {ABOUT_CONTENT.missionTag}
          </span>
          <h2 className="text-2xl font-bold font-mono mb-4">
            {ABOUT_CONTENT.missionTitle}
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
            {ABOUT_CONTENT.missionText}
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="space-y-6">
          <div className="text-left">
            <span className="section-tag-blue block">
              Core Principles
            </span>
            <h2 className="text-2xl font-bold font-mono mt-1">Engine Architectural Pillars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ABOUT_CONTENT.pillars.map((pillar, idx) => {
              const Icon = pillar.icon;

              return (
                <div
                  key={idx}
                  className={`p-6 rounded-[4px] border transition-all dark-hover-shimmer ${
                    isDark
                      ? "bg-[#0a0a0c] border-zinc-800 hover:border-zinc-700"
                      : "bg-white border-zinc-300 shadow-sm hover:border-zinc-400"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-[4px] bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold font-mono">{pillar.title}</h3>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Guarantees */}
        <div
          className={`p-8 rounded-[4px] border ${
            isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-zinc-50 border-zinc-300 shadow-sm"
          }`}
        >
          <h2 className="text-xl font-bold font-mono mb-6">Security & Compliance Warranties</h2>

          <div className="space-y-4">
            {ABOUT_CONTENT.securityGuarantees.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-[4px] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDark ? "bg-black/50 border-zinc-800/80" : "bg-white border-zinc-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                  <div>
                    <h3 className="text-xs font-mono font-bold">{item.title}</h3>
                    <p className={`text-xs mt-0.5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
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
        <div
          className={`p-8 rounded-[4px] border text-center relative overflow-hidden dark-hover-shimmer ${
            isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-zinc-50 border-zinc-300"
          }`}
        >
          <h3 className="text-xl font-extrabold font-mono mb-2">{ABOUT_CONTENT.githubCtaTitle}</h3>
          <p className={`text-xs max-w-md mx-auto mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            {ABOUT_CONTENT.githubCtaDesc}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={ABOUT_CONTENT.primaryCtaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-6 rounded-[4px] bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{ABOUT_CONTENT.primaryCtaText}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <Link
              to={ABOUT_CONTENT.docsCtaLink}
              className={`h-10 px-6 rounded-[4px] border font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                isDark
                  ? "bg-zinc-900 border-zinc-700 text-zinc-200 hover:border-zinc-500"
                  : "bg-white border-zinc-300 text-zinc-800 hover:border-zinc-400"
              }`}
            >
              <span>{ABOUT_CONTENT.docsCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
