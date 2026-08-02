import { useState } from "react";
import { GitCommit, Tag, ExternalLink } from "lucide-react";
import {
  RELEASES,
  CHANGELOG_CONTENT,
  type ReleaseInfo,
} from "../constants/changelog.constants";
import { Button } from "../components/ui/Button";

type FilterType = "all" | "major" | "minor" | "patch";

export interface ChangelogProps {
  className?: string;
}

export default function Changelog() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredReleases = RELEASES.filter((release) => {
    return activeFilter === "all" || release.type === activeFilter;
  });

  return (
    <div className="pt-24 min-h-screen relative pb-28 transition-colors bg-[#ffffff] text-zinc-900 dark:bg-[#050505] dark:text-zinc-100">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(circle_at_50%_35%,black_30%,rgba(0,0,0,0.4)_65%,transparent_90%)]" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 text-left space-y-12">
        {/* Header */}
        <div>
          <div className="badge-orange mb-4">
            <Tag className="w-4 h-4" />
            <span>{CHANGELOG_CONTENT.badge}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            {CHANGELOG_CONTENT.title}
          </h1>
          <p className="text-base max-w-xl leading-relaxed text-muted-adaptive">
            {CHANGELOG_CONTENT.description}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(["all", "patch", "minor", "major"] as FilterType[]).map((filter) => (
            <Button
              key={filter}
              variant="pill"
              onClick={() => setActiveFilter(filter)}
              className={activeFilter === filter ? "bg-orange-600 text-white border-orange-600" : ""}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Vertical Progress Timeline Layout */}
        <div className="space-y-8 pt-2">
          {filteredReleases.map((release: ReleaseInfo, i: number) => (
            <div key={i} className="relative pl-8 md:pl-0">
              {/* Continuous Vertical Timeline Connector Line */}
              {i !== filteredReleases.length - 1 && (
                <div className="absolute left-[11px] md:left-[156px] top-4 bottom-[-32px] w-px bg-zinc-200 dark:bg-zinc-800" />
              )}

              <div className="flex flex-col md:flex-row gap-4 md:gap-10 items-start">
                {/* Timeline Date & Square Node */}
                <div className="md:w-32 shrink-0 pt-3 relative text-left">
                  <div className="absolute left-[-27px] md:left-[153px] top-4 w-2.5 h-2.5 rounded-[2px] bg-orange-500" />
                  <span className="text-xs font-mono text-zinc-500">
                    {release.date}
                  </span>
                </div>

                {/* Compact Release Card */}
                <div className="flex-1 card-surface p-4 sm:p-5 dark-hover-shimmer">
                  {/* Header Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5 pb-2.5 border-b border-zinc-200 dark:border-zinc-800/80">
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg font-bold font-mono text-orange-500">
                        {release.version}
                      </h2>
                      <span
                        className={`px-2 py-0.5 rounded-[4px] text-[9px] font-bold font-mono uppercase tracking-wider border ${
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

                    <span className="px-1.5 py-0.5 border text-[10px] font-mono rounded-[2px] bg-zinc-100 border-zinc-300 text-zinc-600 dark:bg-black/40 dark:border-zinc-800 dark:text-zinc-400">
                      commit {release.commitSha}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold mb-2 font-mono">
                    {release.title}
                  </h3>

                  <p className="text-[11px] leading-relaxed mb-3 text-muted-adaptive">
                    {release.description}
                  </p>

                  {/* Changes List */}
                  <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800/50">
                    <ul className="space-y-1.5 font-mono text-[11px]">
                      {release.changes.map((change, j) => (
                        <li key={j} className="flex items-start gap-2 text-subtle-adaptive">
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
            <div className="card-surface p-8 text-center font-mono text-xs text-muted-adaptive">
              No releases match the selected tag filter.
            </div>
          )}
        </div>

        {/* GitHub Release Subscription CTA */}
        <div className="card-surface p-8 text-center relative overflow-hidden dark-hover-shimmer">
          <h3 className="text-xl font-extrabold font-mono mb-2">
            {CHANGELOG_CONTENT.ctaTitle}
          </h3>
          <p className="text-xs max-w-md mx-auto mb-6 text-muted-adaptive">
            {CHANGELOG_CONTENT.ctaDescription}
          </p>
          <div className="flex justify-center">
            <Button
              as="a"
              href={CHANGELOG_CONTENT.primaryCtaLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              rightIcon={<ExternalLink className="w-4 h-4" />}
            >
              {CHANGELOG_CONTENT.primaryCtaText}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
