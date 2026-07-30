import { type FC, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

interface Position {
  x: number;
  y: number;
}

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

// 1. Sleek Custom Pointer Arrow SVG (Default Mode)
const DefaultCursorSVG: FC<{ isDark: boolean }> = ({ isDark }) => {
  const accentFill = isDark ? "#f97316" : "#2563eb";
  const strokeColor = isDark ? "#ffffff" : "#000000";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={44}
      height={48}
      viewBox="0 0 50 54"
      fill="none"
      style={{ scale: 0.55 }}
    >
      <g filter="url(#filter0_d_cursor)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill={accentFill}
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
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};

// 2. Interactive Target Precision Ring SVG (Buttons & Links)
const PointerTargetSVG: FC<{ isDark: boolean }> = ({ isDark }) => {
  const accentFill = isDark ? "#f97316" : "#2563eb";

  return (
    <div className="relative flex items-center justify-center">
      <DefaultCursorSVG isDark={isDark} />
      <motion.div
        className="absolute w-8 h-8 rounded-[4px] border pointer-events-none"
        style={{
          borderColor: accentFill,
          backgroundColor: isDark ? "rgba(249, 115, 22, 0.12)" : "rgba(37, 99, 235, 0.12)",
        }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1.25, opacity: 1 }}
        exit={{ scale: 0.6, opacity: 0 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
};

// 3. High-Precision Text Selection Beam SVG (Inputs)
const TextBeamSVG: FC<{ isDark: boolean }> = ({ isDark }) => {
  const accentFill = isDark ? "#f97316" : "#2563eb";
  const strokeColor = isDark ? "#ffffff" : "#000000";

  return (
    <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
      <path d="M3 2H11M7 2V18M3 18H11" stroke={accentFill} strokeWidth="2" strokeLinecap="square" />
      <path d="M2 1H12M7 1V19M2 19H12" stroke={strokeColor} strokeWidth="0.8" strokeLinecap="square" />
    </svg>
  );
};

// 4. Copy Plus Badge SVG (Code Blocks & Copy Buttons)
const CopyCursorSVG: FC<{ isDark: boolean }> = ({ isDark }) => {
  const accentFill = isDark ? "#f97316" : "#2563eb";

  return (
    <div className="relative flex items-center justify-center">
      <DefaultCursorSVG isDark={isDark} />
      <div
        className="absolute -top-1 -right-2 px-1 py-0.5 text-[9px] font-mono font-bold text-white border border-black shadow"
        style={{ backgroundColor: accentFill }}
      >
        +
      </div>
    </div>
  );
};

// 5. Disabled Prohibited Badge SVG (Disabled Buttons/Inputs)
const DisabledCursorSVG: FC<{ isDark: boolean }> = ({ isDark }) => {
  return (
    <div className="relative flex items-center justify-center">
      <DefaultCursorSVG isDark={isDark} />
      <div className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold border border-white">
        ⊘
      </div>
    </div>
  );
};

// 6. Help Tooltip Badge SVG (Tooltips & Info Triggers)
const HelpCursorSVG: FC<{ isDark: boolean }> = ({ isDark }) => {
  return (
    <div className="relative flex items-center justify-center">
      <DefaultCursorSVG isDark={isDark} />
      <div className="absolute -top-1 -right-2 w-4 h-4 bg-blue-600 text-white flex items-center justify-center text-[10px] font-mono font-bold border border-white">
        ?
      </div>
    </div>
  );
};

// 7. Zoom Magnifying Badge SVG (Images & Zoomables)
const ZoomInCursorSVG: FC<{ isDark: boolean }> = ({ isDark }) => {
  return (
    <div className="relative flex items-center justify-center">
      <DefaultCursorSVG isDark={isDark} />
      <div className="absolute -top-1 -right-2 w-4 h-4 bg-purple-600 text-white flex items-center justify-center text-[9px] font-bold border border-white">
        🔍
      </div>
    </div>
  );
};

// 8. Grab Drag Indicator SVG (Draggables)
const GrabCursorSVG: FC<{ isDark: boolean }> = ({ isDark }) => {
  return (
    <div className="relative flex items-center justify-center">
      <DefaultCursorSVG isDark={isDark} />
      <div className="absolute -top-1 -right-2 w-4 h-4 bg-amber-500 text-black flex items-center justify-center text-[10px] font-bold border border-white">
        ✥
      </div>
    </div>
  );
};

export function SmoothCursor({
  cursor,
  springConfig = {
    damping: 45,
    stiffness: 400,
    mass: 1,
    restDelta: 0.001,
  },
}: SmoothCursorProps) {
  const { isDark } = useTheme();
  const [variant, setVariant] = useState<CursorVariant>("default");

  const lastMousePos = useRef<Position>({ x: 0, y: 0 });
  const velocity = useRef<Position>({ x: 0, y: 0 });
  const lastUpdateTime = useRef(Date.now());
  const previousAngle = useRef(0);
  const accumulatedRotation = useRef(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const rotation = useSpring(0, {
    ...springConfig,
    damping: 60,
    stiffness: 300,
  });
  const scale = useSpring(1, {
    ...springConfig,
    stiffness: 500,
    damping: 35,
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

    let timeout: ReturnType<typeof setTimeout> | null = null;

    const updateVelocity = (currentPos: Position) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTime.current;

      if (deltaTime > 0) {
        velocity.current = {
          x: (currentPos.x - lastMousePos.current.x) / deltaTime,
          y: (currentPos.y - lastMousePos.current.y) / deltaTime,
        };
      }

      lastUpdateTime.current = currentTime;
      lastMousePos.current = currentPos;
    };

    const smoothPointerMove = (e: PointerEvent) => {
      if (!isTrackablePointer(e.pointerType)) {
        return;
      }

      setIsVisible(true);

      // Auto-detect interactive element variant from target hierarchy
      const target = e.target as HTMLElement | null;
      if (target) {
        const customCursor = target.closest("[data-cursor]")?.getAttribute("data-cursor");
        if (customCursor) {
          setVariant(customCursor as CursorVariant);
        } else if (target.closest("button:disabled, input:disabled, [aria-disabled='true'], .disabled")) {
          setVariant("disabled");
        } else if (target.closest("code, pre, [data-copy], button[title*='Copy'], .copy-btn")) {
          setVariant("copy");
        } else if (target.closest("img, [data-zoom], .zoomable")) {
          setVariant("zoom-in");
        } else if (target.closest("[draggable='true'], .grab")) {
          setVariant("grab");
        } else if (target.closest("[title], [data-tooltip], .help-icon")) {
          setVariant("help");
        } else if (target.closest("a, button, [role='button'], select")) {
          setVariant("pointer");
        } else if (target.closest("input, textarea, [contenteditable='true']")) {
          setVariant("text");
        } else {
          setVariant("default");
        }
      }

      const currentPos = { x: e.clientX, y: e.clientY };
      updateVelocity(currentPos);

      const speed = Math.sqrt(
        Math.pow(velocity.current.x, 2) + Math.pow(velocity.current.y, 2)
      );

      cursorX.set(currentPos.x);
      cursorY.set(currentPos.y);

      if (speed > 0.1) {
        const currentAngle =
          Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) +
          90;

        let angleDiff = currentAngle - previousAngle.current;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;
        accumulatedRotation.current += angleDiff;
        rotation.set(accumulatedRotation.current);
        previousAngle.current = currentAngle;

        scale.set(0.95);

        if (timeout !== null) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
          scale.set(1);
        }, 150);
      }
    };

    let rafId = 0;
    const throttledPointerMove = (e: PointerEvent) => {
      if (!isTrackablePointer(e.pointerType)) {
        return;
      }

      if (rafId) return;

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
      if (rafId) cancelAnimationFrame(rafId);
      if (timeout !== null) {
        clearTimeout(timeout);
      }
    };
  }, [cursorX, cursorY, rotation, scale, isEnabled]);

  // Inject dynamic style tag to override element-level cursor styles (e.g. button { cursor: pointer })
  useEffect(() => {
    if (!isEnabled) return;

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

  const renderCursorIcon = () => {
    if (cursor) return cursor;
    switch (variant) {
      case "pointer":
        return <PointerTargetSVG isDark={isDark} />;
      case "text":
        return <TextBeamSVG isDark={isDark} />;
      case "copy":
        return <CopyCursorSVG isDark={isDark} />;
      case "disabled":
        return <DisabledCursorSVG isDark={isDark} />;
      case "help":
        return <HelpCursorSVG isDark={isDark} />;
      case "zoom-in":
        return <ZoomInCursorSVG isDark={isDark} />;
      case "grab":
        return <GrabCursorSVG isDark={isDark} />;
      default:
        return <DefaultCursorSVG isDark={isDark} />;
    }
  };

  return (
    <motion.div
      style={{
        position: "fixed",
        left: cursorX,
        top: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        rotate: variant === "default" ? rotation : 0,
        scale: scale,
        zIndex: 1000,
        pointerEvents: "none",
        willChange: "transform",
        opacity: isVisible ? 1 : 0,
      }}
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{
        duration: 0.15,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={variant}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.1 }}
        >
          {renderCursorIcon()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
