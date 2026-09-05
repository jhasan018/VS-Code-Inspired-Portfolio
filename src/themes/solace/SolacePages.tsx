"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Mail,
  MapPin,
  Search,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import type { About, Blog, Profile, Project, Skill } from "@/lib/types";
import { blogImageSrc, projectDescription, projectImageAlt, projectRole } from "@/lib/content-seo";
import OpenStreetMap from "@/components/ui/OpenStreetMap";

import {
  Counter,
  FloatingPreview,
  LiveClock,
  Magnetic,
  Marquee,
  Reveal,
  SectionHead,
  WordReveal,
} from "./SolaceFx";

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono-label text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--sol-accent)]">
      ( {children} )
    </p>
  );
}

/* New button system — border pill, slide-up fill, rotating arrow chip */
function InkButton({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <Magnetic>
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-[var(--sol-ink)] px-7 py-3.5 text-sm font-semibold text-[var(--sol-ink)] transition-colors duration-300 hover:text-[var(--sol-paper)]"
      >
        <span
          aria-hidden
          className="absolute inset-0 translate-y-[102%] bg-[var(--sol-ink)] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
        />
        <span className="relative z-10">{children}</span>
        <span className="relative z-10 grid size-6 place-items-center rounded-full bg-[var(--sol-accent)] text-white transition-transform duration-500 group-hover:rotate-45">
          <ArrowUpRight className="size-3.5" />
        </span>
      </Link>
    </Magnetic>
  );
}

function GhostButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Magnetic strength={0.22}>
      <Link
        href={href}
        className="group inline-flex items-center gap-3 rounded-full border border-[var(--sol-line)] px-7 py-3.5 text-sm font-semibold text-[var(--sol-muted)] transition-colors duration-300 hover:border-[var(--sol-accent)] hover:text-[var(--sol-accent)]"
      >
        {children}
        <span className="relative grid size-6 place-items-center overflow-hidden rounded-full border border-current">
          <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:-translate-y-5 group-hover:translate-x-5" />
          <ArrowUpRight className="absolute size-3.5 -translate-x-5 translate-y-5 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0" />
        </span>
      </Link>
    </Magnetic>
  );
}

const projectTypeLabel = (type: Project["project_type"] | undefined) =>
  type === "client"
    ? "Client"
    : type === "personal"
      ? "Personal"
      : "Company";

/* Rotating word — cycles through phrases */
function WordRotator({
  words,
  className,
}: {
  words: string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, [words.length, reduce]);

  return (
    <span className={"relative inline-block align-bottom " + (className ?? "")}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className="inline-block text-[var(--sol-accent)]"
          initial={reduce ? false : { y: "60%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? undefined : { y: "-60%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* Per-letter hover lift for display type */
function HoverLetters({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.05em] -mb-[0.05em]">
          <motion.span
            className={
              "inline-block will-change-transform " +
              (!reduce ? "transition-transform duration-300 hover:-translate-y-[0.06em] hover:text-[var(--sol-accent)]" : "")
            }
            initial={reduce ? false : { y: "108%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.9,
              delay: delay + i * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* Interactive hero portrait — 3D tilt, parallax chips, rotating stamp */
/* (implemented as HeroPortrait below) */

/* ================================================================== */
/* HOME                                                               */
/* ================================================================== */

export function Home({
  profile,
  about,
  skills,
  projects,
  blogs,
}: {
  profile: Profile | null;
  about: About | null;
  skills: Skill[];
  projects: Project[];
  blogs: Blog[];
}) {
  const reduceMotion = useReducedMotion();
  const featured = projects.slice(0, 6);
  const coreSkills = skills.slice(0, 14);

  return (
    <div className="overflow-hidden bg-[var(--sol-paper)]">
      {/* ---------------- HERO ---------------- */}
      <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-6 pb-8 pt-24 sm:px-12 sm:pt-28 lg:pt-20">
        <div
          aria-hidden
          className="solace-gridlines pointer-events-none absolute inset-0 opacity-70"
        />
        {/* Ambient blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-10%] top-[8%] size-[480px] rounded-full opacity-60 blur-[90px]"
          style={{ background: "radial-gradient(circle, #dcebe1, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-6%] left-[-8%] size-[380px] rounded-full opacity-50 blur-[90px]"
          style={{ background: "radial-gradient(circle, #f0ead6, transparent 70%)" }}
        />

        {/* Meta row */}
        <motion.div
          className="relative z-10 flex items-center justify-between font-mono-label text-[10px] uppercase tracking-[0.26em] text-[var(--sol-muted)]"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <Kicker>Portfolio — {new Date().getFullYear()}</Kicker>
          <span className="hidden items-center gap-2 sm:flex">
            <span
              className={
                "size-1.5 animate-pulse rounded-full " +
                (profile?.available_for_work ? "bg-[var(--sol-accent)]" : "bg-[#a39c8c]")
              }
            />
            {profile?.available_for_work ? "Open for work" : "Engaged"}
          </span>
        </motion.div>

        <div className="relative z-10 grid items-center gap-14 py-10 lg:grid-cols-[1.12fr_0.88fr]">
          {/* Left — giant type + rotator + CTAs */}
          <div>
            <h1
              className="font-display font-medium leading-[0.92] tracking-[-0.03em]"
              aria-label={`${profile?.name || "Jahid Hasan"} — full-stack developer`}
            >
              <HoverLetters text="JAHID" className="block text-[clamp(3.4rem,11vw,9rem)]" delay={0.25} />
              <HoverLetters text="HASAN" className="block text-[clamp(3.4rem,11vw,9rem)] text-[var(--sol-accent)]" delay={0.45} />
            </h1>

            <p className="mt-7 font-grotesk text-lg font-medium sm:text-2xl">
              <WordReveal
                text="I build and ship"
                className="text-[var(--sol-muted)]"
                delay={0.85}
              />{" "}
              <WordRotator
                words={[
                  "web applications.",
                  "delivery systems.",
                  "product experiences.",
                  "clean architectures.",
                ]}
              />
            </p>

            <motion.p
              className="mt-5 max-w-lg text-base leading-relaxed text-[var(--sol-muted)]"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.15 }}
            >
              {profile?.subtitle ||
                "Full-stack developer leading delivery from technical planning through launch."}
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-4"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            >
              <InkButton href="/projects">View selected work</InkButton>
              <GhostButton href="/contact">Discuss a project</GhostButton>
            </motion.div>
          </div>

          {/* Right — interactive portrait stage */}
          <HeroPortrait profile={profile} experience={about?.experience_years ?? 3} />
        </div>

        {/* Bottom meta */}
        <motion.div
          className="relative z-10 flex items-end justify-between border-t border-[var(--sol-line)] pt-6 pb-2 font-mono-label text-[10px] uppercase tracking-[0.22em] text-[var(--sol-faint)]"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.45 }}
        >
          <span className="flex items-center gap-3">
            <motion.span
              animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="size-3.5 text-[var(--sol-accent)]" />
            </motion.span>
            Scroll
          </span>
          <span>Dhaka, BD — <LiveClock /></span>
          <span className="hidden sm:block">
            {about?.projects_count ?? 30}+ products delivered
          </span>
        </motion.div>
      </section>

      {/* ---------------- MARQUEE STRIP ---------------- */}
      <section className="border-y border-[var(--sol-line)] py-6">
        <Marquee
          speed={40}
          className="font-grotesk text-xl font-medium uppercase tracking-[0.08em] text-[var(--sol-ink)] sm:text-2xl"
          items={[
            "Interactive web development",
            "GSAP animation",
            "Technical leadership",
            "System architecture",
            "Clear communication",
          ]}
        />
      </section>

      {/* ---------------- SELECTED WORK — INDEX ---------------- */}
      <WorkIndex projects={featured} home />

      {/* ---------------- STICKY PROFILE SPLIT ---------------- */}
      <section className="mx-auto max-w-6xl px-6 py-28 sm:px-12 sm:py-36">
        <div className="grid gap-14 md:grid-cols-2">
          <div className="self-start md:sticky md:top-24">
            <Reveal>
              <Kicker>01 — Profile</Kicker>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-6 font-display text-4xl font-medium leading-[1.04] tracking-[-0.01em] sm:text-6xl">
                Engineering with{" "}
                <span className="text-[var(--sol-accent)]">intent,</span>
                <br />
                delivered end-to-end.
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-[var(--sol-line)] pt-7">
                {[
                  { v: about?.experience_years ?? 3, l: "Years" },
                  { v: about?.projects_count ?? 30, l: "Products" },
                  { v: about?.clients_count ?? 15, l: "Clients" },
                ].map((s) => (
                  <div key={s.l}>
                    <Counter
                      value={s.v}
                      suffix="+"
                      className="font-display text-3xl font-medium sm:text-4xl"
                    />
                    <p className="mt-1 font-mono-label text-[9px] uppercase tracking-[0.2em] text-[var(--sol-faint)]">
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.22} className="mt-10">
              <InkButton href="/about">More about me</InkButton>
            </Reveal>
          </div>

          <div className="space-y-10 pt-2">
            <Reveal>
              <p className="text-lg leading-relaxed text-[var(--sol-muted)] sm:text-xl">
                {about?.bio ||
                  profile?.bio ||
                  "I treat engineering, delivery, and communication as one connected discipline."}
              </p>
            </Reveal>
            <div>
              {[
                ["Full ownership", "Outcome responsibility, not just tickets."],
                ["Systems thinking", "Architecture the next engineer can read."],
                ["Clear communication", "Trade-offs surfaced early."],
                ["Accountability", "I stay through launch and after."],
              ].map(([t, c], i) => (
                <Reveal key={t} delay={i * 0.06}>
                  <div className="group flex items-baseline justify-between gap-6 border-t border-[var(--sol-line)] py-5 last:border-b">
                    <span className="font-display text-xl font-medium transition-colors duration-300 group-hover:text-[var(--sol-accent)]">
                      {t}
                    </span>
                    <span className="max-w-[240px] text-right text-xs leading-relaxed text-[var(--sol-muted)]">
                      {c}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- SKILLS SPECIMEN PREVIEW ---------------- */}
      <section className="border-t border-[var(--sol-line)] bg-white/50 px-6 py-24 sm:px-12 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            index="02"
            label="Capabilities"
            title={"A working set,\nmeasured by shipping."}
            action={<InkButton href="/skills">All skills</InkButton>}
          />
          <div className="mt-12">
            <SpecimenWall
              groups={[
                [
                  "Working set",
                  coreSkills.length ? coreSkills : skills.slice(0, 14),
                ],
              ]}
              compact
            />
          </div>
        </div>
      </section>

      {/* ---------------- JOURNAL — STAGGERED GRID ---------------- */}
      <section className="mx-auto max-w-6xl px-6 py-28 sm:px-12 sm:py-36">
        <SectionHead
          index="03"
          label="Journal"
          title={"Notes from\nthe work."}
          action={<InkButton href="/blogs">All articles</InkButton>}
        />
        <JournalGrid blogs={blogs.slice(0, 3)} />
      </section>
    </div>
  );
}

/* ================================================================== */
/* Hero portrait — interactive                                        */
/* ================================================================== */

function HeroPortrait({
  profile,
  experience,
}: {
  profile: Profile | null;
  experience: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 });
  const chipX = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });

  if (reduce) {
    return (
      <div className="relative mx-auto w-full max-w-[360px]">
        <StaticPortrait profile={profile} />
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="relative mx-auto w-full max-w-[380px] cursor-crosshair"
      style={{ perspective: 1200 }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        ry.set(px * 14);
        rx.set(-py * 12);
        chipX.set(px * 26);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
        chipX.set(0);
      }}
    >
      <motion.div
        className="relative"
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      >
        {/* Arch portrait card */}
        <div className="overflow-hidden rounded-t-[999px] rounded-b-[1.75rem] border border-[var(--sol-line)] bg-white p-2.5 shadow-[0_50px_100px_-45px_rgba(28,27,23,0.4)]">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[1.35rem]">
            <Image
              src="/jahid-hero-professional.png"
              alt={profile?.name || "Jahid Hasan"}
              fill
              priority
              sizes="(max-width: 1024px) 84vw, 380px"
              className="object-cover object-[center_14%] saturate-[0.55] transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:saturate-100"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,transparent_62%,rgba(28,27,23,0.28))]"
            />
          </div>
        </div>

        {/* Rotating stamp */}
        <div aria-hidden className="absolute -right-7 -top-7 z-20 size-28">
          <svg viewBox="0 0 100 100" className="solace-stamp size-full">
            <defs>
              <path id="solace-hero-circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
            </defs>
            <circle cx="50" cy="50" r="49" fill="white" stroke="var(--sol-line)" />
            <text className="fill-[var(--sol-ink)] font-mono-label" fontSize="9" letterSpacing="2.4">
              <textPath href="#solace-hero-circle">
                OPEN TO WORK · WORLDWIDE · OPEN TO WORK ·
              </textPath>
            </text>
          </svg>
          <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--sol-accent)]" />
        </div>

        {/* Floating chips with parallax depth */}
        <motion.div
          className="absolute -left-8 top-16 z-20 rounded-2xl border border-[var(--sol-line)] bg-white/95 px-5 py-3.5 shadow-[0_24px_50px_-24px_rgba(28,27,23,0.35)] backdrop-blur"
          style={{ x: chipX, transform: "translateZ(46px)" }}
          animate={{ y: [0, -9, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-display text-2xl font-medium text-[var(--sol-accent)]">
            {experience}+
          </span>
          <span className="block font-mono-label text-[8px] uppercase tracking-[0.18em] text-[var(--sol-faint)]">
            Years shipping
          </span>
        </motion.div>

        <motion.div
          className="absolute -bottom-4 right-2 z-20 flex items-center gap-2.5 rounded-full border border-[var(--sol-line)] bg-white/95 px-4 py-2.5 shadow-[0_24px_50px_-24px_rgba(28,27,23,0.35)] backdrop-blur"
          style={{ transform: "translateZ(30px)" }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        >
          <MapPin className="size-3.5 text-[var(--sol-accent)]" />
          <span className="font-mono-label text-[10px] uppercase tracking-[0.16em] text-[var(--sol-muted)]">
            {profile?.location || "Dhaka"}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function StaticPortrait({ profile }: { profile: Profile | null }) {
  return (
    <div className="overflow-hidden rounded-t-[999px] rounded-b-[1.75rem] border border-[var(--sol-line)] bg-white p-2.5 shadow-[0_50px_100px_-45px_rgba(28,27,23,0.4)]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[1.35rem]">
        <Image
          src="/jahid-hero-professional.png"
          alt={profile?.name || "Jahid Hasan"}
          fill
          priority
          sizes="(max-width: 1024px) 84vw, 360px"
          className="object-cover object-[center_14%]"
        />
      </div>
    </div>
  );
}

/* ================================================================== */
/* Shared: Work index list + cursor preview                           */
/* ================================================================== */

function WorkIndex({
  projects,
  home = false,
}: {
  projects: Project[];
  home?: boolean;
}) {
  const [active, setActive] = useState<{ img: string | null; cap: string } | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className={"px-6 sm:px-12 " + (home ? "py-28 sm:py-36" : "pb-28")}
      ref={containerRef as React.RefObject<HTMLElement>}
    >
      <div className="mx-auto max-w-6xl">
        {!home && (
          <div className="mb-10">
            <Kicker>Selected output</Kicker>
          </div>
        )}
        {home && (
          <SectionHead
            index="01"
            label="Selected work"
            title={"Selected work,\nshown as an index."}
            action={<InkButton href="/projects">Full archive</InkButton>}
          />
        )}

        <div className={home ? "mt-14" : ""}>
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i * 0.05, 0.25)}>
              <a
                href={p.live_url || p.github_url || "#"}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() =>
                  setActive({
                    img: p.cover_image || null,
                    cap: p.category || "Digital product",
                  })
                }
                onMouseLeave={() => setActive(null)}
                className="group relative block border-t border-[var(--sol-line)] py-6 last:border-b md:py-10"
              >
                {/* Mobile — thumbnail card */}
                <div className="flex gap-4 md:hidden">
                  <div className="relative h-[76px] w-24 shrink-0 overflow-hidden rounded-lg border border-[var(--sol-line)] bg-[var(--sol-sand)]">
                    {p.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.cover_image}
                        alt={projectImageAlt(p)}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="grid h-full w-full place-items-center font-display text-xl text-[#cfc9b8]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3 font-mono-label text-[9px] uppercase tracking-[0.16em]">
                      <span className="text-[var(--sol-accent)]">
                        {projectTypeLabel(p.project_type)}
                      </span>
                      <span className="text-[var(--sol-faint)]">
                        /{String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-display text-xl font-medium leading-snug tracking-[-0.01em] transition-colors duration-300 group-hover:text-[var(--sol-accent)]">
                      {p.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--sol-muted)]">
                      {projectDescription(p)}
                    </p>
                    {projectRole(p) && <p className="mt-1 text-[10px] text-[var(--sol-accent)]">{projectRole(p)}</p>}
                    <div className="mt-2 flex items-center justify-between font-mono-label text-[9px] uppercase tracking-[0.16em]">
                      <span className="truncate text-[var(--sol-faint)]">
                        {p.tech_stack?.slice(0, 3).join(" · ")}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[var(--sol-accent)]">
                        Visit
                        <ArrowUpRight className="size-3" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desktop — index row */}
                <div className="hidden items-baseline gap-3 md:grid md:grid-cols-[56px_1fr_auto]">
                  <span className="font-mono-label text-[11px] tracking-[0.18em] text-[var(--sol-faint)]">
                    /{String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[clamp(1.7rem,4vw,3.1rem)] font-medium leading-[1.05] tracking-[-0.01em] transition-all duration-300 group-hover:translate-x-2 group-hover:text-[var(--sol-accent)]">
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-1 max-w-xl text-sm text-[var(--sol-muted)]">
                      {projectDescription(p)}
                    </p>
                    {projectRole(p) && <p className="mt-1 text-xs text-[var(--sol-accent)]">{projectRole(p)}</p>}
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                      {p.tech_stack?.slice(0, 5).map((t) => (
                        <span
                          key={t}
                          className="font-mono-label text-[9px] uppercase tracking-[0.16em] text-[var(--sol-faint)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex max-md:flex-wrap items-baseline gap-x-6 gap-y-1 font-mono-label text-[10px] uppercase tracking-[0.18em] max-md:pl-[56px]">
                    <span className="text-[var(--sol-accent)]">
                      {projectTypeLabel(p.project_type)}
                    </span>
                    <span className="text-[var(--sol-faint)]">{p.status}</span>
                    <span className="inline-flex items-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Visit
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      <FloatingPreview
        image={active?.img ?? null}
        caption={active?.cap ?? ""}
        visible={!!active}
        containerRef={containerRef}
      />
    </section>
  );
}

/* ================================================================== */
/* Shared: Skill specimen wall                                        */
/* ================================================================== */

function SpecimenWall({
  groups,
  compact = false,
}: {
  groups: [string, Skill[]][];
  compact?: boolean;
}) {
  return (
    <div className={compact ? "" : "grid gap-x-16 lg:grid-cols-2"}>
      {groups.map(([cat, list], gi) => (
        <Reveal key={cat} delay={(gi % 2) * 0.08}>
          <div className="border-t border-[var(--sol-line)] pb-10 pt-5">
            <div className="flex items-baseline justify-between font-mono-label text-[10px] uppercase tracking-[0.22em]">
              <span className="text-[var(--sol-accent)]">
                ({String(gi + 1).padStart(2, "0")}) — {cat}
              </span>
              <span className="text-[var(--sol-faint)]">
                {String(list.length).padStart(2, "0")} tools
              </span>
            </div>
            <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-3">
              {list.map((s) => {
                const size =
                  compact && s.proficiency >= 90
                    ? 1.7
                    : compact && s.proficiency >= 80
                      ? 1.45
                      : compact
                        ? 1.2
                        : 1.15 + (s.proficiency / 100) * 1.1;
                return (
                  <span
                    key={s.id}
                    title={`${s.name} — ${s.proficiency}% proficiency`}
                    style={{ fontSize: `${size}rem` }}
                    className="cursor-default font-display font-medium leading-[1.15] tracking-[-0.01em] text-[var(--sol-ink)]/85 transition-all duration-300 hover:-translate-y-1 hover:text-[var(--sol-accent)]"
                  >
                    {s.name}
                    <sup className="ml-1 font-mono-label text-[9px] font-normal tracking-normal text-[var(--sol-faint)]">
                      {s.proficiency}
                    </sup>
                  </span>
                );
              })}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ================================================================== */
/* Shared: Journal staggered grid                                     */
/* ================================================================== */

function JournalGrid({ blogs }: { blogs: Blog[] }) {
  if (!blogs.length) {
    return (
      <p className="mt-12 text-sm text-[var(--sol-faint)]">
        Articles will appear here once published from the dashboard.
      </p>
    );
  }
  return (
    <div className="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog, i) => (
        <Reveal
          key={blog.id}
          delay={(i % 3) * 0.07}
          className={i % 3 === 1 ? "lg:mt-16" : i % 3 === 2 ? "lg:mt-32" : ""}
        >
          <Link href={`/blogs/${blog.slug}`} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--sol-line)] bg-[var(--sol-sand)]">
              {blog.cover_image ? (
                <Image
                  src={blogImageSrc(blog.cover_image)}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover grayscale-[35%] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:grayscale-0"
                />
              ) : (
                <div className="grid h-full w-full place-items-center p-6">
                  <span className="font-display text-4xl font-light text-[#cfc9b8]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-5 flex items-baseline justify-between font-mono-label text-[10px] uppercase tracking-[0.18em]">
              <span className="text-[var(--sol-accent)]">
                {blog.category || "Article"}
              </span>
              <span className="text-[var(--sol-faint)]">
                {new Date(blog.created_at).toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <h3 className="mt-3 font-display text-2xl font-medium leading-snug tracking-[-0.01em] transition-colors duration-300 group-hover:text-[var(--sol-accent)]">
              {blog.title.replace(/<[^>]*>/g, "")}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--sol-muted)]">
              {blog.excerpt.replace(/<[^>]*>/g, "")}
            </p>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

/* ================================================================== */
/* Shared: page hero                                                  */
/* ================================================================== */

function PageHero({
  eyebrow,
  title,
  accent,
  lead,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  lead: string;
}) {
  return (
    <section className="relative overflow-hidden px-6 pb-8 pt-24 sm:px-12 sm:pb-10 sm:pt-28">
      <div
        aria-hidden
        className="solace-gridlines-12 pointer-events-none absolute inset-0 opacity-60"
      />
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <Kicker>{eyebrow}</Kicker>
        </Reveal>
        <h1 className="mt-5 font-display text-[clamp(2.2rem,5.2vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.02em]">
          <WordReveal text={title} delay={0.08} />{" "}
          <span className="text-[var(--sol-accent)]">
            <WordReveal text={accent} delay={0.3} />
          </span>
        </h1>
        <Reveal delay={0.45}>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--sol-muted)] sm:text-base">
            {lead}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== */
/* ABOUT                                                              */
/* ================================================================== */

export function AboutPage({
  profile,
  about,
}: {
  profile: Profile | null;
  about: About | null;
}) {
  const timeline = about?.timeline || [];
  const education = about?.education || [];

  return (
    <div className="overflow-hidden bg-[var(--sol-paper)]">
      <PageHero
        eyebrow="About — Practice"
        title="A developer who"
        accent="thinks in systems."
        lead="Engineering, delivery, and clear communication — treated as one connected discipline."
      />

      {/* Portrait + bio split */}
      <section className="mx-auto max-w-6xl px-6 pt-8 sm:px-12">
        <div className="grid items-start gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <figure className="relative mx-auto w-full max-w-[360px]">
              <div className="rotate-[-2deg] overflow-hidden rounded-xl border border-[var(--sol-line)] bg-white p-2.5 shadow-[0_30px_60px_-35px_rgba(28,27,23,0.4)] transition-transform duration-500 hover:rotate-0">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                  <Image
                    src="/jahid-about-professional.png"
                    alt={profile?.name || "Jahid Hasan"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 360px"
                    className="object-cover object-[center_15%]"
                  />
                </div>
                <figcaption className="flex items-center justify-between px-1 pb-1 pt-3 font-mono-label text-[9px] uppercase tracking-[0.18em] text-[var(--sol-faint)]">
                  <span>{profile?.name || "Jahid Hasan"}</span>
                  <span>{profile?.location || "Dhaka, BD"}</span>
                </figcaption>
              </div>
              {/* taped corner */}
              <span
                aria-hidden
                className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 rotate-[4deg] rounded-sm bg-[var(--sol-sand)]/90 shadow-sm"
              />
            </figure>
          </Reveal>

          <div>
            <Reveal>
              <Kicker>The person</Kicker>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-6 text-xl leading-relaxed text-[var(--sol-ink)] sm:text-2xl">
                {about?.bio || profile?.bio}
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-10 grid grid-cols-2 gap-8 border-t border-[var(--sol-line)] pt-8">
                <div>
                  <Counter
                    value={about?.experience_years ?? 3}
                    suffix="+"
                    className="font-display text-5xl text-[var(--sol-accent)]"
                  />
                  <p className="mt-1 font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--sol-faint)]">
                    Years in practice
                  </p>
                </div>
                <div>
                  <Counter
                    value={about?.projects_count ?? 30}
                    suffix="+"
                    className="font-display text-5xl text-[var(--sol-accent)]"
                  />
                  <p className="mt-1 font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--sol-faint)]">
                    Products delivered
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Principles — numbered manifesto */}
      <section className="mx-auto max-w-6xl px-6 py-28 sm:px-12">
        <SectionHead index="01" label="Principles" title={"How I work."} />
        <div className="mt-12">
          {[
            [
              "Understand the constraint",
              "Good work begins with business context, not the framework.",
            ],
            [
              "Make the system legible",
              "Architecture should help the next person change the product.",
            ],
            [
              "Speed with stability",
              "Pragmatic delivery without trading away maintainability.",
            ],
            [
              "Own the outcome",
              "Delivery includes communication and what happens after launch.",
            ],
          ].map(([t, c], i) => (
            <Reveal key={t} delay={i * 0.05}>
              <div className="group grid items-baseline gap-2 border-t border-[var(--sol-line)] py-7 last:border-b sm:grid-cols-[72px_1fr_1fr]">
                <span className="font-mono-label text-[11px] tracking-[0.18em] text-[var(--sol-faint)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-2xl font-medium transition-colors duration-300 group-hover:text-[var(--sol-accent)] sm:text-3xl">
                  {t}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--sol-muted)]">
                  {c}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Experience timeline */}
      <section className="border-t border-[var(--sol-line)] bg-white/50 px-6 py-28 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionHead index="02" label="Experience" title={"Roles that shaped the practice."} />
          <div className="mt-12">
            {timeline.length ? (
              timeline.map(
                (
                  item: {
                    year?: string;
                    title?: string;
                    company?: string;
                    description?: string;
                  },
                  i: number,
                ) => (
                  <Reveal key={`${item.year}-${i}`} delay={0.05}>
                    <div className="group grid items-baseline gap-2 border-t border-[var(--sol-line)] py-7 last:border-b sm:grid-cols-[110px_1fr_auto]">
                      <span className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-[var(--sol-accent)]">
                        {item.year || "—"}
                      </span>
                      <div>
                        <h3 className="font-display text-2xl font-medium transition-colors duration-300 group-hover:text-[var(--sol-accent)]">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--sol-muted)]">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <span className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-[var(--sol-faint)]">
                        {item.company}
                      </span>
                    </div>
                  </Reveal>
                ),
              )
            ) : (
              <p className="text-sm text-[var(--sol-faint)]">
                Experience details will appear here when added from the dashboard.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="mx-auto max-w-6xl px-6 py-28 sm:px-12">
        <SectionHead index="03" label="Foundations" title={"Education."} />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {education.length ? (
            education.map(
              (
                item: {
                  degree?: string;
                  school?: string;
                  institution?: string;
                  year?: string;
                  description?: string;
                },
                i: number,
              ) => (
                <Reveal key={`${item.degree}-${i}`} delay={(i % 2) * 0.08}>
                  <article className="group relative h-full overflow-hidden rounded-2xl border border-[var(--sol-line)] bg-white p-8 transition-shadow duration-500 hover:shadow-[0_30px_60px_-45px_rgba(28,27,23,0.4)]">
                    <span
                      aria-hidden
                      className="absolute -right-3 -top-7 font-display text-[7rem] font-light leading-none text-[var(--sol-sand)]"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--sol-accent)]">
                      {item.year || "Academic"}
                    </span>
                    <h3 className="mt-4 font-display text-2xl font-medium">
                      {item.degree || "Education"}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--sol-muted)]">
                      {item.school || item.institution}
                    </p>
                    {item.description && (
                      <p className="mt-4 text-sm leading-relaxed text-[var(--sol-muted)]">
                        {item.description}
                      </p>
                    )}
                  </article>
                </Reveal>
              ),
            )
          ) : (
            <p className="text-sm text-[var(--sol-faint)]">
              Education details will appear here when added from the dashboard.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

/* ================================================================== */
/* PROJECTS                                                           */
/* ================================================================== */

export function ProjectsPage({ projects }: { projects: Project[] }) {
  const [type, setType] = useState<Project["project_type"]>("company");
  const [industry, setIndustry] = useState("All");

  const industries = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          projects
            .filter((p) => (p.project_type || "company") === type)
            .map((p) => p.category || "General"),
        ),
      ).sort(),
    ],
    [projects, type],
  );

  const filtered = projects.filter(
    (p) =>
      (p.project_type || "company") === type &&
      (industry === "All" || (p.category || "General") === industry),
  );

  const tabs: {
    id: Project["project_type"];
    icon: typeof Building2;
    label: string;
  }[] = [
    { id: "company", icon: Building2, label: "Company" },
    { id: "client", icon: BriefcaseBusiness, label: "Client" },
    { id: "personal", icon: UserRound, label: "Personal" },
  ];

  return (
    <div className="overflow-hidden bg-[var(--sol-paper)]">
      <PageHero
        eyebrow="Work — Archive"
        title="Interactive web development"
        accent="projects, indexed."
        lead="React, Next.js, and GSAP work across finance, education, healthcare, and e-commerce — most delivered as part of the Dcastalia Limited team."
      />

      {/* Filters — sticky under the rail */}
      <section className="sticky top-0 z-[80] border-y border-[var(--sol-line)] bg-[var(--sol-paper)]/90 px-6 py-4 backdrop-blur-md sm:px-12">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const count = projects.filter(
                (p) => (p.project_type || "company") === tab.id,
              ).length;
              const isActive = type === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setType(tab.id)}
                  className={
                    "relative flex items-center gap-2 py-1 font-mono-label text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 " +
                    (isActive
                      ? "text-[var(--sol-ink)]"
                      : "text-[var(--sol-faint)] hover:text-[var(--sol-muted)]")
                  }
                >
                  <Icon
                    className={
                      "size-3.5 " +
                      (isActive ? "text-[var(--sol-accent)]" : "text-[var(--sol-faint)]")
                    }
                  />
                  {tab.label}
                  <sup className="text-[9px] text-[var(--sol-accent)]">{count}</sup>
                  {isActive && (
                    <motion.span
                      layoutId="solace-filter-underline"
                      className="absolute inset-x-0 -bottom-1 h-px bg-[var(--sol-accent)]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {industries.map((item) => (
              <button
                key={item}
                onClick={() => setIndustry(item)}
                className={
                  "rounded-full border px-3.5 py-1.5 font-mono-label text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 " +
                  (industry === item
                    ? "border-[var(--sol-accent)] bg-[var(--sol-accent)] text-white"
                    : "border-[var(--sol-line)] text-[var(--sol-muted)] hover:border-[var(--sol-faint)]")
                }
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <WorkIndex projects={filtered} />

      {!filtered.length && (
        <p className="-mt-16 px-6 pb-10 text-center text-sm text-[var(--sol-faint)] sm:px-12">
          No projects match this filter.
        </p>
      )}

      <section className="px-6 pb-28 pt-14 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-[var(--sol-line)] bg-white p-10 sm:flex-row sm:items-center">
              <h2 className="max-w-xl font-display text-3xl font-medium leading-tight sm:text-4xl">
                Have something complex to{" "}
                <span className="text-[var(--sol-accent)]">bring to life?</span>
              </h2>
              <InkButton href="/contact">Discuss the project</InkButton>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/* ================================================================== */
/* SKILLS                                                             */
/* ================================================================== */

export function SkillsPage({ skills }: { skills: Skill[] }) {
  const groups = skills.reduce<Record<string, Skill[]>>((all, skill) => {
    (all[skill.category] ||= []).push(skill);
    return all;
  }, {});

  const priority: Record<string, number> = {
    frontend: 0,
    backend: 1,
    database: 2,
    devops: 3,
    tools: 4,
  };

  const orderedGroups: [string, Skill[]][] = Object.entries(groups).sort(
    ([a], [b]) => {
      const ka = Object.keys(priority).findIndex((k) =>
        a.toLowerCase().includes(k),
      );
      const kb = Object.keys(priority).findIndex((k) =>
        b.toLowerCase().includes(k),
      );
      const ia = ka === -1 ? 99 : ka;
      const ib = kb === -1 ? 99 : kb;
      return ia - ib || a.localeCompare(b);
    },
  );

  return (
    <div className="overflow-hidden bg-[var(--sol-paper)]">
      <PageHero
        eyebrow="Capabilities — Working set"
        title="Technical skills"
        accent="and stack."
        lead="React, Next.js, TypeScript, and GSAP for interactive frontends; PHP, Laravel, Yii2, MySQL, and WordPress for dependable backend and content systems."
      />

      <section className="mx-auto max-w-6xl px-6 pb-28 pt-8 sm:px-12">
        <SpecimenWall groups={orderedGroups} />
      </section>
    </div>
  );
}

/* ================================================================== */
/* BLOGS                                                              */
/* ================================================================== */

export function BlogsPage({ blogs }: { blogs: Blog[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const categories = [
    "All",
    ...Array.from(new Set(blogs.map((b) => b.category || "Uncategorized"))).sort(),
  ];

  const filtered = blogs.filter(
    (b) =>
      (category === "All" || (b.category || "Uncategorized") === category) &&
      `${b.title} ${b.excerpt} ${(b.tags || []).join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );

  return (
    <div className="overflow-hidden bg-[var(--sol-paper)]">
      <PageHero
        eyebrow="Journal — Field notes"
        title="Writing about"
        accent="the craft."
        lead="Practical notes on architecture, deployment, product engineering, and lessons learned in production."
      />

      {/* Controls */}
      <section className="sticky top-0 z-[80] border-y border-[var(--sol-line)] bg-[var(--sol-paper)]/90 px-6 py-4 backdrop-blur-md sm:px-12">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <label className="flex w-full max-w-xs items-center gap-3 border-b border-[var(--sol-line)] py-1.5 transition-colors focus-within:border-[var(--sol-accent)]">
            <Search className="size-3.5 text-[var(--sol-faint)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the journal…"
              aria-label="Search articles"
              className="w-full bg-transparent font-mono-label text-xs text-[var(--sol-ink)] outline-none placeholder:text-[var(--sol-faint)]"
            />
          </label>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={
                  "relative py-1 font-mono-label text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 " +
                  (category === item
                    ? "text-[var(--sol-accent)]"
                    : "text-[var(--sol-faint)] hover:text-[var(--sol-muted)]")
                }
              >
                {item}
                {category === item && (
                  <motion.span
                    layoutId="solace-blog-cat-dot"
                    className="absolute -left-3 top-1/2 size-1 -translate-y-1/2 rounded-full bg-[var(--sol-accent)]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-28 pt-14 sm:px-12">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-[var(--sol-faint)]">
          {String(filtered.length).padStart(2, "0")} articles
        </p>
        <JournalGrid blogs={filtered} />
        {!filtered.length && (
          <p className="-mt-8 text-center text-sm text-[var(--sol-faint)]">
            Nothing matches that search.
          </p>
        )}
      </section>
    </div>
  );
}

/* ================================================================== */
/* CONTACT                                                            */
/* ================================================================== */

export function ContactPage({ profile }: { profile: Profile | null }) {
  return (
    <div className="overflow-hidden bg-[var(--sol-paper)]">
      <PageHero
        eyebrow="Contact — Open channel"
        title="Start with a"
        accent="clear brief."
        lead="Product development, web engineering, technical leadership — or a project that needs a dependable delivery partner."
      />

      <section className="mx-auto max-w-6xl px-6 pb-32 sm:px-12">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left — details as hairline ledger */}
          <div>
            <Reveal>
              <Kicker>Reach me</Kicker>
            </Reveal>
            <div className="mt-8">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: profile?.email || "jahid.bubtcse29@gmail.com",
                  href: `mailto:${profile?.email || "jahid.bubtcse29@gmail.com"}`,
                },
                {
                  icon: MapPin,
                  label: "Based in",
                  value: profile?.location || "Dhaka, Bangladesh",
                },
                {
                  icon: ArrowUpRight,
                  label: "GitHub",
                  value: "github.com/jhasan018",
                  href: "https://github.com/jhasan018",
                  external: true,
                },
                {
                  icon: ArrowUpRight,
                  label: "LinkedIn",
                  value: "in/jhasan14152",
                  href: "https://www.linkedin.com/in/jhasan14152/",
                  external: true,
                },
              ].map((row) => {
                const Icon = row.icon;
                const inner = (
                  <>
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[var(--sol-line)] transition-colors duration-300 group-hover:border-[var(--sol-accent)]">
                      <Icon className="size-4 text-[var(--sol-accent)]" />
                    </span>
                    <span>
                      <small className="block font-mono-label text-[9px] uppercase tracking-[0.2em] text-[var(--sol-faint)]">
                        {row.label}
                      </small>
                      <span className="break-all text-sm font-medium">
                        {row.value}
                      </span>
                    </span>
                  </>
                );
                const cls =
                  "group flex items-center gap-4 border-t border-[var(--sol-line)] py-5 last:border-b";
                return (
                  <Reveal key={row.label} delay={0.06}>
                    {row.href ? (
                      <a
                        href={row.href}
                        target={row.external ? "_blank" : undefined}
                        rel={row.external ? "noreferrer" : undefined}
                        className={cls}
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className={cls}>{inner}</div>
                    )}
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.2}>
              <div className="mt-8 flex items-center justify-between rounded-xl bg-[var(--sol-tint)] px-5 py-4">
                <span className="text-sm font-medium text-[var(--sol-accent-deep)]">
                  {profile?.available_for_work
                    ? "Available for new projects"
                    : "Currently engaged"}
                </span>
                <span className="font-mono-label text-[10px] tracking-[0.14em] text-[var(--sol-accent-deep)]/70">
                  DHAKA <LiveClock />
                </span>
              </div>
            </Reveal>
          </div>

          {/* Right — brief form */}
          <Reveal delay={0.1}>
            <SolaceBriefForm />
          </Reveal>
        </div>
        <OpenStreetMap theme="solace" />
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Contact form — underline editorial fields                          */
/* ------------------------------------------------------------------ */

const fieldCls =
  "w-full border-b border-[var(--sol-line)] bg-transparent py-3.5 text-base text-[var(--sol-ink)] outline-none transition-colors placeholder:text-[var(--sol-faint)] focus:border-[var(--sol-accent)]";

function SolaceBriefForm() {
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });

    setSending(false);

    if (res.ok) {
      toast.success("Message sent. Thank you.");
      e.currentTarget.reset();
    } else {
      toast.error("Sending failed. Please try again.");
    }
  }

  return (
    <form onSubmit={submit}>
      <Kicker>The brief</Kicker>
      <h2 className="mt-5 font-display text-4xl font-medium leading-tight sm:text-5xl">
        A few details to <span className="text-[var(--sol-accent)]">start.</span>
      </h2>

      <div className="mt-10 flex flex-col gap-7">
        <div className="grid gap-7 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--sol-muted)]">
              Your name *
            </span>
            <input name="name" required minLength={2} placeholder="Full name" className={fieldCls} />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--sol-muted)]">
              Email *
            </span>
            <input
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              className={fieldCls}
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--sol-muted)]">
            Subject *
          </span>
          <input
            name="subject"
            required
            minLength={2}
            placeholder="What should we build?"
            className={fieldCls}
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--sol-muted)]">
            Message *
          </span>
          <textarea
            name="message"
            required
            minLength={10}
            rows={5}
            placeholder="Context, outcome, and any constraints that matter."
            className={fieldCls + " resize-none leading-relaxed"}
          />
        </label>

        <Magnetic>
          <button
            type="submit"
            disabled={sending}
            className="group relative inline-flex items-center gap-3 self-start overflow-hidden rounded-full border border-[var(--sol-ink)] px-8 py-4 text-sm font-semibold text-[var(--sol-ink)] transition-colors duration-300 hover:text-[var(--sol-paper)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span
              aria-hidden
              className="absolute inset-0 translate-y-[102%] bg-[var(--sol-ink)] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
            />
            <span className="relative z-10">{sending ? "Sending…" : "Send the brief"}</span>
            <span className="relative z-10 grid size-6 place-items-center rounded-full bg-[var(--sol-accent)] text-white transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="size-3.5" />
            </span>
          </button>
        </Magnetic>
      </div>
    </form>
  );
}
