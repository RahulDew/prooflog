import { Book, Code, Terminal, Zap } from "lucide-react"
import { SIDEBAR_LINKS, DOC_SECTIONS } from "../constants/docs.constants"

const ICON_MAP = {
  Zap,
  Terminal,
  Code,
  Book,
}

export default function Docs() {
  const intro = DOC_SECTIONS.find((s) => s.id === "introduction")
  return (
    <div className="pt-24 min-h-screen">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(820px_540px_at_10%_10%,rgba(59,130,246,0.06),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12 relative z-10 pb-20">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 md:sticky md:top-24 h-fit self-start">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Getting Started</h3>
          <ul className="space-y-1 mb-8">
            {SIDEBAR_LINKS.map((link) => {
              const IconComponent = ICON_MAP[link.iconName]
              return (
                <li key={link.id}>
                  <a 
                    href={`#${link.id}`} 
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-gray-200 px-3 py-2 rounded-lg transition-colors"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{link.name}</span>
                  </a>
                </li>
              )
            })}
          </ul>

          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Core Concepts</h3>
          <ul className="space-y-1">
            <li>
              <a href="#immutable-logs" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-gray-200 px-3 py-2 rounded-lg transition-colors">
                <Book className="w-4 h-4"/> 
                <span>Immutable Logs</span>
              </a>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-3xl">
          <div className="mb-10">
            <h1 id="introduction" className="text-4xl font-extrabold text-gray-50 tracking-tight mb-4 scroll-mt-24">
              {intro?.title || "Introduction to ProofLog"}
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              {intro?.description}
            </p>
          </div>

          <div className="prose prose-invert prose-blue max-w-none">
            <h2 id="immutable-logs" className="text-2xl font-bold text-gray-50 mb-4 mt-12 border-b border-white/10 pb-2 scroll-mt-24">
              Why Immutable Logs?
            </h2>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              In traditional systems, if a database is breached, the attacker can modify the logs to cover their tracks. With ProofLog, any modification breaks the cryptographic chain, making tampering mathematically impossible to hide.
            </p>

            {DOC_SECTIONS.filter(section => section.id !== "introduction").map((section) => (
              <div key={section.id}>
                <h2 id={section.id} className="text-2xl font-bold text-gray-50 mb-4 mt-12 border-b border-white/10 pb-2 scroll-mt-24">
                  {section.title}
                </h2>
                <p className="text-zinc-400 mb-6 leading-relaxed">
                  {section.description}
                </p>
                {section.codeBlock && (
                  <div className="rounded-xl border border-white/10 bg-[#0c0b10]/80 overflow-hidden mb-6">
                    {section.codeLanguage === "terminal" && (
                      <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02] flex items-center">
                        <span className="text-xs font-mono text-zinc-500">terminal</span>
                      </div>
                    )}
                    <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-zinc-300">
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
  )
}
