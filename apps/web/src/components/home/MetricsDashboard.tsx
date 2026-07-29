interface MetricsDashboardProps {
  isDark: boolean;
}

export function MetricsDashboard({ isDark }: MetricsDashboardProps) {
  return (
    <section className="py-20 gsap-reveal">
      <div className="text-left mb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">Metrics</span>
        <h2 className="text-3xl font-extrabold mt-1">State Integrity Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Stat Cards */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-6 rounded-none border ${isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-white border-zinc-300 shadow-sm"}`}>
            <span className={`text-xs font-mono uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>System Integrity</span>
            <p className="text-4xl font-extrabold text-emerald-400 mt-2 font-mono">100.00%</p>
            <span className="text-[11px] text-zinc-500 mt-1 block">Zero chain breaks recorded</span>
          </div>
          <div className={`p-6 rounded-none border ${isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-white border-zinc-300 shadow-sm"}`}>
            <span className={`text-xs font-mono uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Total Audited Events</span>
            <p className="text-4xl font-extrabold text-blue-500 mt-2 font-mono">14.8M+</p>
            <span className="text-[11px] text-zinc-500 mt-1 block">Across all active org ledgers</span>
          </div>
        </div>

        {/* Sharp Stepped Line Graph */}
        <div className={`lg:col-span-8 p-6 rounded-none border flex flex-col justify-between ${isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-white border-zinc-300 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Verifications / Hour</span>
            <span className="text-xs text-emerald-400 font-mono font-bold">100% PASSED</span>
          </div>
          <div className="h-44 w-full">
            <svg viewBox="0 0 500 150" className="w-full h-full">
              <polyline
                points="0,120 50,120 50,80 120,80 120,100 200,100 200,50 300,50 300,70 400,70 400,30 500,30"
                fill="none"
                stroke="#f97316"
                strokeWidth="2.5"
              />
              <polygon
                points="0,120 50,120 50,80 120,80 120,100 200,100 200,50 300,50 300,70 400,70 400,30 500,30 500,150 0,150"
                fill="#f97316"
                opacity="0.1"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
