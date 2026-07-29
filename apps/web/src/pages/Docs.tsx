import { useState } from "react";
import { Search, Copy, Check, Info, AlertTriangle, Lightbulb } from "lucide-react";
import { DOC_CATEGORIES, DOC_SECTIONS, type DocSection } from "../constants/docs.constants";
import { useTheme } from "../context/ThemeContext";

export default function Docs() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Filter sidebar categories based on search query
  const filteredCategories = DOC_CATEGORIES.map((cat) => ({
    ...cat,
    links: cat.links.filter((link) =>
      link.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter((cat) => cat.links.length > 0);

  return (
    <div
      className={`pt-24 min-h-screen transition-colors ${
        isDark ? "bg-[#050505] text-zinc-100" : "bg-white text-zinc-900"
      }`}
    >
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px)"
              : "linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            WebkitMaskImage: "radial-gradient(circle at 50% 35%, black 30%, rgba(0, 0, 0, 0.4) 65%, transparent 90%)",
            maskImage: "radial-gradient(circle at 50% 35%, black 30%, rgba(0, 0, 0, 0.4) 65%, transparent 90%)"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12 relative z-10 pb-28">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 md:sticky md:top-24 h-fit self-start">
          {/* Search Box */}
          <div className="relative mb-6">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-xs font-mono rounded-none border focus:outline-none transition-colors ${
                isDark
                  ? "bg-[#0a0a0c] border-zinc-800 text-zinc-200 focus:border-orange-500"
                  : "bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-blue-600"
              }`}
            />
          </div>

          <div className="space-y-6 max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
            {filteredCategories.map((cat, idx) => (
              <div key={idx}>
                <h3 className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold mb-2">
                  {cat.title}
                </h3>
                <ul className="space-y-1">
                  {cat.links.map((link) => (
                    <li key={link.id}>
                      <a
                        href={`#${link.id}`}
                        className={`block text-xs font-mono px-3 py-1.5 rounded-none transition-colors border ${
                          isDark
                            ? "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-800"
                            : "border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 hover:border-zinc-300"
                        }`}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl text-left space-y-16">
          {DOC_SECTIONS.map((section: DocSection) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-500 bg-orange-500/10 px-2 py-0.5 border border-orange-500/30">
                  {section.category}
                </span>
              </div>
              <h2 className={`text-3xl font-extrabold tracking-tight mb-4 pb-3 border-b ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                {section.title}
              </h2>

              <p className={`text-sm leading-relaxed mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                {section.description}
              </p>

              {/* Callout Alert */}
              {section.callout && (
                <div
                  className={`p-4 mb-6 rounded-none border flex items-start gap-3 text-xs leading-relaxed ${
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
                      : "bg-blue-50 border-blue-200 text-blue-800"
                  }`}
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

              {/* Parameter Table */}
              {section.table && (
                <div className={`mb-6 rounded-none border overflow-hidden ${isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-white border-zinc-300 shadow-sm"}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className={`border-b ${isDark ? "border-zinc-800 bg-black/40 text-zinc-400" : "border-zinc-200 bg-zinc-50 text-zinc-600"}`}>
                          {section.table.headers.map((h, i) => (
                            <th key={i} className="py-3 px-4 font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? "divide-zinc-800/60" : "divide-zinc-200"}`}>
                        {section.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className={isDark ? "hover:bg-white/[0.02]" : "hover:bg-zinc-50"}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className={`py-3 px-4 ${cIdx === 0 ? "font-bold text-orange-500" : isDark ? "text-zinc-300" : "text-zinc-700"}`}>
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

              {/* Code Block Snippet */}
              {section.codeBlock && (
                <div
                  className={`rounded-none border overflow-hidden dark-hover-shimmer ${
                    isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-[#18181b] border-zinc-800 text-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-black/40">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-red-500" />
                      <div className="w-2.5 h-2.5 bg-yellow-500" />
                      <div className="w-2.5 h-2.5 bg-green-500" />
                      <span className="ml-2 text-xs font-mono text-zinc-400">
                        {section.codeLanguage || "code"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(section.codeBlock!, section.id)}
                      className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-white cursor-pointer"
                    >
                      {copiedId === section.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-zinc-300">
                    <pre>
                      <code>{section.codeBlock}</code>
                    </pre>
                  </div>
                </div>
              )}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
