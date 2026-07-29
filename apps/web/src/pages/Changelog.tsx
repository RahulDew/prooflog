import { useState } from "react";
import { GitCommit, Tag, ExternalLink } from "lucide-react";
import { RELEASES, type ReleaseInfo } from "../constants/changelog.constants";
import { useTheme } from "../context/ThemeContext";

type FilterType = "all" | "major" | "minor" | "patch";

export default function Changelog() {
  const { isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredReleases = RELEASES.filter((release) => {
    return activeFilter === "all" || release.type === activeFilter;
  });

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

      <main className="relative z-10 max-w-4xl mx-auto px-6 text-left space-y-12">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none border text-xs font-mono uppercase tracking-wider border-orange-500/40 bg-orange-500/10 text-orange-400 mb-4">
            <Tag className="w-3.5 h-3.5" />
            <span>Release History</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            ProofLog Changelog
          </h1>
          <p className={`text-base max-w-xl leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            Track new releases, cryptographic engine updates, and features across the ProofLog ecosystem.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(["all", "patch", "minor", "major"] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border rounded-none transition-all cursor-pointer ${
                activeFilter === filter
                  ? "bg-orange-600 text-white border-orange-600"
                  : isDark
                  ? "bg-[#0a0a0c] border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                  : "bg-zinc-100 border-zinc-300 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Vertical Progress Timeline Layout */}
        <div className="space-y-8 pt-2">
          {filteredReleases.map((release: ReleaseInfo, i: number) => (
            <div key={i} className="relative pl-8 md:pl-0">
              {/* Continuous Vertical Timeline Connector Line */}
              {i !== filteredReleases.length - 1 && (
                <div
                  className={`absolute left-[11px] md:left-[156px] top-4 bottom-[-32px] w-px ${
                    isDark ? "bg-zinc-800" : "bg-zinc-200"
                  }`}
                />
              )}

              <div className="flex flex-col md:flex-row gap-4 md:gap-10 items-start">
                {/* Timeline Date & Square Node */}
                <div className="md:w-32 shrink-0 pt-3 relative text-left">
                  <div className="absolute left-[-27px] md:left-[153px] top-4 w-2.5 h-2.5 bg-orange-500" />
                  <span className="text-xs font-mono text-zinc-500">{release.date}</span>
                </div>

                {/* Compact Release Card */}
                <div
                  className={`flex-1 p-4 sm:p-5 rounded-none border dark-hover-shimmer ${
                    isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-white border-zinc-300 shadow-sm"
                  }`}
                >
                  {/* Header Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5 pb-2.5 border-b border-zinc-800/80">
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg font-bold font-mono text-orange-500">{release.version}</h2>
                      <span
                        className={`px-2 py-0.5 rounded-none text-[9px] font-bold font-mono uppercase tracking-wider border ${
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

                    <span className="px-1.5 py-0.5 bg-black/40 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                      commit {release.commitSha}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2 font-mono">{release.title}</h3>

                  <p className={`text-[11px] leading-relaxed mb-3 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    {release.description}
                  </p>

                  {/* Changes List */}
                  <div className="space-y-1.5 pt-2 border-t border-zinc-800/50">
                    <ul className="space-y-1.5 font-mono text-[11px]">
                      {release.changes.map((change, j) => (
                        <li key={j} className={`flex items-start gap-2 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                          <GitCommit className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredReleases.length === 0 && (
            <div className={`p-8 text-center rounded-none border font-mono text-xs ${isDark ? "bg-[#0a0a0c] border-zinc-800 text-zinc-400" : "bg-zinc-50 border-zinc-300 text-zinc-600"}`}>
              No releases match the selected tag filter.
            </div>
          )}
        </div>

        {/* GitHub Release Subscription CTA */}
        <div
          className={`p-8 rounded-none border text-center relative overflow-hidden dark-hover-shimmer ${
            isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-zinc-50 border-zinc-300"
          }`}
        >
          <h3 className="text-xl font-extrabold font-mono mb-2">Subscribe to GitHub Releases</h3>
          <p className={`text-xs max-w-md mx-auto mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            Watch the official ProofLog repository on GitHub to receive instant notifications on new SDK and CLI releases.
          </p>
          <div className="flex justify-center">
            <a
              href="https://github.com/RahulDew/prooflog"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-6 rounded-none bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>View GitHub Releases</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
