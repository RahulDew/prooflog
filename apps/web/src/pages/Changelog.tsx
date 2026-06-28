import { GitCommit } from "lucide-react"

export default function Changelog() {
  const releases = [
    {
      version: "v0.1.2",
      date: "June 29, 2026",
      title: "Performance Optimizations & React Support",
      type: "feature",
      description: "Added code-splitting via React.lazy and optimized the Vite build process. The SDK now uses highly optimized cryptographic hashing algorithms internally.",
      changes: [
        "Introduced @prooflog/web core landing page",
        "Code splitting and lazy loading for web client",
        "Removed unnecessary dependencies (clsx, tailwind-merge)"
      ]
    },
    {
      version: "v0.1.0",
      date: "June 25, 2026",
      title: "Initial Alpha Release",
      type: "major",
      description: "The very first release of the ProofLog Node.js SDK. Introduces the core primitives for zero-trust immutable audit logging.",
      changes: [
        "log.ingest() for appending secure logs",
        "log.verify() for cryptographic chain validation",
        "log.getEntries() to fetch history"
      ]
    }
  ]

  return (
    <div className="pt-24 min-h-screen relative pb-24">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(79,70,229,0.1),transparent_50%)]" />

      <main className="relative z-10 max-w-3xl mx-auto px-6">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-50 tracking-tight mb-4">
            Changelog
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            New updates and improvements to ProofLog SDK and Web UI.
          </p>
        </div>

        <div className="space-y-16">
          {releases.map((release, i) => (
            <div key={i} className="relative pl-8 md:pl-0">
              
              {/* Timeline line */}
              <div className="absolute left-[11px] md:left-[156px] top-2 bottom-[-64px] w-px bg-white/10 last:bg-transparent" />
              
              <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                <div className="md:w-32 shrink-0 pt-1 relative">
                  {/* Timeline Dot */}
                  <div className="absolute left-[-29px] md:left-[151px] top-2.5 w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_theme(colors.indigo.500)]" />
                  <span className="text-sm font-mono text-zinc-500">{release.date}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-50">{release.version}</h2>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {release.type}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-200 mb-4">{release.title}</h3>
                  <p className="text-zinc-400 leading-relaxed mb-6">
                    {release.description}
                  </p>

                  <ul className="space-y-3">
                    {release.changes.map((change, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-zinc-300">
                        <GitCommit className="w-4 h-4 text-zinc-600 mt-0.5 shrink-0" />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
