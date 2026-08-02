import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTheme } from "../context/ThemeContext";
import { INITIAL_LIVE_LOGS, type LiveLog } from "../constants/home.constants";

import { SEO } from "../components/SEO";
import { HeroHeader } from "../components/home/HeroHeader";
import { AuditLifecycle } from "../components/home/AuditLifecycle";
import { QuickStartIntegration } from "../components/home/QuickStartIntegration";
import { LiveIngestionStream } from "../components/home/LiveIngestionStream";
import { SecurityWarranties } from "../components/home/SecurityWarranties";
import { HeroCtaBanner } from "../components/home/HeroCtaBanner";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ProofLog Engine",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Cloud, Linux, macOS, Windows",
  description:
    "Zero-trust, open-source audit logging engine with SHA-256 cryptographic hash chaining for high-scale applications.",
  url: "https://prooflog.dev",
  author: {
    "@type": "Organization",
    name: "ProofLog",
  },
};

export default function Home() {
  const { isDark } = useTheme();
  const [logs, setLogs] = useState<LiveLog[]>(INITIAL_LIVE_LOGS);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate streaming live audit logs
  useEffect(() => {
    const interval = setInterval(() => {
      const actions = [
        "auth.mfa_enabled",
        "apiKey.created",
        "tenant.config_updated",
        "billing.plan_upgraded",
        "user.password_reset",
        "role.permissions_updated",
        "webhook.endpoint_added",
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const randomSeq = Math.floor(1000 + Math.random() * 9000);
      const randomHash = `sha256_${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 5)}`;
      const randomReq = `req_${Math.random().toString(36).substring(2, 7)}`;

      const newLog: LiveLog = {
        sequence: randomSeq,
        action: randomAction,
        idempotencyKey: randomReq,
        hash: randomHash,
        status: "Verified",
        timestamp: "Just now",
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 4)]);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // Staggered grid cards
      gsap.fromTo(
        ".gsap-lifecycle-card",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".gsap-lifecycle-grid",
            start: "top 80%",
          },
        },
      );
    },
    { scope: containerRef, dependencies: [isDark] },
  );

  return (
    <div
      ref={containerRef}
      className={`min-h-screen transition-colors duration-300 font-sans selection:bg-orange-500 selection:text-white overflow-x-clip ${
        isDark ? "bg-[#050505] text-zinc-100" : "bg-[#ffffff] text-zinc-900"
      }`}
    >
      <SEO
        title="ProofLog — Immutable Zero-Trust Audit Logging"
        description="ProofLog is a zero-trust, open-source audit logging engine designed for high-concurrency cloud applications with SHA-256 cryptographic hash chaining."
        canonicalPath="/"
        jsonLd={homeJsonLd}
      />
      {/* Vintage Retro Grid Pattern with Radial Vignette */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Vignette Masked Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)"
              : "linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 35%, black 30%, rgba(0, 0, 0, 0.4) 65%, transparent 90%)",
            maskImage:
              "radial-gradient(circle at 50% 35%, black 30%, rgba(0, 0, 0, 0.4) 65%, transparent 90%)",
          }}
        />
        {/* Vintage CRT Warm Sepia Center Ambient Glow */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] pointer-events-none rounded-full blur-[140px] opacity-20 ${
            isDark ? "bg-orange-600/30" : "bg-amber-400/20"
          }`}
        />
      </div>

      {/* Main Page Content */}
      <div className="relative z-10 pt-24 pb-20 max-w-7xl mx-auto px-6">
        <HeroHeader />
        <AuditLifecycle />
        <QuickStartIntegration />
        <LiveIngestionStream logs={logs} />
        <SecurityWarranties />
        <HeroCtaBanner />
      </div>
    </div>
  );
}
