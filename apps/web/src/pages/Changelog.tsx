import { GitCommit } from "lucide-react";
import { RELEASES } from "../constants/changelog.constants";
import { useTheme } from "../context/ThemeContext";

export default function Changelog() {
  const { isDark } = useTheme();

  return (
    <div
      className={`pt-24 min-h-screen relative pb-24 transition-colors ${
        isDark ? "bg-[#050505] text-zinc-100" : "bg-white text-zinc-900"
      }`}
    >
      <main className="relative z-10 max-w-3xl mx-auto px-6 text-left">
        <div className="mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">Updates</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 mt-1">
            Changelog
          </h1>
          <p className={`text-base leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            New updates and improvements to ProofLog SDK and Web UI.
          </p>
        </div>

        <div className="space-y-16">
          {RELEASES.map((release, i) => (
            <div key={i} className="relative pl-8 md:pl-0">
              <div className={`absolute left-[11px] md:left-[156px] top-2 bottom-[-64px] w-px ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />

              <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                <div className="md:w-32 shrink-0 pt-1 relative">
                  {/* Square Timeline Node */}
                  <div className="absolute left-[-27px] md:left-[153px] top-2.5 w-2.5 h-2.5 bg-orange-500" />
                  <span className="text-xs font-mono text-zinc-500">{release.date}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold font-mono">{release.version}</h2>
                    <span
                      className={`px-2 py-0.5 rounded-none text-[10px] font-bold font-mono uppercase tracking-wider border ${
                        release.type === "major"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                          : release.type === "minor"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {release.type}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-orange-500 mb-3">{release.title}</h3>
                  <p className={`text-xs leading-relaxed mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    {release.description}
                  </p>

                  <ul className="space-y-3 font-mono text-xs">
                    {release.changes.map((change, j) => (
                      <li key={j} className={`flex items-start gap-3 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                        <GitCommit className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
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
  );
}
