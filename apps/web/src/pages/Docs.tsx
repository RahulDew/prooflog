import { useState, useEffect, useRef } from "react";
import { Info, AlertTriangle, Lightbulb } from "lucide-react";
import {
  DOC_CATEGORIES,
  DOC_SECTIONS,
  type DocSection,
} from "../constants/docs.constants";
import { useTheme } from "../context/ThemeContext";
import { CodeBlock } from "../components/CodeBlock";
import { PackageManagerInstall } from "../components/PackageManagerInstall";
import { cn } from "../lib/utils";

const ALL_SECTION_IDS = DOC_SECTIONS.map((s) => s.id);

const CATEGORY_ANCHORS: Record<string, string> = {};
DOC_CATEGORIES.forEach((cat) => {
  if (cat.links.length > 0) CATEGORY_ANCHORS[cat.title] = cat.links[0].id;
});

export default function Docs() {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState<string>(
    ALL_SECTION_IDS[0],
  );
  const observerRef = useRef<IntersectionObserver | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const visibleSections = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        if (visibleSections.size === 0) return;
        let topId = "";
        let topRatio = 0;
        visibleSections.forEach((ratio, id) => {
          if (ratio > topRatio) {
            topRatio = ratio;
            topId = id;
          }
        });
        if (topId) setActiveSection(topId);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    ALL_SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div
      className={cn(
        "pt-24 min-h-screen transition-colors duration-300",
        isDark ? "bg-[#050505] text-zinc-100" : "bg-white text-zinc-900",
      )}
    >
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(rgba(255,255,255,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.035) 1px,transparent 1px)"
              : "linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 35%,black 30%,rgba(0,0,0,0.4) 65%,transparent 90%)",
            maskImage:
              "radial-gradient(circle at 50% 35%,black 30%,rgba(0,0,0,0.4) 65%,transparent 90%)",
          }}
        />
      </div>

      {/* MOBILE: Clean & Spacious Sticky Navigation Header */}
      <div
        className={cn(
          "md:hidden sticky top-16 z-30 border-b backdrop-blur-xl transition-colors duration-300 py-3 space-y-2.5 px-4 shadow-sm",
          isDark
            ? "bg-[#050505]/95 border-zinc-800/90 text-zinc-100"
            : "bg-white/95 border-zinc-200 text-zinc-900",
        )}
      >
        {/* Category Selection Pills */}
        <div
          ref={tabsRef}
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {DOC_CATEGORIES.map((cat) => {
            const isActive = cat.links.some((l) => l.id === activeSection);
            return (
              <button
                key={cat.title}
                type="button"
                data-cat={cat.title}
                onClick={() => scrollToSection(CATEGORY_ANCHORS[cat.title])}
                className={cn(
                  "shrink-0 text-xs font-mono px-3.5 py-1.5 rounded-[4px] border transition-colors duration-300 whitespace-nowrap cursor-pointer",
                  isActive
                    ? "border-orange-500 text-orange-500 bg-orange-500/10 font-bold shadow-sm"
                    : isDark
                      ? "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 bg-zinc-900/60"
                      : "border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 bg-zinc-50",
                )}
              >
                {cat.title}
              </button>
            );
          })}
        </div>

        {/* Sub-section Links Pills */}
        <div
          className="flex gap-2 overflow-x-auto pt-2 pb-1 border-t border-zinc-200 dark:border-zinc-800/70"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {DOC_CATEGORIES.find((c) =>
            c.links.some((l) => l.id === activeSection),
          )?.links.map((link) => {
            const isSubActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className={cn(
                  "shrink-0 text-[11px] font-mono px-3 py-1 rounded-[4px] border transition-colors duration-300 whitespace-nowrap cursor-pointer",
                  isSubActive
                    ? isDark
                      ? "border-orange-500/40 text-orange-400 bg-orange-500/10 font-bold"
                      : "border-orange-500/40 text-orange-600 bg-orange-500/10 font-bold"
                    : isDark
                      ? "border-transparent text-zinc-500 hover:text-zinc-300"
                      : "border-transparent text-zinc-500 hover:text-zinc-800",
                )}
              >
                {link.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12 relative z-10 pb-28">
        {/* DESKTOP Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 sticky top-24 h-fit self-start">
          <div className="space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
            {DOC_CATEGORIES.map((cat, idx) => (
              <div key={idx}>
                <h3 className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold mb-2">
                  {cat.title}
                </h3>
                <ul className="space-y-0.5">
                  {cat.links.map((link) => {
                    const isActive = activeSection === link.id;
                    return (
                      <li key={link.id}>
                        <button
                          type="button"
                          onClick={() => scrollToSection(link.id)}
                          className={cn(
                            "w-full text-left text-xs font-mono px-3 py-1.5 rounded-[4px] border cursor-pointer transition-colors duration-300",
                            isActive
                              ? isDark
                                ? "border-orange-500/40 text-white bg-orange-500/10 font-medium"
                                : "border-orange-500/40 text-zinc-900 bg-orange-500/10 font-medium"
                              : isDark
                                ? "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-800"
                                : "border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 hover:border-zinc-300",
                          )}
                        >
                          {isActive && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mr-2 mb-0.5" />
                          )}
                          {link.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl text-left space-y-16 pt-6 md:pt-0">
          {DOC_SECTIONS.map((section: DocSection) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-40 md:scroll-mt-28"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-500 bg-orange-500/10 px-2 py-0.5 border border-orange-500/30 rounded-[4px]">
                  {section.category}
                </span>
              </div>
              <h2
                className={cn(
                  "text-3xl font-extrabold tracking-tight mb-4 pb-3 border-b transition-colors duration-300",
                  isDark
                    ? "border-zinc-800 text-zinc-100"
                    : "border-zinc-200 text-zinc-900",
                )}
              >
                {section.title}
              </h2>

              <p
                className={cn(
                  "text-sm leading-relaxed mb-6 transition-colors duration-300",
                  isDark ? "text-zinc-400" : "text-zinc-600",
                )}
              >
                {section.description}
              </p>

              {section.callout && (
                <div
                  className={cn(
                    "p-4 mb-6 rounded-[4px] border flex items-start gap-3 text-xs leading-relaxed transition-colors duration-300",
                    section.callout.type === "important"
                      ? isDark
                        ? "bg-red-500/10 border-red-500/30 text-red-300"
                        : "bg-red-50 border-red-200 text-red-800"
                      : section.callout.type === "tip"
                        ? isDark
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : isDark
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
                          : "bg-blue-50 border-blue-200 text-blue-800",
                  )}
                >
                  {section.callout.type === "important" ? (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  ) : section.callout.type === "tip" ? (
                    <Lightbulb className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 shrink-0 text-blue-500 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold uppercase font-mono mr-1">
                      {section.callout.type}:
                    </span>
                    <span>{section.callout.text}</span>
                  </div>
                </div>
              )}

              {section.table && (
                <div
                  className={cn(
                    "mb-6 rounded-[4px] border overflow-hidden transition-colors duration-300",
                    isDark
                      ? "bg-[#0a0a0c] border-zinc-800"
                      : "bg-white border-zinc-300 shadow-sm",
                  )}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr
                          className={cn(
                            "border-b transition-colors duration-300",
                            isDark
                              ? "border-zinc-800 bg-black/40 text-zinc-400"
                              : "border-zinc-200 bg-zinc-50 text-zinc-600",
                          )}
                        >
                          {section.table.headers.map((h, i) => (
                            <th key={i} className="py-3 px-4 font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody
                        className={cn(
                          "divide-y transition-colors duration-300",
                          isDark ? "divide-zinc-800/60" : "divide-zinc-200",
                        )}
                      >
                        {section.table.rows.map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            className={cn(
                              "transition-colors duration-300",
                              isDark
                                ? "hover:bg-white/[0.02]"
                                : "hover:bg-zinc-50",
                            )}
                          >
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={cn(
                                  "py-3 px-4 transition-colors duration-300",
                                  cIdx === 0
                                    ? "font-bold text-orange-500"
                                    : isDark
                                      ? "text-zinc-300"
                                      : "text-zinc-700",
                                )}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {section.id === "installation" ? (
                <PackageManagerInstall />
              ) : (
                section.codeBlock && (
                  <CodeBlock
                    code={section.codeBlock}
                    language={section.codeLanguage || "typescript"}
                    isDark={isDark}
                  />
                )
              )}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
