import { type FC, useEffect, useState, type ReactNode } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export type CursorVariant =
  | "default"
  | "pointer"
  | "text"
  | "copy"
  | "disabled"
  | "help"
  | "zoom-in"
  | "grab";

export interface SmoothCursorProps {
  cursor?: ReactNode;
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
    restDelta: number;
  };
}

const DESKTOP_POINTER_QUERY = "(any-hover: hover) and (any-pointer: fine)";

function isTrackablePointer(pointerType: string) {
  return pointerType !== "touch";
}

// 1. Sleek Custom Pointer Arrow SVG (Left-Pointed)
const DefaultCursorSVG: FC<{ fillColor: string; isDark: boolean }> = ({ fillColor, isDark }) => {
  const strokeColor = isDark ? "#ffffff" : "#000000";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={44}
      height={48}
      viewBox="0 0 50 54"
      fill="none"
      style={{ transform: "scale(0.55) scaleX(-1)" }}
    >
      <g filter="url(#filter0_d_cursor)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill={fillColor}
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke={strokeColor}
          strokeWidth={2.25}
        />
      </g>
      <defs>
        <filter
          id="filter0_d_cursor"
          x={0.6}
          y={0.9}
          width={49}
          height={52}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={2.2} />
          <feGaussianBlur stdDeviation={2.2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

// 2. High-Precision Text Selection Beam SVG (Inputs)
const TextBeamSVG: FC<{ isDark: boolean }> = ({ isDark }) => {
  const accentFill = "#2563eb";
  const strokeColor = isDark ? "#ffffff" : "#000000";

  return (
    <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
      <path
        d="M3 2H11M7 2V18M3 18H11"
        stroke={accentFill}
        strokeWidth="2"
        strokeLinecap="square"
      />
      <path
        d="M2 1H12M7 1V19M2 19H12"
        stroke={strokeColor}
        strokeWidth="0.8"
        strokeLinecap="square"
      />
    </svg>
  );
};

export function SmoothCursor({
  cursor,
  springConfig = {
    damping: 28,
    stiffness: 350,
    mass: 0.5,
    restDelta: 0.001,
  },
}: SmoothCursorProps) {
  const { isDark } = useTheme();
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const scale = useSpring(1, {
    damping: 25,
    stiffness: 450,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_POINTER_QUERY);

    const updateEnabled = () => {
      const nextIsEnabled = mediaQuery.matches;
      setIsEnabled(nextIsEnabled);

      if (!nextIsEnabled) {
        setIsVisible(false);
      }
    };

    updateEnabled();
    mediaQuery.addEventListener("change", updateEnabled);

    return () => {
      mediaQuery.removeEventListener("change", updateEnabled);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const smoothPointerMove = (e: PointerEvent) => {
      if (!isTrackablePointer(e.pointerType)) {
        return;
      }

      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      if (target) {
        const customCursor = target
          .closest("[data-cursor]")
          ?.getAttribute("data-cursor");

        if (customCursor) {
          setVariant(customCursor as CursorVariant);
        } else if (
          target.closest(
            "button:disabled, input:disabled, [aria-disabled='true'], .disabled",
          )
        ) {
          setVariant("disabled");
        } else if (
          target.closest(
            "code, pre, [data-copy], button[title*='Copy'], .copy-btn",
          )
        ) {
          setVariant("copy");
        } else if (target.closest("img, [data-zoom], .zoomable")) {
          setVariant("zoom-in");
        } else if (target.closest("[draggable='true'], .grab")) {
          setVariant("grab");
        } else if (target.closest("[title], [data-tooltip], .help-icon")) {
          setVariant("help");
        } else if (target.closest("a, button, [role='button'], select")) {
          setVariant("pointer");
        } else if (
          target.closest("input, textarea, [contenteditable='true']")
        ) {
          setVariant("text");
        } else {
          setVariant("default");
        }
      }

      cursorX.set(mouseX);
      cursorY.set(mouseY);
    };

    let rafId = 0;
    const throttledPointerMove = (e: PointerEvent) => {
      if (!isTrackablePointer(e.pointerType)) {
        return;
      }

      if (rafId) {
        return;
      }

      rafId = requestAnimationFrame(() => {
        smoothPointerMove(e);
        rafId = 0;
      });
    };

    document.body.style.cursor = "none";
    window.addEventListener("pointermove", throttledPointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", throttledPointerMove);
      document.body.style.cursor = "auto";
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [cursorX, cursorY, isEnabled]);

  // Inject dynamic style tag to override element-level cursor styles
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const styleEl = document.createElement("style");
    styleEl.id = "smooth-cursor-hide-native";
    styleEl.innerHTML = `
      *, *::before, *::after, a, button, input, select, textarea, [role="button"] {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      if (document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
    };
  }, [isEnabled]);

  if (!isEnabled) {
    return null;
  }

  // Determine state-driven cursor fill color
  let cursorFillColor = "#2563eb"; // Default Blue
  if (variant === "pointer" || variant === "copy") {
    cursorFillColor = "#f97316"; // Hover Orange
  } else if (variant === "disabled") {
    cursorFillColor = "#dc2626"; // Restricted Red
  } else if (variant === "zoom-in") {
    cursorFillColor = "#9333ea";
  } else if (variant === "grab") {
    cursorFillColor = "#f59e0b";
  }

  // Default mode = -35° (leaning left), Hover mode = 0° (pointing straight top)
  let hoverRotation = -35;
  if (variant === "pointer" || variant === "copy") {
    hoverRotation = 0;
  }

  let copyBadgeElement: ReactNode = null;
  if (variant === "copy") {
    copyBadgeElement = (
      <motion.div
        key="copy-badge"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className="absolute -top-1 -right-2 px-1 py-0.5 text-[9px] font-mono font-bold text-white border border-black shadow"
        style={{ backgroundColor: "#f97316" }}
      >
        +
      </motion.div>
    );
  }

  let disabledBadgeElement: ReactNode = null;
  if (variant === "disabled") {
    disabledBadgeElement = (
      <motion.div
        key="disabled-badge"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold border border-white"
      >
        ⊘
      </motion.div>
    );
  }

  let helpBadgeElement: ReactNode = null;
  if (variant === "help") {
    helpBadgeElement = (
      <motion.div
        key="help-badge"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className="absolute -top-1 -right-2 w-4 h-4 bg-blue-600 text-white flex items-center justify-center text-[10px] font-mono font-bold border border-white"
      >
        ?
      </motion.div>
    );
  }

  let pointerRingElement: ReactNode = null;
  if (variant === "pointer") {
    pointerRingElement = (
      <motion.div
        key="pointer-ring"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.25, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", stiffness: 450, damping: 28 }}
        className="absolute w-8 h-8 rounded-[4px] border pointer-events-none"
        style={{
          borderColor: "#f97316",
          backgroundColor: "rgba(249, 115, 22, 0.15)",
          boxShadow: "0 0 12px rgba(249, 115, 22, 0.35)",
        }}
      />
    );
  }

  if (cursor) {
    return (
      <motion.div
        style={{
          position: "fixed",
          left: cursorX,
          top: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 1000,
          pointerEvents: "none",
          willChange: "transform",
          opacity: isVisible ? 1 : 0,
        }}
      >
        {cursor}
      </motion.div>
    );
  }

  if (variant === "text") {
    return (
      <motion.div
        style={{
          position: "fixed",
          left: cursorX,
          top: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 1000,
          pointerEvents: "none",
          willChange: "transform",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <TextBeamSVG isDark={isDark} />
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{
        position: "fixed",
        left: cursorX,
        top: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        scale: scale,
        zIndex: 1000,
        pointerEvents: "none",
        willChange: "transform",
        opacity: isVisible ? 1 : 0,
      }}
      animate={{ rotate: hoverRotation }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="relative flex items-center justify-center">
        {/* Static Base Left-Pointed Arrow - ALWAYS PERMANENTLY VISIBLE */}
        <DefaultCursorSVG fillColor={cursorFillColor} isDark={isDark} />

        {/* Dynamic Smooth Overlay Badges */}
        <AnimatePresence>{pointerRingElement}</AnimatePresence>
        <AnimatePresence>{copyBadgeElement}</AnimatePresence>
        <AnimatePresence>{disabledBadgeElement}</AnimatePresence>
        <AnimatePresence>{helpBadgeElement}</AnimatePresence>
      </div>
    </motion.div>
  );
}
