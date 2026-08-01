import { Clock } from "lucide-react";
import { METRICS_CONTENT } from "../../constants/home.constants";

interface MetricsDashboardProps {
  isDark: boolean;
}

export function MetricsDashboard({ isDark }: MetricsDashboardProps) {
  return (
    <section className="py-20 gsap-reveal">
      <div className="flex items-start justify-between mb-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">
            {METRICS_CONTENT.tag}
          </span>
          <h2 className="text-3xl font-extrabold mt-1">{METRICS_CONTENT.title}</h2>
          <p className={`text-sm mt-1 max-w-xl ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            {METRICS_CONTENT.description}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-[4px] border text-xs font-mono uppercase tracking-wider border-orange-500/40 bg-orange-500/10 text-orange-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Coming Soon</span>
        </div>
      </div>

      {/* Blurred preview with Coming Soon overlay */}
      <div className="relative">
        {/* Faded preview content */}
        <div className="opacity-30 pointer-events-none select-none blur-[2px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className={`p-6 rounded-[4px] border ${isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-white border-zinc-300"}`}>
                <span className={`text-xs font-mono uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                  {METRICS_CONTENT.metrics[0].label}
                </span>
                <p className="text-4xl font-extrabold text-emerald-400 mt-2 font-mono">{METRICS_CONTENT.metrics[0].value}</p>
                <span className="text-[11px] text-zinc-500 mt-1 block">{METRICS_CONTENT.metrics[0].detail}</span>
              </div>
              <div className={`p-6 rounded-[4px] border ${isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-white border-zinc-300"}`}>
                <span className={`text-xs font-mono uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                  {METRICS_CONTENT.metrics[1].label}
                </span>
                <p className="text-4xl font-extrabold text-blue-500 mt-2 font-mono">{METRICS_CONTENT.metrics[1].value}</p>
                <span className="text-[11px] text-zinc-500 mt-1 block">{METRICS_CONTENT.metrics[1].detail}</span>
              </div>
            </div>
            <div className={`lg:col-span-8 p-6 rounded-[4px] border flex flex-col justify-between ${isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-white border-zinc-300"}`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                  {METRICS_CONTENT.metrics[2].label}
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">{METRICS_CONTENT.metrics[2].value}</span>
              </div>
              <div className="h-44 w-full">
                <svg viewBox="0 0 500 150" className="w-full h-full">
                  <polyline points="0,120 50,120 50,80 120,80 120,100 200,100 200,50 300,50 300,70 400,70 400,30 500,30" fill="none" stroke="#f97316" strokeWidth="2.5" />
                  <polygon points="0,120 50,120 50,80 120,80 120,100 200,100 200,50 300,50 300,70 400,70 400,30 500,30 500,150 0,150" fill="#f97316" opacity="0.1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Centered Banner */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className={`px-6 py-5 rounded-[4px] border text-center ${isDark ? "bg-[#0a0a0c]/90 border-zinc-800" : "bg-white/90 border-zinc-300"}`}>
            <div className="flex items-center justify-center gap-2 text-orange-500 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-mono font-bold uppercase tracking-widest">Under Development</span>
            </div>
            <p className={`text-xs font-mono max-w-xs ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              The live metrics dashboard is currently being built. Real-time chain integrity stats will be available in an upcoming release.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
