import { Link } from "react-router-dom"
import { ArrowRight, Terminal } from "lucide-react"

export default function Home() {
  return (
    <div className="relative pt-[64px] min-h-screen">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(820px_540px_at_50%_-8%,rgba(79,70,229,0.15),transparent_70%),radial-gradient(680px_480px_at_86%_12%,rgba(56,189,248,0.05),transparent_70%)]" />
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-50"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          maskImage: 'radial-gradient(900px 720px at 50% 0%, rgb(0, 0, 0) 35%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(900px 720px at 50% 0%, rgb(0, 0, 0) 35%, transparent 80%)'
        }}
      />

      <main className="relative z-10">
        <header className="max-w-7xl mx-auto px-6 pt-24 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md text-[12.5px] text-indigo-300 font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_theme(colors.indigo.400)] animate-pulse" />
            ProofLog SDK v0.1.2 is now live
          </div>
          
          <h1 className="text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-tight font-extrabold max-w-[860px] mx-auto text-gray-50">
            Immutable Audit Logs.<br/>
            <span className="bg-gradient-to-r from-indigo-300 to-indigo-600 bg-clip-text text-transparent">
              Zero Trust Required.
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-[620px] mx-auto mt-6 leading-relaxed">
            Cryptographically secure logging for Node.js & NestJS. Every log entry is cryptographically linked, creating a verifiable chain of custody for your most sensitive operations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link to="/docs" className="h-[46px] px-6 rounded-xl bg-gray-50 text-dark-bg font-semibold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center no-underline">
              Start Building
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="h-[46px] px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
              <Terminal className="w-4 h-4 text-zinc-400" />
              npm i @prooflog/node
            </button>
          </div>
        </header>

        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="rounded-2xl border border-white/10 bg-[#0c0b10]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="ml-2 text-xs font-mono text-zinc-500">prooflog-demo.ts</div>
            </div>
            <div className="p-6 overflow-x-auto text-sm font-mono leading-relaxed text-zinc-300">
              <pre>
                <code className="text-indigo-400">import</code> {'{ ProofLog }'} <code className="text-indigo-400">from</code> <code className="text-emerald-300">'@prooflog/node'</code>;<br/><br/>
                <code className="text-zinc-500">{"// 1. Initialize the client"}</code><br/>
                <code className="text-indigo-400">const</code> log = <code className="text-indigo-400">new</code> ProofLog({'{'} apiKey: <code className="text-emerald-300">'YOUR_API_KEY'</code> {'}'});<br/><br/>
                <code className="text-zinc-500">{"// 2. Ingest an immutable log"}</code><br/>
                <code className="text-indigo-400">await</code> log.ingest(<code className="text-emerald-300">'org_123'</code>, {'{'}<br/>
                {'  '}action: <code className="text-emerald-300">'user.login'</code>,<br/>
                {'  '}actor: {'{'} id: <code className="text-emerald-300">'usr_1'</code> {'}'},<br/>
                {'  '}metadata: {'{'} ip: <code className="text-emerald-300">'192.168.1.1'</code> {'}'}<br/>
                {'}'});<br/><br/>
                <code className="text-zinc-500">{"// 3. Verify the hash chain cryptographically"}</code><br/>
                <code className="text-indigo-400">const</code> result = <code className="text-indigo-400">await</code> log.verify(<code className="text-emerald-300">'org_123'</code>);<br/>
                console.log(result.valid); <code className="text-zinc-500">{"// true"}</code>
              </pre>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
