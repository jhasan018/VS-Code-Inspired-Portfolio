"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Reveal — soft rise on scroll                                        */
/* ------------------------------------------------------------------ */

export function Reveal({
  children,
  delay = 0,
  className,
  y = 28,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* WordReveal — editorial word-by-word mask reveal                     */
/* ------------------------------------------------------------------ */

export function WordReveal({
  text,
  className,
  accentWords = [],
  delay = 0,
  once = true,
}: {
  text: string;
  className?: string;
  accentWords?: string[];
  delay?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => {
        const clean = word.replace(/[.,!?—]/g, "");
        const accent = accentWords.includes(clean);
        return (
          <span
            key={`${word}-${i}`}
            aria-hidden
            className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom"
          >
            <motion.span
              className={
                "inline-block will-change-transform " +
                (accent ? "text-[var(--sol-accent)]" : "")
              }
              initial={reduce ? false : { y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once, margin: "-40px" }}
              transition={{
                duration: 0.75,
                delay: delay + i * 0.055,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic — cursor-attracted wrapper                                 */
/* ------------------------------------------------------------------ */

export function Magnetic({
  children,
  strength = 0.32,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 16 });
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 16 });

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, display: "inline-block" }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Counter — animated number                                           */
/* ------------------------------------------------------------------ */

export function Counter({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className={className}>
      {reduce ? value : display}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* LiveClock — Dhaka local time                                        */
/* ------------------------------------------------------------------ */

export function LiveClock({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Dhaka",
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {time ?? "--:--:--"}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Marquee — infinite strip                                            */
/* ------------------------------------------------------------------ */

export function Marquee({
  items,
  reverse = false,
  speed = 36,
  className,
  separator = "✳",
}: {
  items: string[];
  reverse?: boolean;
  speed?: number;
  className?: string;
  separator?: string;
}) {
  const row = (
    <>
      {items.map((item, i) => (
        <span key={i} className="flex shrink-0 items-center">
          <span className="whitespace-nowrap">{item}</span>
          <span
            aria-hidden
            className={
              "mx-8 inline-block " +
              (separator === "✳" ? "text-[var(--sol-accent)]" : "")
            }
          >
            {separator}
          </span>
        </span>
      ))}
    </>
  );
  return (
    <div className={"overflow-hidden " + (className ?? "")}>
      <div
        className="solace-marquee-track"
        data-reverse={reverse}
        style={
          {
            "--marquee-duration": `${speed}s`,
          } as React.CSSProperties
        }
      >
        <div className="flex shrink-0">{row}</div>
        <div className="flex shrink-0" aria-hidden>
          {row}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FloatingPreview — image that follows the cursor over index rows     */
/* ------------------------------------------------------------------ */

export function FloatingPreview({
  image,
  caption,
  visible,
  containerRef,
}: {
  image: string | null;
  caption: string;
  visible: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 25 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 25 });

  if (reduce) return null;

  return (
    <AnimatePresence>
      {visible && image && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[90] hidden lg:block"
          style={{ x, y }}
          initial={{ opacity: 0, scale: 0.7, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 3 }}
          exit={{ opacity: 0, scale: 0.7, rotate: 6 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <MouseTracker containerRef={containerRef} x={x} y={y} />
          <div className="-translate-x-1/2 -translate-y-1/2">
            <div className="w-[320px] overflow-hidden rounded-2xl border border-[var(--sol-line)] shadow-[0_40px_80px_-30px_rgba(28,27,23,0.4)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="aspect-[16/10] w-full object-cover" />
              <div className="flex items-center justify-between bg-white px-4 py-2.5">
                <span className="font-mono-label text-[9px] uppercase tracking-[0.18em] text-[var(--sol-accent)]">
                  View case
                </span>
                <span className="max-w-[200px] truncate font-mono-label text-[9px] uppercase tracking-[0.18em] text-[var(--sol-faint)]">
                  {caption}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MouseTracker({
  containerRef,
  x,
  y,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  x: ReturnType<typeof useSpring>;
  y: ReturnType<typeof useSpring>;
}) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [containerRef, x, y]);
  return null;
}

/* ------------------------------------------------------------------ */
/* WordRotator — cycling word with mask animation                      */
/* ------------------------------------------------------------------ */

export function WordRotator({
  words,
  className,
  interval = 2600,
}: {
  words: string[];
  className?: string;
  interval?: number;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => clearInterval(id);
  }, [reduce, words.length, interval]);

  return (
    <span
      className={
        "relative inline-block overflow-hidden align-bottom " + (className ?? "")
      }
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          className="inline-block whitespace-nowrap"
          initial={reduce ? false : { y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* HoverLetters — per-letter lift on hover                             */
/* ------------------------------------------------------------------ */

export function HoverLetters({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block will-change-transform"
          whileHover={{ y: -10, color: "#0e6e54" }}
          transition={{ type: "spring", stiffness: 350, damping: 14 }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* SectionHead — numbered editorial section heading                    */
/* ------------------------------------------------------------------ */

export function SectionHead({
  index,
  label,
  title,
  action,
}: {
  index: string;
  label: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 border-t-2 border-[var(--sol-ink)] pt-6">
      <div>
        <Reveal>
          <span className="font-mono-label text-[10px] uppercase tracking-[0.28em] text-[var(--sol-accent)]">
            ({index}) — {label}
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 max-w-3xl whitespace-pre-line font-display text-5xl font-medium leading-[1.02] tracking-[-0.02em] sm:text-6xl md:text-7xl">
            {title}
          </h2>
        </Reveal>
      </div>
      {action && <Reveal delay={0.14}>{action}</Reveal>}
    </div>
  );
}
