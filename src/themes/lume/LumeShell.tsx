"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/projects", "Work"],
  ["/blogs", "Journal"],
  ["/skills", "Skills"],
  ["/contact", "Contact"],
];

export default function LumeShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const reduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const { scrollY, scrollYProgress } = useScroll({
    container: scrollRef,
  });
  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 24);
  });

  const cursorEnabled =
    !reduceMotion &&
    (typeof window === "undefined" ||
      !window.matchMedia("(pointer: coarse)").matches);

  return (
    <div
      className={cn("lume-theme", cursorEnabled && "lume-cursor-active")}
      ref={scrollRef}
    >
      <a
        href="#lume-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-[hsl(43_90%_58%)] focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-black"
      >
        Skip to content
      </a>

      {/* Top progress hairline */}
      <ScrollProgress scrollYProgress={scrollYProgress} />

      {/* Site-wide grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5] opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Header */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[120] transition-all duration-500",
          scrolled
            ? "border-b border-white/[0.08] bg-[#0c0a08]/85 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div
          className={cn(
            "mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-6 transition-all duration-500 sm:px-8",
          )}
        >
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="Jahid Hasan — home"
          >
            <span className="grid size-9 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-[#f4d98a] to-[#b8892f] font-display text-lg font-semibold text-black shadow-[0_0_24px_-6px_hsl(43_90%_58%)]">
              J
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="font-display text-lg font-medium tracking-wide text-[#f4efe6]">
                Jahid Hasan
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#8a8174]">
                Full-stack developer
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary navigation" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {links.map(([href, label]) => {
                const isActive =
                  pathname === href ||
                  (href !== "/" && pathname.startsWith(href));
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "relative rounded-full px-4 py-2 text-sm transition-colors duration-300",
                        isActive
                          ? "text-[#0b0907]"
                          : "text-[#a89e8e] hover:text-[#f4efe6]",
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="lume-nav-pill"
                          className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#f4d98a,#c99b3f)] shadow-[0_4px_20px_-4px_hsl(43_90%_58%_/_0.6)]"
                          transition={{ type: "spring", bounce: 0.24, duration: 0.55 }}
                        />
                      )}
                      <span className="relative z-10">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="group hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-sm text-[#f4efe6] backdrop-blur-md transition-colors duration-300 hover:border-[hsl(43_90%_58%_/_0.5)] sm:inline-flex"
            >
              Let&apos;s talk
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="lume-mobile-nav"
              aria-label="Toggle menu"
              className="grid size-10 place-items-center rounded-xl border border-white/10 text-[#f4efe6] lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="lume-mobile-nav"
            className="fixed inset-0 z-[110] flex flex-col justify-between bg-[#0b0907]/95 px-8 pb-10 pt-28 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav aria-label="Mobile navigation">
              <ul className="flex flex-col gap-1">
                {links.map(([href, label], i) => {
                  const isActive =
                    pathname === href ||
                    (href !== "/" && pathname.startsWith(href));
                  return (
                    <motion.li
                      key={href}
                      initial={reduceMotion ? false : { y: 24, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: reduceMotion ? 0 : i * 0.06 }}
                    >
                      <Link
                        href={href}
                        className={cn(
                          "flex items-baseline gap-5 border-b border-white/[0.06] py-5 font-display text-4xl transition-colors",
                          isActive
                            ? "text-[hsl(43_90%_62%)]"
                            : "text-[#f4efe6] hover:text-[hsl(43_90%_62%)]",
                        )}
                      >
                        <span className="text-xs font-body tracking-[0.2em] text-[#6f675c]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#6f675c]">
              <span>Dhaka, Bangladesh</span>
              <span className="flex items-center gap-2 text-[#b89a55]">
                <span className="size-1.5 rounded-full bg-[hsl(43_90%_58%)] shadow-[0_0_10px_hsl(43_90%_58%)]" />
                Available
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <main id="lume-main">{children}</main>

      <LumeFooter />
      <LumeCursor enabled={cursorEnabled} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll progress hairline                                            */
/* ------------------------------------------------------------------ */

function ScrollProgress({
  scrollYProgress,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const reduceMotion = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });
  if (reduceMotion) return null;
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[130] h-[2px] origin-left bg-[linear-gradient(90deg,#f4d98a,#c99b3f,#f4d98a)]"
      style={{ scaleX }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Custom cursor — dot + trailing ring                                 */
/* ------------------------------------------------------------------ */

function LumeCursor({ enabled }: { enabled: boolean }) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 24, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 24, mass: 0.6 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!enabled || reduceMotion) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(
        "a, button, [role='button'], input, textarea, label",
      );
      setActive(!!target);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [enabled, reduceMotion, x, y]);

  if (!enabled || reduceMotion) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200] hidden lg:block">
      <motion.div
        className="absolute size-2 rounded-full bg-[hsl(43_90%_58%)] shadow-[0_0_12px_hsl(43_90%_58%)]"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="absolute size-8 rounded-full border border-[hsl(43_90%_58%_/_0.5)]"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: active ? 1.6 : 1,
          opacity: active ? 0.9 : 0.5,
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function LumeFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-[#0a0806]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[900px] -translate-x-1/2 rounded-[50%] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 50% 100%, hsl(43 100% 55% / 0.45), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Full-width name */}
      <div className="relative select-none px-6 pt-20 sm:px-8">
        <motion.h2
          aria-hidden
          className="whitespace-nowrap text-center font-display text-[clamp(3.4rem,13.5vw,13rem)] font-medium leading-none tracking-[-0.02em] text-[#f4efe6]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {"JAHID".split("").map((ch, i) => (
            <span
              key={i}
              className="inline-block transition-all duration-500 hover:-translate-y-2 hover:text-[hsl(43_90%_62%)]"
            >
              {ch}
            </span>
          ))}
          <span className="mx-[0.12em] inline-block text-[hsl(43_90%_62%)]">
            •
          </span>
          <span className="italic text-[hsl(43_90%_62%)]">
            {"HASAN".split("").map((ch, i) => (
              <span
                key={i}
                className="inline-block transition-all duration-500 hover:-translate-y-2 hover:text-[hsl(43_90%_62%)]"
              >
                {ch}
              </span>
            ))}
          </span>
        </motion.h2>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 pb-12 sm:px-8">
        <div className="mt-16 grid gap-12 border-t border-white/[0.06] pt-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="max-w-sm text-sm leading-relaxed text-[#a89e8e]">
              Full-stack engineering and project delivery from technical
              planning through launch — clear, maintainable, and accountable.
            </p>
            <ul className="mt-8 flex flex-wrap gap-3">
              <FooterLink href="mailto:jahid.bubtcse29@gmail.com">
                Email
              </FooterLink>
              <FooterLink href="https://github.com/jhasan018">
                GitHub
              </FooterLink>
              <FooterLink href="https://www.linkedin.com/in/jhasan14152/">
                LinkedIn
              </FooterLink>
            </ul>
          </div>

          <nav aria-label="Footer navigation">
            <span className="text-[10px] uppercase tracking-[0.24em] text-[hsl(43_70%_60%)]">
              Navigate
            </span>
            <ul className="mt-5 flex flex-col gap-3">
              {links.slice(1).map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[#a89e8e] transition-colors hover:text-[#f4efe6]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-[hsl(43_70%_60%)]">
              Availability
            </span>
            <p className="mt-5 text-sm leading-relaxed text-[#a89e8e]">
              Open to select engagements and product partnerships worldwide.
            </p>
            <Link
              href="/contact"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(43_90%_62%)] transition-colors hover:text-[#ffe9b8]"
            >
              Start a project
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-[10px] uppercase tracking-[0.18em] text-[#6f675c] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Jahid Hasan</span>
          <span>Full-stack development / project delivery</span>
          <span>Dhaka, Bangladesh</span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <li>
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-[#a89e8e] transition-colors hover:border-[hsl(43_90%_58%_/_0.45)] hover:text-[#f4efe6]"
      >
        {children}
        <ArrowUpRight className="size-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>
    </li>
  );
}