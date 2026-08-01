import { ArrowRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { LIFECYCLE_CONTENT } from "../../constants/home.constants";

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

export function AuditLifecycle() {
  return (
    <section className="py-20">
      <div className="text-left mb-12">
        <span className="section-tag-orange">
          {LIFECYCLE_CONTENT.tag}
        </span>
        <h2 className="text-3xl font-extrabold mt-1">{LIFECYCLE_CONTENT.title}</h2>
        <p className="text-sm mt-2 max-w-xl text-muted-adaptive">
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
              className="card-surface group dark-hover-shimmer hover:border-blue-600 dark:hover:border-orange-500 font-sans"
            >
              <div className="flex-between mb-4">
                <span className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-[4px] border border-orange-500/20">
                  {card.q}
                </span>
                <Icon className="w-5 h-5 text-zinc-400 group-hover:text-zinc-800 dark:text-zinc-500 dark:group-hover:text-zinc-200 transition-colors" />
              </div>
              <h3 className="text-base font-bold mb-2">{card.title}</h3>
              <p className="text-xs leading-relaxed text-muted-adaptive">{card.desc}</p>
              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/50 flex items-center gap-1 text-xs font-mono text-orange-500 cursor-pointer">
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
