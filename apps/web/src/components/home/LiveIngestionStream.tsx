import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import {
  LIVE_FEED_CONTENT,
  type LiveLog,
} from "../../constants/home.constants";

export interface LiveIngestionStreamProps {
  logs: LiveLog[];
}

export function LiveIngestionStream({ logs }: LiveIngestionStreamProps) {
  return (
    <section className="py-20 gsap-reveal">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="section-tag-blue">{LIVE_FEED_CONTENT.tag}</span>
          <h2 className="text-3xl font-extrabold">{LIVE_FEED_CONTENT.title}</h2>
          <p className="text-sm mt-1 max-w-xl text-muted-adaptive">
            {LIVE_FEED_CONTENT.description}
          </p>
        </div>
        <div className="badge-emerald">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{LIVE_FEED_CONTENT.statusBadge}</span>
        </div>
      </div>

      <div className="card-surface p-0 overflow-hidden min-h-[280px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono table-fixed">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-black/40 dark:text-zinc-400">
                <th className="py-3.5 px-4 font-semibold w-24">
                  {LIVE_FEED_CONTENT.headers[0]}
                </th>
                <th className="py-3.5 px-4 font-semibold w-48">
                  {LIVE_FEED_CONTENT.headers[1]}
                </th>
                <th className="py-3.5 px-4 font-semibold w-36">
                  {LIVE_FEED_CONTENT.headers[2]}
                </th>
                <th className="py-3.5 px-4 font-semibold w-48">
                  {LIVE_FEED_CONTENT.headers[3]}
                </th>
                <th className="py-3.5 px-4 font-semibold w-28">
                  {LIVE_FEED_CONTENT.headers[4]}
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false} mode="popLayout">
                {logs.map((log) => (
                  <motion.tr
                    key={log.sequence}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800/60 dark:hover:bg-white/[0.02] h-12 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-orange-500">
                      #{log.sequence}
                    </td>
                    <td className="py-3.5 px-4 font-medium truncate">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 truncate text-muted-adaptive">
                      {log.idempotencyKey}
                    </td>
                    <td className="py-3.5 px-4 truncate text-muted-adaptive">
                      {log.hash}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="badge-emerald">
                        <CheckCircle size={16} strokeWidth={2} />
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
