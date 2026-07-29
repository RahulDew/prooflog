import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import type { LiveLog } from "../../constants/home.constants";

interface LiveIngestionFeedProps {
  isDark: boolean;
  logs: LiveLog[];
}

export function LiveIngestionFeed({ isDark, logs }: LiveIngestionFeedProps) {
  return (
    <section className="py-20 gsap-reveal">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-blue-500 font-bold">Realtime</span>
          <h2 className="text-3xl font-extrabold">Live Ingestion Feed</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-none border border-emerald-500/30">
          <span className="w-2 h-2 bg-emerald-400" />
          <span>Streaming active logs</span>
        </div>
      </div>

      <div
        className={`rounded-none border overflow-hidden min-h-[280px] ${
          isDark ? "bg-[#0a0a0c] border-zinc-800" : "bg-white border-zinc-300 shadow-sm"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono table-fixed">
            <thead>
              <tr className={`border-b ${isDark ? "border-zinc-800 bg-black/40 text-zinc-400" : "border-zinc-200 bg-zinc-50 text-zinc-600"}`}>
                <th className="py-3.5 px-4 font-semibold w-24">Sequence</th>
                <th className="py-3.5 px-4 font-semibold w-48">Action</th>
                <th className="py-3.5 px-4 font-semibold w-36">Idempotency Key</th>
                <th className="py-3.5 px-4 font-semibold w-48">Hash Signature</th>
                <th className="py-3.5 px-4 font-semibold w-28">Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false} mode="popLayout">
                {logs.map((log) => (
                  <motion.tr
                    key={log.sequence}
                    layout
                    initial={{ opacity: 0, backgroundColor: isDark ? "rgba(249, 115, 22, 0.15)" : "rgba(37, 99, 235, 0.15)" }}
                    animate={{ opacity: 1, backgroundColor: "transparent" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`border-b h-12 transition-colors ${
                      isDark ? "border-zinc-800/60 hover:bg-white/[0.02]" : "border-zinc-100 hover:bg-zinc-50"
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-orange-500">#{log.sequence}</td>
                    <td className="py-3.5 px-4 font-medium truncate">{log.action}</td>
                    <td className={`py-3.5 px-4 truncate ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>{log.idempotencyKey}</td>
                    <td className={`py-3.5 px-4 truncate ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>{log.hash}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {log.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
