import { Book, Code, Terminal, Zap } from "lucide-react";
import { SIDEBAR_LINKS, DOC_SECTIONS } from "../constants/docs.constants";
import { useTheme } from "../context/ThemeContext";

const ICON_MAP = {
  Zap,
  Terminal,
  Code,
  Book,
};

export default function Docs() {
  const { isDark } = useTheme();
  const intro = DOC_SECTIONS.find((s) => s.id === "introduction");

  return (
    <div
      className={`pt-24 min-h-screen transition-colors ${
        isDark ? "bg-[#050505] text-zinc-100" : "bg-white text-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12 relative z-10 pb-20">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 md:sticky md:top-24 h-fit self-start">
          <h3 className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold mb-4">
            Getting Started
          </h3>
          <ul className="space-y-1 mb-8">
            {SIDEBAR_LINKS.map((link) => {
              const IconComponent = ICON_MAP[link.iconName];
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className={`flex items-center gap-2 text-xs font-mono px-3 py-2 rounded-none transition-colors border ${
                      isDark
                        ? "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-800"
                        : "border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 hover:border-zinc-300"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0" />
                    <span>{link.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <h3 className="text-xs font-mono uppercase tracking-widest text-blue-500 font-bold mb-4">
            Core Concepts
          </h3>
          <ul className="space-y-1">
            <li>
              <a
                href="#immutable-logs"
                className={`flex items-center gap-2 text-xs font-mono px-3 py-2 rounded-none transition-colors border ${
                  isDark
                    ? "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-800"
                    : "border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 hover:border-zinc-300"
                }`}
              >
                <Book className="w-4 h-4 shrink-0" />
                <span>Immutable Logs</span>
              </a>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-3xl text-left">
          <div className="mb-10">
            <h1
              id="introduction"
              className="text-4xl font-extrabold tracking-tight mb-4 scroll-mt-24"
            >
              {intro?.title || "Introduction to ProofLog"}
            </h1>
            <p className={`text-base leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              {intro?.description}
            </p>
          </div>

          <div className="space-y-10">
            <div>
              <h2
                id="immutable-logs"
                className={`text-2xl font-bold mb-4 pb-2 border-b scroll-mt-24 ${
                  isDark ? "border-zinc-800" : "border-zinc-200"
                }`}
              >
                Why Immutable Logs?
              </h2>
              <p className={`text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                In traditional systems, if a database is breached, the attacker can modify the logs to cover their tracks. With ProofLog, any modification breaks the cryptographic chain, making tampering mathematically impossible to hide.
              </p>
            </div>

            {DOC_SECTIONS.filter((section) => section.id !== "introduction").map((section) => (
              <div key={section.id}>
                <h2
                  id={section.id}
                  className={`text-2xl font-bold mb-4 pb-2 border-b scroll-mt-24 ${
                    isDark ? "border-zinc-800" : "border-zinc-200"
                  }`}
                >
                  {section.title}
                </h2>
                <p className={`text-sm leading-relaxed mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  {section.description}
                </p>
                {section.codeBlock && (
                  <div
                    className={`rounded-none border overflow-hidden mb-6 ${
                      isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-[#18181b] border-zinc-800 text-gray-100"
                    }`}
                  >
                    {section.codeLanguage === "terminal" && (
                      <div className="px-4 py-2 border-b border-zinc-800 bg-black/40 flex items-center">
                        <span className="text-xs font-mono text-zinc-500">terminal</span>
                      </div>
                    )}
                    <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-zinc-300">
                      {section.codeLanguage === "terminal" ? (
                        <div>
                          <span className="text-blue-400">$</span> {section.codeBlock.replace("$ ", "")}
                        </div>
                      ) : (
                        <pre>
                          <code>{section.codeBlock}</code>
                        </pre>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
