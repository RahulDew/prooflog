import { ArrowRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { LIFECYCLE_CONTENT } from "../../constants/home.constants";

interface LifecycleGridProps {
  isDark: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 }
  }
};

export function LifecycleGrid({ isDark }: LifecycleGridProps) {
  return (
    <section className="py-20">
      <div className="text-left mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold">
          {LIFECYCLE_CONTENT.tag}
        </span>
        <h2 className="text-3xl font-extrabold mt-1">{LIFECYCLE_CONTENT.title}</h2>
        <p className={`text-sm mt-2 max-w-xl ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
          {LIFECYCLE_CONTENT.description}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {LIFECYCLE_CONTENT.cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`p-6 rounded-[4px] border transition-all duration-200 group dark-hover-shimmer ${
                isDark
                  ? "bg-[#0a0a0c] border-zinc-800 hover:border-orange-500"
                  : "bg-white border-zinc-300 hover:border-blue-600 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-[4px] border border-orange-500/20">
                  {card.q}
                </span>
                <Icon className={`w-5 h-5 ${isDark ? "text-zinc-500 group-hover:text-zinc-200" : "text-zinc-400 group-hover:text-zinc-800"}`} />
              </div>
              <h3 className="text-base font-bold mb-2">{card.title}</h3>
              <p className={`text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>{card.desc}</p>
              <div className={`mt-4 pt-4 border-t flex items-center gap-1 text-[11px] font-mono text-orange-500 cursor-pointer ${isDark ? "border-zinc-800/50" : "border-zinc-200"}`}>
                <span>VIEW SPEC</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
