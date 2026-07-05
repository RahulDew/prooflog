import { Book, Code, Terminal, Zap } from "lucide-react"

export default function Docs() {
  return (
    <div className="pt-24 min-h-screen">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(820px_540px_at_10%_10%,rgba(79,70,229,0.1),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12 relative z-10 pb-20">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Getting Started</h3>
            <ul className="space-y-1 mb-8">
              <li><a href="#introduction" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-gray-200 px-3 py-2 rounded-lg transition-colors"><Zap className="w-4 h-4"/> Introduction</a></li>
              <li><a href="#installation" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-gray-200 px-3 py-2 rounded-lg transition-colors"><Terminal className="w-4 h-4"/> Installation</a></li>
              <li><a href="#basic-usage" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-gray-200 px-3 py-2 rounded-lg transition-colors"><Code className="w-4 h-4"/> Basic Usage</a></li>
            </ul>

            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Core Concepts</h3>
            <ul className="space-y-1">
              <li><a href="#immutable-logs" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-gray-200 px-3 py-2 rounded-lg transition-colors"><Book className="w-4 h-4"/> Immutable Logs</a></li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-3xl">
          <div className="mb-10">
            <h1 id="introduction" className="text-4xl font-extrabold text-gray-50 tracking-tight mb-4 scroll-mt-24">Introduction to ProofLog</h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              ProofLog is a zero-trust audit logging system. Every log you ingest is hashed and cryptographically linked to the previous one, forming an unbreakable chain. 
            </p>
          </div>

          <div className="prose prose-invert prose-indigo max-w-none">
            <h2 id="immutable-logs" className="text-2xl font-bold text-gray-50 mb-4 mt-12 border-b border-white/10 pb-2 scroll-mt-24">Why Immutable Logs?</h2>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              In traditional systems, if a database is breached, the attacker can modify the logs to cover their tracks. With ProofLog, any modification breaks the cryptographic chain, making tampering mathematically impossible to hide.
            </p>

            <h2 id="installation" className="text-2xl font-bold text-gray-50 mb-4 mt-12 border-b border-white/10 pb-2 scroll-mt-24">Quick Installation</h2>
            <div className="rounded-xl border border-white/10 bg-[#0c0b10]/80 overflow-hidden mb-6">
              <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02] flex items-center">
                <span className="text-xs font-mono text-zinc-500">terminal</span>
              </div>
              <div className="p-4 text-sm font-mono text-zinc-300">
                <span className="text-indigo-400">$</span> pnpm add @prooflog/node
              </div>
            </div>

            <h2 id="basic-usage" className="text-2xl font-bold text-gray-50 mb-4 mt-12 border-b border-white/10 pb-2 scroll-mt-24">Basic Usage</h2>
            <div className="rounded-xl border border-white/10 bg-[#0c0b10]/80 overflow-hidden">
              <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-zinc-300">
                <pre>
                  <code className="text-indigo-400">import</code> {'{ ProofLog }'} <code className="text-indigo-400">from</code> <code className="text-emerald-300">'@prooflog/node'</code>;<br/><br/>
                  <code className="text-indigo-400">const</code> client = <code className="text-indigo-400">new</code> ProofLog({'{'} apiKey: <code className="text-emerald-300">'YOUR_API_KEY'</code> {'}'});<br/>
                  <code className="text-indigo-400">await</code> client.ingest(<code className="text-emerald-300">'org_123'</code>, {'{'} action: <code className="text-emerald-300">'user.login'</code>, actor: {'{'} id: <code className="text-emerald-300">'usr_1'</code> {'}'} {'}'});
                </pre>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
