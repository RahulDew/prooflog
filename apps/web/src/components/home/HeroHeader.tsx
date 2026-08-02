import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Terminal, Check, Copy } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { HeroHashChainVisualizer } from "./HeroHashChainVisualizer";
import { HERO_CONTENT } from "../../constants/home.constants";
import { Button } from "../ui/Button";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export function HeroHeader() {
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
        <motion.div variants={itemVariants} className="badge-header">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          {HERO_CONTENT.badge}
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08]"
        >
          {HERO_CONTENT.headlineFirst}
          <br />
          <span className="text-blue-600 dark:text-orange-500">
            {HERO_CONTENT.headlineSecond}
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-base leading-relaxed max-w-xl text-muted-adaptive"
        >
          {HERO_CONTENT.description}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Button
              as={Link}
              to={HERO_CONTENT.primaryCtaLink}
              variant="primary"
              rightIcon={<ArrowRight size={16} strokeWidth={2} />}
              className="dark-hover-shimmer"
            >
              {HERO_CONTENT.primaryCtaText}
            </Button>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="secondary"
              onClick={handleCopy}
              leftIcon={
                <Terminal
                  size={16}
                  strokeWidth={2}
                  className="text-orange-500"
                />
              }
              rightIcon={
                copied ? (
                  <Check
                    size={16}
                    strokeWidth={2}
                    className="text-emerald-400"
                  />
                ) : (
                  <Copy size={16} strokeWidth={2} className="text-zinc-500" />
                )
              }
              className="dark-hover-shimmer"
            >
              {HERO_CONTENT.installCommand}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <HeroHashChainVisualizer />
    </header>
  );
}
