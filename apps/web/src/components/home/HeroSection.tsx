import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Terminal, Check, Copy } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { HeroHashChainVisualizer } from "./HeroHashChainVisualizer";
import { HERO_CONTENT } from "../../constants/home.constants";

interface HeroSectionProps {
  isDark: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export function HeroSection({ isDark }: HeroSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(HERO_CONTENT.installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <header className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="lg:col-span-7 text-left space-y-6"
      >
        <motion.div
          variants={itemVariants}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-[4px] border text-xs font-mono uppercase tracking-wider ${
            isDark
              ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
              : "border-blue-600/40 bg-blue-50 text-blue-600 font-bold"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-[2px] bg-orange-500 animate-pulse" />
          {HERO_CONTENT.badge}
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08]"
        >
          {HERO_CONTENT.headlineFirst}
          <br />
          <span className={isDark ? "text-orange-500" : "text-blue-600"}>
            {HERO_CONTENT.headlineSecond}
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className={`text-base leading-relaxed max-w-xl ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
        >
          {HERO_CONTENT.description}
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-2">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              to={HERO_CONTENT.primaryCtaLink}
              className="h-12 px-6 rounded-[4px] bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer dark-hover-shimmer"
            >
              <span>{HERO_CONTENT.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCopy}
            className={`h-12 px-5 rounded-[4px] border font-mono text-xs transition-all flex items-center gap-3 cursor-pointer dark-hover-shimmer ${
              isDark
                ? "bg-[#0a0a0c] border-zinc-800 hover:border-zinc-700 text-zinc-300"
                : "bg-white border-zinc-300 hover:border-zinc-400 text-zinc-800 shadow-sm"
            }`}
          >
            <Terminal className="w-4 h-4 text-orange-500" />
            <span>{HERO_CONTENT.installCommand}</span>
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-500" />}
          </motion.button>
        </motion.div>
      </motion.div>

      <HeroHashChainVisualizer isDark={isDark} />
    </header>
  );
}
