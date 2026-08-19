"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Reveal — scroll-triggered fade + rise                               */
/* ------------------------------------------------------------------ */

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={
        reduceMotion ? false : { opacity: 0, y, filter: "blur(6px)" }
      }
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Aurora — animated aurora gradient field for heroes                  */
/* ------------------------------------------------------------------ */

const AURORA_ORBS = [
  { x: "12%", y: "18%", size: 620, hue: 42, blur: 90, opacity: 0.5 },
  { x: "68%", y: "6%", size: 520, hue: 8, blur: 110, opacity: 0.34 },
  { x: "42%", y: "72%", size: 680, hue: 82, blur: 120, opacity: 0.3 },
  { x: "86%", y: "58%", size: 440, hue: 26, blur: 100, opacity: 0.4 },
];

export function Aurora({
  className,
  intensity = 1,
}: {
  className?: string;
  intensity?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      style={{ opacity: intensity }}
    >
      {AURORA_ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={
            {
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle at 50% 50%, hsl(${orb.hue} 90% 62% / ${orb.opacity}), transparent 62%)`,
              filter: `blur(${orb.blur}px)`,
              willChange: "transform",
            } as CSSProperties
          }
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 60, -40, 0],
                  y: [0, -50, 30, 0],
                  scale: [1, 1.12, 0.94, 1],
                }
          }
          transition={{
            duration: 18 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Lamp — golden light sweep behind section headers (21st "Lamp")      */
/* ------------------------------------------------------------------ */

export function Lamp({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex justify-center"
      >
        <motion.div
          className="h-[280px] w-[820px] rounded-[50%]"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 100%, hsl(43 100% 58% / 0.5), transparent 70%)",
            filter: "blur(28px)",
            transformOrigin: "center bottom",
          }}
          initial={reduceMotion ? false : { scaleY: 0, opacity: 0 }}
          animate={inView ? { scaleY: 1, opacity: 1 } : undefined}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Marquee — infinite horizontal scroller (velocity / gooey vibes)     */
/* ------------------------------------------------------------------ */

export function Marquee({
  items,
  className,
  itemClassName,
  reverse = false,
  speed = 40,
  separator = "✦",
}: {
  items: ReactNode[];
  className?: string;
  itemClassName?: string;
  reverse?: boolean;
  speed?: number;
  separator?: string;
}) {
  const reduceMotion = useReducedMotion();
  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item, i) => (
        <div key={i} className={cn("flex items-center gap-10", itemClassName)}>
          <span>{item}</span>
          <span
            aria-hidden
            className="text-[0.5em] text-[hsl(43_90%_60%)]"
          >
            {separator}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={cn("group relative flex overflow-hidden", className)}>
      {reduceMotion ? (
        row
      ) : (
        <motion.div
          className="flex shrink-0"
          animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
          transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        >
          {row}
          {row}
          {row}
          {row}
        </motion.div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Counter — animated number ticker                                    */
/* ------------------------------------------------------------------ */

export function Counter({
  value,
  suffix = "",
  duration = 1.6,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Parallax — subtle vertical parallax on scroll                       */
/* ------------------------------------------------------------------ */

export function Parallax({
  children,
  className,
  from = 40,
  to = -40,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [from, to]), {
    stiffness: 120,
    damping: 24,
  });
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* TiltCard — 3D perspective tilt that follows the pointer             */
/* ------------------------------------------------------------------ */

export function TiltCard({
  children,
  className,
  max = 10,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rx.set(-py * max);
    ry.set(px * max);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("relative [transform-style:preserve-3d] will-change-transform", className)}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic — element that eases toward the cursor                     */
/* ------------------------------------------------------------------ */

export function Magnetic({
  children,
  className,
  strength = 0.32,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("inline-block", className)}
      style={{ x: sx, y: sy }}
    >
      {children}
    </motion.div>
  );
}