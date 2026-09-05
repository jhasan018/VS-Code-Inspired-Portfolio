"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, Mail, X } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { LiveClock } from "./SolaceFx";

const links = [
  ["/", "Index"],
  ["/projects", "Work"],
  ["/about", "About"],
  ["/skills", "Skills"],
  ["/blogs", "Journal"],
  ["/contact", "Contact"],
];

export default function SolaceShell({
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

  const { scrollY, scrollYProgress } = useScroll({ container: scrollRef });
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <div className="solace-theme" ref={scrollRef}>
      <a
        href="#solace-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-[var(--sol-ink)] focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[var(--sol-paper)]"
      >
        Skip to content
      </a>

      <ScrollProgress scrollYProgress={scrollYProgress} />

      {/* ---------- Desktop: fixed left vertical rail ---------- */}
      <aside className="fixed left-0 top-0 z-[120] hidden h-full w-[92px] flex-col items-center justify-between border-r border-[var(--sol-line)] bg-[var(--sol-paper)] py-7 lg:flex">
        <Link
          href="/"
          aria-label="Jahid Hasan — home"
          className="font-display text-xl font-semibold leading-none tracking-tight"
        >
          JH<span className="text-[var(--sol-accent)]">.</span>
        </Link>

        {/* Vertical nav */}
        <nav aria-label="Primary navigation">
          <ul className="flex flex-col items-center gap-7">
            {links.map(([href, label]) => {
              const isActive =
                pathname === href ||
                (href === "/" ? false : pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "solace-vlink group relative flex items-center gap-2 font-mono-label text-[11px] uppercase tracking-[0.26em] transition-colors duration-300",
                      isActive
                        ? "text-[var(--sol-accent)]"
                        : "text-[var(--sol-faint)] hover:text-[var(--sol-ink)]",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="solace-rail-dot"
                        className="absolute -right-3 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[var(--sol-accent)]"
                        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                      />
                    )}
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Rail bottom: socials + live clock */}
        <div className="flex flex-col items-center gap-5">
          <span className="h-10 w-px bg-[var(--sol-line)]" />
          <LiveClock className="solace-vlink font-mono-label text-[10px] tracking-[0.22em] text-[var(--sol-muted)]" />
          <div className="flex flex-col items-center gap-3">
            <RailIcon href="https://github.com/jhasan018" label="GitHub">
              <span className="font-mono-label text-[10px] font-medium tracking-[0.08em]">GH</span>
            </RailIcon>
            <RailIcon href="https://www.linkedin.com/in/jhasan14152/" label="LinkedIn">
              <span className="font-mono-label text-[10px] font-medium tracking-[0.08em]">LI</span>
            </RailIcon>
            <RailIcon href="mailto:jahid.bubtcse29@gmail.com" label="Email">
              <Mail className="size-4" />
            </RailIcon>
          </div>
        </div>
      </aside>

      {/* ---------- Mobile / tablet: top bar ---------- */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[120] flex items-center justify-between px-6 py-4 transition-all duration-500 lg:hidden",
          scrolled || open
            ? "border-b border-[var(--sol-line)] bg-[var(--sol-paper)]/90 backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <Link
          href="/"
          aria-label="Jahid Hasan — home"
          className="font-display text-2xl font-semibold tracking-tight"
        >
          JH<span className="text-[var(--sol-accent)]">.</span>
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="solace-mobile-nav"
          aria-label="Toggle menu"
          className="grid size-10 place-items-center rounded-full border border-[var(--sol-line)] text-[var(--sol-ink)]"
        >
          {open ? (
            <X className="size-5" />
          ) : (
            <span className="flex flex-col gap-[5px]">
              <span className="block h-px w-5 bg-current" />
              <span className="block h-px w-5 bg-current" />
            </span>
          )}
        </button>
      </header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="solace-mobile-nav"
            className="fixed inset-0 z-[110] flex flex-col justify-between bg-[var(--sol-paper)] px-8 pb-10 pt-24 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav aria-label="Mobile navigation">
              <ul>
                {links.map(([href, label], i) => {
                  const isActive =
                    pathname === href ||
                    (href !== "/" && pathname.startsWith(href));
                  return (
                    <motion.li
                      key={href}
                      initial={reduceMotion ? false : { y: 28, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: reduceMotion ? 0 : i * 0.055 }}
                      className="border-b border-[var(--sol-line)]"
                    >
                      <Link
                        href={href}
                        className={cn(
                          "group flex items-baseline justify-between py-4",
                          isActive ? "text-[var(--sol-accent)]" : "text-[var(--sol-ink)]",
                        )}
                      >
                        <span className="font-display text-4xl font-medium tracking-tight">
                          {label}
                        </span>
                        <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--sol-faint)]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center justify-between font-mono-label text-[10px] uppercase tracking-[0.18em] text-[var(--sol-faint)]">
              <span>Dhaka — <LiveClock /></span>
              <span className="flex items-center gap-2 text-[var(--sol-accent)]">
                <span className="size-1.5 rounded-full bg-[var(--sol-accent)]" />
                Available
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content offset by rail */}
      <div className="lg:pl-[92px]">
        <main id="solace-main">{children}</main>
        <SolaceFooter />
      </div>
    </div>
  );
}

function RailIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      aria-label={label}
      className="grid size-9 place-items-center rounded-full border border-transparent text-[var(--sol-faint)] transition-all duration-300 hover:border-[var(--sol-line)] hover:text-[var(--sol-accent)]"
    >
      {children}
    </Link>
  );
}

function ScrollProgress({
  scrollYProgress,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const reduceMotion = useReducedMotion();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });
  if (reduceMotion) return null;
  return (
    <motion.div
      aria-hidden
      className="fixed left-[91px] top-0 z-[130] hidden h-full w-[2px] origin-top bg-[var(--sol-accent)]/70 lg:block"
      style={{ scaleY }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Footer — ink block, giant fill-link CTA                             */
/* ------------------------------------------------------------------ */

function SolaceFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#161511] text-[#ece9df]">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-24 sm:px-12">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.28em] text-[#7fc7ac]">
          ( Next step )
        </p>

        <Link href="/contact" className="group mt-8 inline-block">
          <span className="solace-filllink font-display text-[clamp(2.6rem,8vw,7rem)] font-medium leading-[1.02] tracking-[-0.02em]">
            <span className="solace-fill-inner">Let&apos;s work together</span>
            <span aria-hidden className="solace-fill-dup font-display">
              Let&apos;s work together
            </span>
          </span>
          <span className="mt-4 inline-flex items-center gap-3 font-mono-label text-xs uppercase tracking-[0.22em] text-[#b5b0a2] transition-colors group-hover:text-[#7fc7ac]">
            Get in touch
            <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </span>
        </Link>

        <div className="mt-20 grid gap-10 border-t border-white/[0.09] pt-10 sm:grid-cols-3">
          <div>
            <p className="font-mono-label text-[10px] uppercase tracking-[0.24em] text-[#7fc7ac]">
              Contact
            </p>
            <a
              href="mailto:jahid.bubtcse29@gmail.com"
              className="solace-link mt-3 inline-block break-all text-sm text-[#b5b0a2] transition-colors hover:text-[#ece9df]"
            >
              jahid.bubtcse29@gmail.com
            </a>
          </div>
          <div>
            <p className="font-mono-label text-[10px] uppercase tracking-[0.24em] text-[#7fc7ac]">
              Socials
            </p>
            <div className="mt-3 flex flex-col items-start gap-1.5 text-sm text-[#b5b0a2]">
              <a
                className="solace-link transition-colors hover:text-[#ece9df]"
                href="https://github.com/jhasan018"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a
                className="solace-link transition-colors hover:text-[#ece9df]"
                href="https://www.linkedin.com/in/jhasan14152/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
          <div>
            <p className="font-mono-label text-[10px] uppercase tracking-[0.24em] text-[#7fc7ac]">
              Local time
            </p>
            <p className="mt-3 text-sm text-[#b5b0a2]">
              Dhaka, Bangladesh — <LiveClock />
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/[0.09] pt-7 font-mono-label text-[10px] uppercase tracking-[0.18em] text-[#7d786c] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Jahid Hasan</span>
          <span>Interactive web development / React / Next.js / GSAP</span>
          <span>Designed &amp; built with intent</span>
        </div>
      </div>
    </footer>
  );
}
