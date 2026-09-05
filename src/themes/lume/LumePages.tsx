"use client";

import Link from "next/link";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Code,
  Mail,
  MapPin,
  Search,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { About, Blog, Profile, Project, Skill } from "@/lib/types";

import LumeContactForm from "./LumeContactForm";
import OpenStreetMap from "@/components/ui/OpenStreetMap";
import {
  Aurora,
  Counter,
  Lamp,
  Magnetic,
  Marquee,
  Reveal,
  TiltCard,
} from "./LumeFx";
import GradientWaves from "./GradientWaves";
import { blogImageSrc, blogReadTime, projectDescription, projectImageAlt, projectRole } from "@/lib/content-seo";

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[hsl(43_70%_62%)]">
      <span className="h-px w-8 bg-[hsl(43_70%_58%_/_0.6)]" />
      {children}
    </span>
  );
}

function GoldLink({
  href,
  children,
  className,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={
        "group inline-flex items-center gap-2 text-sm font-medium text-[#f4efe6] transition-colors hover:text-[hsl(258_94%_84%)] " +
        (className ?? "")
      }
    >
      {children}
      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

function GoldButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Magnetic>
      <Link
        href={href}
        className={
          "group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[#A78BFA] px-7 py-3.5 text-sm font-bold text-[#1f0b2b] transition-all duration-300 hover:scale-[1.03] hover:bg-[#C9B9FD] " +
          (className ?? "")
        }
      >
        <span className="relative z-10 inline-flex items-center gap-2.5 text-[#1f0b2b]">
          {children}
          <ArrowUpRight className="size-4" />
        </span>
      </Link>
    </Magnetic>
  );
}

function GhostButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Magnetic strength={0.22}>
      <Link
        href={href}
        className={
          "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-[#f4efe6] backdrop-blur-md transition-colors duration-300 hover:border-[hsl(258_94%_76%)] hover:bg-[hsl(258_94%_76%_/_0.14)] hover:text-[#E0D5FE] " +
          (className ?? "")
        }
      >
        {children}
      </Link>
    </Magnetic>
  );
}

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
    <section className="relative overflow-hidden px-6 pb-12 pt-44 sm:px-8 sm:pt-52">
      <Aurora intensity={0.55} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(258_94%_76%_/_0.4),transparent)]"
      />
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-medium leading-[1.02] tracking-[-0.01em] text-[#f4efe6] sm:text-6xl md:text-7xl">
            {title} <em className="text-[hsl(258_94%_84%)]">{accent}</em>
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-[#a89e8e] sm:text-lg">
            {lead}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const projectTypeLabel = (type: Project["project_type"] | undefined) =>
  type === "client"
    ? "Client / freelance"
    : type === "personal"
      ? "Personal"
      : "Company delivery";

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
  const featured = projects.slice(0, 8);
  const coreSkills = skills.slice(0, 10);
  // Keep the primary content visible on the first paint. Delaying the hero
  // behind an intro curtain made the heading/portrait miss the LCP budget.
  const introDone = true;

  return (
    <div className="overflow-hidden bg-[#0c0a08]">
      {/* ---------------- CINEMATIC INTRO CURTAIN ---------------- */}
      <AnimatePresence>
        {!introDone && (
          <motion.div
            aria-hidden
            className="fixed inset-0 z-[130] flex flex-col items-center justify-center overflow-hidden bg-[#0c0a08]"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div
              className="font-display text-[clamp(3rem,12vw,10rem)] font-medium leading-none tracking-[-0.03em] text-[#f4efe6]"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {"JAHID HASAN".split("").map((ch, i) => (
                <motion.span
                  key={i}
                  className={
                    ch === " " ? "inline-block w-[0.3em]" : "inline-block"
                  }
                  initial={reduceMotion ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.1 + i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {ch}
                </motion.span>
              ))}
            </motion.div>
            <motion.span
              className="mt-6 text-[10px] uppercase tracking-[0.4em] text-[#8a8174]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              Full-stack developer
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- HERO ---------------- */}
      <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-6 pb-8 pt-24 sm:px-8 sm:pt-28">
        {/* Gradient waves backdrop */}
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <GradientWaves
            horizonColor="#5227FF"
            waveColor="#A78BFA"
            crestColor="#FFFFFF"
            speed={0.35}
            amplitude={2.5}
            waveScale={0.6}
            waveRatio={0.9}
            swell={35}
            turbulence={20}
            tilt={1.11}
            zoom={1.0}
            height={5.5}
            fogDepth={15}
            detail="medium"
            brightness={1.0}
            opacity={1.0}
            mouseInteraction={false}
            parallaxStrength={0.5}
            grain={false}
            grainIntensity={0}
          />
        </div>
        <Aurora intensity={0.4} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 55% 40%, transparent, rgba(8,6,14,0.75) 92%)",
          }}
        />
        {/* Grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-14 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          {/* Copy */}
          <div className="relative">
            <motion.div
              className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md"
              initial={reduceMotion || introDone ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.25 }}
            >
              <span
                className={
                  "size-1.5 rounded-full " +
                  (profile?.available_for_work
                    ? "bg-[hsl(258_94%_76%)] shadow-[0_0_10px_hsl(258_94%_76%)]"
                    : "bg-[#8a8174]")
                }
              />
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#cfc6b7]">
                {profile?.available_for_work
                  ? "Available for select work"
                  : "Currently engaged"}
              </span>
            </motion.div>

            <h1
              className="font-display text-[clamp(2.6rem,9.5vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.02em] text-[#f4efe6]"
            >
              {["Jahid", "Hasan"].map((word, index) => (
                <span
                  key={word}
                  className="inline-block overflow-hidden px-[0.14em] -mx-[0.14em] py-[0.09em] -my-[0.09em]"
                >
                  <motion.span
                    className={
                      "block " +
                      (index === 1
                        ? "italic text-transparent [-webkit-text-stroke:1.5px_hsl(258_90%_82%)]"
                        : "")
                    }
                    initial={
                      reduceMotion || introDone ? false : { y: "110%" }
                    }
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: 2.4 + index * 0.16,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {word}
                    {index === 0 ? "\u00A0" : ""}
                  </motion.span>
                </span>
              ))}
              <span className="block overflow-hidden py-[0.09em] -my-[0.09em]">
                <motion.span
                  className="block font-display text-[clamp(1.1rem,2.4vw,1.6rem)] font-normal italic tracking-[0.02em] text-[#a89e8e]"
                  initial={
                    reduceMotion || introDone ? false : { y: "110%" }
                  }
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 2.75,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  builds interactive websites that move
                </motion.span>
              </span>
            </h1>

            <motion.p
              className="mt-7 max-w-lg text-base leading-relaxed text-[#a89e8e] sm:text-lg"
              initial={reduceMotion || introDone ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 2.95 }}
            >
              I design and develop animated, fast, and scalable web experiences using React, Next.js, and GSAP — from first line of code to production launch.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-4"
              initial={reduceMotion || introDone ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 3.05 }}
            >
              <GoldButton href="/projects">View selected work</GoldButton>
              <GhostButton href="/contact">Discuss a project</GhostButton>
            </motion.div>
          </div>

          {/* Portrait in an orbital portal */}
          <motion.div
            className="relative mx-auto w-full max-w-[min(440px,88vw)]"
            initial={reduceMotion || introDone ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 2.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* rotating dashed orbit */}
            <motion.div
              aria-hidden
              className="absolute -inset-8 rounded-full border border-dashed border-[hsl(43_50%_45%_/_0.35)]"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />
            {/* second orbit counter-rotating */}
            <motion.div
              aria-hidden
              className="absolute -inset-14 rounded-full border border-[hsl(43_70%_60%_/_0.14)]"
              animate={reduceMotion ? undefined : { rotate: -360 }}
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            />

            {/* gold halo behind portrait */}
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 -z-10 size-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
              style={{
                background:
                  "radial-gradient(circle, hsl(258 94% 66% / 0.35), transparent 65%)",
                filter: "blur(50px)",
              }}
            />

            {/* floating portrait */}
            <motion.div
              className="relative aspect-square overflow-hidden rounded-full border border-[hsl(43_70%_55%_/_0.5)] bg-[#14100c] p-2 shadow-[0_60px_140px_-40px_rgba(0,0,0,0.9)]"
              animate={
                reduceMotion ? undefined : { y: [0, -14, 0] }
              }
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="relative size-full overflow-hidden rounded-full">
                <Image
                  src="/jahid-hero-professional.png"
                  alt={profile?.name || "Jahid Hasan"}
                  width={1200}
                  height={1200}
                  priority
                  sizes="(max-width: 1024px) 88vw, 440px"
                  className="object-cover object-[center_22%]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 108%, #0c0a08 18%, transparent 55%)",
                  }}
                />
              </div>
            </motion.div>

            {/* floating stat chips */}
            <motion.div
              className="absolute -left-4 top-14 hidden rounded-2xl border border-white/10 bg-[#14100c]/90 px-5 py-4 backdrop-blur-xl sm:block"
              animate={
                reduceMotion ? undefined : { y: [0, -10, 0] }
              }
              transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            >
              <span className="font-display text-3xl text-[hsl(258_94%_84%)]">
                {about?.experience_years ?? 3}+
              </span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-[#8a8174]">
                Years shipping
              </span>
            </motion.div>

            <motion.div
              className="absolute -right-2 bottom-16 hidden items-center gap-2.5 rounded-2xl border border-white/10 bg-[#14100c]/90 px-4 py-3 backdrop-blur-xl sm:flex"
              animate={
                reduceMotion ? undefined : { y: [0, 10, 0] }
              }
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            >
              <span className="size-1.5 rounded-full bg-[hsl(258_94%_76%)] shadow-[0_0_8px_hsl(258_94%_76%)]" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#cfc6b7]">
                {profile?.location || "Dhaka"}
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom meta strip */}
        <motion.div
          className="relative z-10 mx-auto flex w-full max-w-7xl items-end justify-between gap-6 border-t border-white/[0.07] pt-6 text-[10px] uppercase tracking-[0.24em] text-[#8a8174]"
          initial={reduceMotion || introDone ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 3.1 }}
        >
          <span className="hidden sm:block">
            Full-stack development
            <br />
            <em className="text-[hsl(43_70%_60%)]">/ project delivery</em>
          </span>

          {/* Scroll cue */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.3, duration: 0.8 }}
          >
            <span>Scroll</span>
            <span className="relative h-px w-16 bg-white/15">
              <motion.span
                className="absolute left-0 top-0 h-px w-8 bg-[hsl(258_94%_84%)]"
                animate={
                  reduceMotion ? undefined : { x: [0, 32, 0] }
                }
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.div>

          <span className="text-right">
            {profile?.available_for_work ? "Open to work" : "Engaged"}
            <br />
            <em className="text-[hsl(43_70%_60%)]">/ worldwide</em>
          </span>
        </motion.div>
      </section>

      {/* ---------------- VELOCITY MARQUEE ---------------- */}
      <section className="relative overflow-hidden border-y border-white/[0.08] bg-[#0d0a18] pt-12">
        {/*<div*/}
        {/*  aria-hidden*/}
        {/*  className="pointer-events-none absolute inset-0"*/}
        {/*  style={{*/}
        {/*    background:*/}
        {/*      "linear-gradient(180deg, rgba(255,159,252,0.24), rgba(82,39,255,0.18) 45%, rgba(13,10,24,0) 100%), radial-gradient(70% 55% at 25% 0%, rgba(255,159,252,0.14), transparent 70%)",*/}
        {/*  }}*/}
        {/*/>*/}
        <Marquee
          speed={34}
          className="relative font-display text-2xl tracking-wide text-[#c9bdf8] sm:text-4xl"
          items={[
            "Full-stack engineering",
            "Product delivery",
            "Technical leadership",
            "System architecture",
            "Clear communication",
          ]}
        />
        <div aria-hidden className="h-7" />
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="relative overflow-hidden px-6 py-24 sm:px-8 sm:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,159,252,0.16), rgba(82,39,255,0.12) 40%, transparent 85%), radial-gradient(60% 45% at 78% 10%, rgba(255,159,252,0.1), transparent 70%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 sm:grid-cols-3">
          {[
            {
              value: about?.experience_years ?? 3,
              suffix: "+",
              label: "Years experience",
              copy: "Shipped end-to-end, in production.",
            },
            {
              value: about?.projects_count ?? 30,
              suffix: "+",
              label: "Products delivered",
              copy: "From brief to launch and beyond.",
            },
            {
              value: about?.clients_count ?? 15,
              suffix: "+",
              label: "Client relationships",
              copy: "Built on trust and accountability.",
            },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div className="group relative rounded-3xl border border-white/[0.07] bg-white/[0.02] p-8 transition-colors duration-500 hover:border-[hsl(258_94%_76%_/_0.35)]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(258_94%_76%_/_0.5),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="font-display text-6xl font-medium text-[#f4efe6] sm:text-7xl"
                />
                <div className="mt-3 h-px w-10 bg-[hsl(43_70%_50%)]" />
                <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#d8d0c2]">
                  {stat.label}
                </h2>
                <p className="mt-2 text-sm text-[#8a8174]">{stat.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- SELECTED WORK ---------------- */}
      <section className="relative px-6 py-24 sm:px-8 sm:py-32">
        <Lamp className="mx-auto max-w-7xl">
          <Reveal>
            <Eyebrow>01 · Selected work</Eyebrow>
          </Reveal>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <Reveal delay={0.08}>
              <h2 className="max-w-xl font-display text-4xl font-medium leading-[1.05] text-[#f4efe6] sm:text-6xl">
                Interactive websites built with{" "}
                <em className="text-[hsl(258_94%_84%)]">React, Next.js &amp; GSAP.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <GoldLink href="/projects">All projects</GoldLink>
            </Reveal>
          </div>
        </Lamp>

        <div className="mx-auto mt-16 grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <Reveal
              key={project.id}
              delay={(i % 3) * 0.1}
              className={i === 0 ? "md:col-span-2 lg:col-span-2" : ""}
            >
              <TiltCard className="group h-full rounded-3xl">
                <article className="relative h-full overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0f0c09]">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {project.cover_image ? (
                      <Image
                        src={project.cover_image}
                        alt={projectImageAlt(project)}
                        width={1200}
                        height={675}
                        sizes={i === 0 ? "(max-width: 767px) 100vw, (max-width: 1023px) 100vw, 66vw" : "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"}
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,#17130e,#0e0b08)]">
                        <span className="font-display text-6xl text-[#2a241c]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    )}
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,#0f0c09)]"
                    />
                    <span className="absolute right-4 top-4 rounded-full border border-white/12 bg-black/40 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-[#e6ddcc] backdrop-blur-md">
                      {project.category || "Digital product"}
                    </span>
                    {/* glare */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(560px circle at 50% 50%, hsl(258 94% 84% / 0.14), transparent 45%)",
                      }}
                    />
                  </div>

                  <div className="relative p-7">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[hsl(43_70%_60%)]">
                        {projectTypeLabel(project.project_type)}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#6f675c]">
                        {String(i + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-3xl font-medium leading-tight text-[#f4efe6] sm:text-4xl">
                      {project.title}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#8a8174]">
                      {projectDescription(project)}
                    </p>
                    {projectRole(project) && <p className="mt-2 text-xs text-[#b89a55]">{projectRole(project)}</p>}

                    <div className="mt-6 flex flex-wrap items-center gap-2">
                      {project.tech_stack?.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-[#a89e8e]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-7 flex items-center justify-between border-t border-white/[0.06] pt-6">
                      {project.live_url ? (
                        <GoldLink href={project.live_url} external>
                          View project
                        </GoldLink>
                      ) : (
                        <span />
                      )}
                      {project.github_url && (
                        <GoldLink href={project.github_url} external>
                          Source <Code className="size-3.5" />
                        </GoldLink>
                      )}
                    </div>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- SKILLS MARQUEE ---------------- */}
      <section className="border-y border-white/[0.06] bg-[#0a0806] py-20">
        <div className="mx-auto mb-10 max-w-7xl px-6 text-center sm:px-8">
          <Reveal>
            <Eyebrow>02 · Capabilities</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-4xl font-medium text-[#f4efe6] sm:text-5xl">
              React, Next.js &amp; GSAP —{" "}
              <em className="text-[hsl(258_94%_84%)]">the interactive stack.</em>
            </h2>
          </Reveal>
        </div>

        <Marquee
          reverse
          speed={48}
          className="border-y border-white/[0.05] bg-[#0d0b08] py-5 text-sm uppercase tracking-[0.22em] text-[#8a8174]"
          items={coreSkills.map((s) => s.name)}
        />
      </section>

      {/* ---------------- JOURNAL ---------------- */}
      <section className="relative px-6 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <Lamp>
            <Reveal>
              <Eyebrow>03 · Journal</Eyebrow>
            </Reveal>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <Reveal delay={0.08}>
                <h2 className="font-display text-4xl font-medium leading-[1.05] text-[#f4efe6] sm:text-6xl">
                  Web development guides: <em className="text-[hsl(258_94%_84%)]">Next.js, Laravel &amp; architecture.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <GoldLink href="/blogs">All articles</GoldLink>
              </Reveal>
            </div>
          </Lamp>

          <div className="mt-14 divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {blogs.slice(0, 3).map((blog, i) => (
              <Reveal key={blog.id} delay={i * 0.06}>
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="group flex flex-col gap-3 py-8 transition-colors duration-300 hover:bg-white/[0.02] sm:flex-row sm:items-center sm:gap-8"
                >
                  <span className="w-24 shrink-0 text-[11px] uppercase tracking-[0.2em] text-[#6f675c]">
                    {new Date(blog.created_at).toLocaleDateString("en", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </span>
                  <span className="w-24 shrink-0 text-[10px] uppercase tracking-[0.18em] text-[hsl(43_70%_60%)]">
                    {blogReadTime(blog)} min read
                  </span>
                  <h3 className="flex-1 font-display text-2xl font-medium leading-snug text-[#f4efe6] transition-colors duration-300 group-hover:text-[hsl(258_94%_84%)] sm:text-3xl">
                    {blog.title.replace(/<[^>]*>/g, "")}
                  </h3>
                  <ArrowUpRight className="size-5 text-[#6f675c] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[hsl(258_94%_84%)]" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="relative overflow-hidden px-6 py-28 sm:px-8 sm:py-40">
        <Aurora intensity={0.5} />
        <div className="relative mx-auto max-w-7xl text-center">
          <Lamp>
            <Reveal>
              <Eyebrow>Available for select engagements</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-8 font-display text-5xl font-medium leading-[0.98] text-[#f4efe6] sm:text-7xl md:text-8xl">
                Have a product that
                <br />
                <em className="text-[hsl(258_94%_84%)]">
                  needs clear thinking?
                </em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-12 flex justify-center">
                <GoldButton href="/contact">Start a conversation</GoldButton>
              </div>
            </Reveal>
          </Lamp>
        </div>
      </section>
    </div>
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
    <div className="overflow-hidden bg-[#0c0a08]">
      <PageHero
        eyebrow="About · Practice"
        title="A developer who"
        accent="thinks in systems."
        lead="Interactive, animation-driven web development — engineering, delivery, and clear communication treated as one connected discipline."
      />

      {/* Profile split */}
      <section className="relative mx-auto max-w-7xl px-6 pt-16 sm:px-8 sm:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-5 opacity-40"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 60% at 50% 50%, hsl(258 94% 76% / 0.35), transparent 70%)",
                  filter: "blur(30px)",
                }}
              />
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#14100c] p-3">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem]">
                  <Image
                    src="/jahid-about-professional.png"
                    alt={profile?.name || "Jahid Hasan"}
                    width={1200}
                    height={1500}
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover object-[center_15%] saturate-[0.9]"
                  />
                </div>
                <figcaption className="px-2 py-3 text-[10px] uppercase tracking-[0.2em] text-[#8a8174]">
                  {profile?.location || "Dhaka, Bangladesh"}
                </figcaption>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <Eyebrow>01 · Profile</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-6 font-display text-4xl font-medium text-[#f4efe6] sm:text-5xl">
                {profile?.name || "Jahid Hasan"}
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#a89e8e] sm:text-lg">
                {about?.bio || profile?.bio}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-10 grid max-w-md grid-cols-2 gap-8">
                <div>
                  <Counter
                    value={about?.experience_years ?? 3}
                    suffix="+"
                    className="font-display text-5xl text-[hsl(258_94%_84%)]"
                  />
                  <span className="mt-2 block text-xs uppercase tracking-[0.18em] text-[#8a8174]">
                    Years in practice
                  </span>
                </div>
                <div>
                  <Counter
                    value={about?.projects_count ?? 30}
                    suffix="+"
                    className="font-display text-5xl text-[hsl(258_94%_84%)]"
                  />
                  <span className="mt-2 block text-xs uppercase tracking-[0.18em] text-[#8a8174]">
                    Projects delivered
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why choose me */}
      <section className="relative mx-auto max-w-7xl px-6 py-28 sm:px-8">
        <Lamp>
          <Reveal>
            <Eyebrow>02 · Why choose me</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-2xl font-display text-4xl font-medium leading-[1.05] text-[#f4efe6] sm:text-6xl">
              Built for the problems{" "}
              <em className="text-[hsl(258_94%_84%)]">after launch.</em>
            </h2>
          </Reveal>
        </Lamp>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Full ownership",
              copy: "From brief to production and beyond — I take responsibility for the outcome, not just the ticket.",
            },
            {
              title: "Systems thinking",
              copy: "Architecture built to be understood and changed by the next engineer, not just the first one.",
            },
            {
              title: "Clear communication",
              copy: "Trade-offs, timelines, and blockers surfaced early — so decisions are made with full context.",
            },
            {
              title: "Product sense",
              copy: "Engineering guided by what the product needs to do, not what the framework prefers.",
            },
            {
              title: "Speed with stability",
              copy: "Fast, pragmatic delivery without trading away maintainability, testing, or security.",
            },
            {
              title: "Accountability",
              copy: "I stay through launch and support what ships — dependable through the hard parts.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.1}>
              <article className="group relative h-full overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02] p-8 transition-colors duration-500 hover:border-[hsl(258_94%_76%_/_0.35)]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,hsl(258_94%_76%_/_0.5),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="font-display text-4xl text-transparent transition-colors duration-500 group-hover:text-[hsl(258_94%_84%)]" style={{ WebkitTextStroke: "1px #4a3a6e" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 font-display text-2xl font-medium text-[#f4efe6]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#8a8174]">
                  {item.copy}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Approach */}
      <section className="mx-auto max-w-7xl px-6 py-28 sm:px-8">
        <Reveal>
          <Eyebrow>03 · Approach</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 max-w-2xl font-display text-4xl font-medium leading-[1.05] text-[#f4efe6] sm:text-6xl">
            Clear decisions. Dependable{" "}
            <em className="text-[hsl(258_94%_84%)]">delivery.</em>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            [
              "01",
              "Understand the constraint",
              "Good work begins with the business context, not the framework.",
            ],
            [
              "02",
              "Make the system legible",
              "Architecture should help the next person understand and change the product.",
            ],
            [
              "03",
              "Own the outcome",
              "Delivery includes communication, trade-offs, and what happens after launch.",
            ],
          ].map(([n, title, copy], i) => (
            <Reveal key={n} delay={i * 0.1}>
              <article className="group relative h-full rounded-3xl border border-white/[0.07] bg-white/[0.02] p-8 transition-colors duration-500 hover:border-[hsl(258_94%_76%_/_0.35)]">
                <span className="font-display text-5xl text-transparent" style={{ WebkitTextStroke: "1px #4a3a6e" }}>
                  {n}
                </span>
                <h3 className="mt-6 font-display text-2xl font-medium text-[#f4efe6]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#8a8174]">
                  {copy}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Experience timeline */}
      <section className="relative mx-auto max-w-7xl px-6 pb-28 sm:px-8">
        <Lamp>
          <Reveal>
            <Eyebrow>04 · Experience</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-4xl font-medium leading-[1.05] text-[#f4efe6] sm:text-6xl">
              Roles that shaped the{" "}
              <em className="text-[hsl(258_94%_84%)]">practice.</em>
            </h2>
          </Reveal>
        </Lamp>

        <div className="relative mt-16">
          <div
            aria-hidden
            className="absolute bottom-4 left-[9px] top-4 w-px bg-[linear-gradient(180deg,hsl(43_70%_50%_/_0.5),transparent)] sm:left-[13px]"
          />
          {timeline.length ? (
            <div className="flex flex-col gap-10">
              {timeline.map(
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
                    <div className="group relative flex gap-8 sm:gap-12">
                      <span
                        className="relative z-10 mt-1.5 size-[18px] shrink-0 rounded-full border-2 border-[hsl(258_94%_76%)] bg-[#0c0a08] shadow-[0_0_16px_-2px_hsl(258_94%_76%_/_0.6)] sm:size-[26px]"
                      />
                      <article className="flex-1 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 transition-colors duration-500 group-hover:border-[hsl(258_94%_76%_/_0.35)] sm:p-8">
                        <div className="flex flex-wrap items-baseline justify-between gap-3">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-[hsl(43_70%_60%)]">
                            {item.year || String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-xs text-[#6f675c]">
                            {item.company}
                          </span>
                        </div>
                        <h3 className="mt-4 font-display text-2xl font-medium text-[#f4efe6] sm:text-3xl">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#8a8174]">
                            {item.description}
                          </p>
                        )}
                      </article>
                    </div>
                  </Reveal>
                ),
              )}
            </div>
          ) : (
            <p className="mt-8 text-sm text-[#6f675c]">
              Experience details will appear here when added from the dashboard.
            </p>
          )}
        </div>
      </section>

      {/* Education */}
      <section className="mx-auto max-w-7xl px-6 pb-28 sm:px-8">
        <Reveal>
          <Eyebrow>05 · Foundations</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 font-display text-4xl font-medium text-[#f4efe6] sm:text-5xl">
            Education
          </h2>
        </Reveal>

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
                <Reveal key={`${item.degree}-${i}`} delay={(i % 2) * 0.1}>
                  <article className="relative h-full overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0f0c09] p-8">
                    <span className="absolute -right-2 -top-4 font-display text-7xl text-white/[0.03]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[hsl(43_70%_60%)]">
                      {item.year || "Academic"}
                    </span>
                    <h3 className="mt-5 font-display text-2xl font-medium text-[#f4efe6] sm:text-3xl">
                      {item.degree || "Education"}
                    </h3>
                    <p className="mt-2 text-sm text-[#a89e8e]">
                      {item.school || item.institution}
                    </p>
                    {item.description && (
                      <p className="mt-4 text-sm leading-relaxed text-[#8a8174]">
                        {item.description}
                      </p>
                    )}
                  </article>
                </Reveal>
              ),
            )
          ) : (
            <p className="text-sm text-[#6f675c]">
              Education details will appear here when added from the dashboard.
            </p>
          )}
        </div>

        <Reveal className="mt-20">
          <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-white/[0.07] bg-[linear-gradient(135deg,rgba(216,178,92,0.08),transparent_60%)] p-10 sm:flex-row sm:items-center">
            <h2 className="font-display text-3xl font-medium leading-tight text-[#f4efe6] sm:text-4xl">
              See the work behind{" "}
              <em className="text-[hsl(258_94%_84%)]">the approach.</em>
            </h2>
            <GoldButton href="/projects">View selected projects</GoldButton>
          </div>
        </Reveal>
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

  const changeType = (next: Project["project_type"]) => {
    setType(next);
    setIndustry("All");
  };

  const tabs: {
    id: Project["project_type"];
    icon: typeof Building2;
    label: string;
  }[] = [
    { id: "company", icon: Building2, label: "Company projects" },
    { id: "client", icon: BriefcaseBusiness, label: "Client / freelance" },
    { id: "personal", icon: UserRound, label: "Personal projects" },
  ];

  return (
    <div className="overflow-hidden bg-[#0c0a08]">
      <PageHero
        eyebrow="Work · Selected output"
        title="Work judged by"
        accent="what it delivers."
        lead="Selected client and independent work across complex products, platforms, and industries."
      />

      <section className="mx-auto max-w-7xl px-6 pt-16 sm:px-8 sm:pt-24">
        {/* Filters */}
        <div className="flex flex-col gap-8">
          <div className="grid gap-3 sm:grid-cols-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const count = projects.filter(
                (p) => (p.project_type || "company") === tab.id,
              ).length;
              const active = type === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => changeType(tab.id)}
                  className={
                    "group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 " +
                    (active
                      ? "border-[hsl(258_94%_76%_/_0.5)] bg-[linear-gradient(135deg,rgba(255,159,252,0.12),transparent_70%)]"
                      : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.18]")
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={
                        "size-5 " +
                        (active ? "text-[hsl(258_94%_84%)]" : "text-[#8a8174]")
                      }
                    />
                    <span
                      className={
                        "text-sm font-semibold " +
                        (active ? "text-[#f4efe6]" : "text-[#a89e8e]")
                      }
                    >
                      {tab.label}
                    </span>
                    <span className="ml-auto text-xs text-[hsl(43_70%_60%)]">
                      {count}
                    </span>
                  </div>
                  {active && (
                    <motion.span
                      layoutId="lume-project-tab"
                      className="absolute inset-x-0 bottom-0 h-[2px] bg-[linear-gradient(90deg,#FFD9FE,#7c3aed)]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#6f675c]">
              Filter by industry
            </span>
            {industries.map((item) => (
              <button
                key={item}
                onClick={() => setIndustry(item)}
                className={
                  "rounded-full border px-4 py-1.5 text-xs transition-colors duration-300 " +
                  (industry === item
                    ? "border-[hsl(258_94%_76%_/_0.5)] bg-[hsl(268_84%_55%)] text-[#f4efe6]"
                    : "border-white/10 bg-white/[0.02] text-[#a89e8e] hover:border-white/25")
                }
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 text-[10px] uppercase tracking-[0.22em] text-[#6f675c]">
          {String(filtered.length).padStart(2, "0")} projects shown
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 0.08}>
              <TiltCard className="group h-full rounded-3xl">
                <article className="relative h-full overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0f0c09] transition-colors duration-500 hover:border-[hsl(258_94%_76%_/_0.35)]">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {p.cover_image ? (
                      <Image
                        src={p.cover_image}
                        alt={projectImageAlt(p)}
                        width={1200}
                        height={675}
                        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 387px"
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,#17130e,#0e0b08)]">
                        <span className="font-display text-6xl text-[#2a241c]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    )}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,#0f0c09)]"
                  />
                  <span className="absolute left-4 top-4 rounded-full border border-white/12 bg-black/40 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-[#e6ddcc] backdrop-blur-md">
                    {projectTypeLabel(p.project_type)}
                  </span>
                </div>

                <div className="p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[hsl(43_70%_60%)]">
                      {p.category || "Digital product"}
                    </span>
                    <span className="text-[10px] text-[#6f675c]">
                      {p.status}
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-[#f4efe6]">
                    {p.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#8a8174]">
                    {projectDescription(p)}
                  </p>
                  {projectRole(p) && <p className="mt-2 text-xs text-[#b89a55]">{projectRole(p)}</p>}

                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.tech_stack?.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-[#a89e8e]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-white/[0.06] pt-6">
                    {p.live_url && (
                      <GoldLink href={p.live_url} external>
                        View project
                      </GoldLink>
                    )}
                    {p.github_url && (
                      <GoldLink href={p.github_url} external>
                        Source <Code className="size-3.5" />
                      </GoldLink>
                    )}
                  </div>
</div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {!filtered.length && (
          <p className="py-20 text-center text-sm text-[#6f675c]">
            No projects match this filter.
          </p>
        )}

        {/* CTA */}
        <Reveal className="mb-28 mt-20">
          <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-white/[0.07] bg-[linear-gradient(135deg,rgba(216,178,92,0.08),transparent_60%)] p-10 sm:flex-row sm:items-center">
            <h2 className="font-display text-3xl font-medium leading-tight text-[#f4efe6] sm:text-4xl">
              Have something complex to{" "}
              <em className="text-[hsl(258_94%_84%)]">bring to life?</em>
            </h2>
            <GoldButton href="/contact">Discuss the project</GoldButton>
          </div>
        </Reveal>
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

  const orderedGroups = Object.entries(groups).sort(([a], [b]) => {
    const ka = Object.keys(priority).findIndex((k) =>
      a.toLowerCase().includes(k),
    );
    const kb = Object.keys(priority).findIndex((k) =>
      b.toLowerCase().includes(k),
    );
    const ia = ka === -1 ? 99 : ka;
    const ib = kb === -1 ? 99 : kb;
    return ia - ib || a.localeCompare(b);
  });

  const totalSkills = skills.length;

  return (
    <div className="overflow-hidden bg-[#0c0a08]">
      <PageHero
        eyebrow="Capabilities · Working set"
        title="Technology with"
        accent="a reason to exist."
        lead="A focused working set built through production delivery — not a collection of logos."
      />

      <section className="mx-auto max-w-7xl px-6 pt-16 sm:px-8 sm:pt-24">
        {/* Intro */}
        <Reveal>
          <div className="flex flex-col gap-8 border-b border-white/[0.06] pb-12 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow>01 · Working set</Eyebrow>
              <h2 className="mt-6 max-w-2xl font-display text-4xl font-medium leading-[1.05] text-[#f4efe6] sm:text-5xl">
                Choose for longevity. Build for{" "}
                <em className="text-[hsl(258_94%_84%)]">change.</em>
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#8a8174]">
                I use familiar, maintainable tools and introduce complexity only
                when the product earns it. Proficiency reflects hands-on
                delivery across real projects.
              </p>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl text-[hsl(258_94%_84%)]">
                {totalSkills}
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-[#8a8174]">
                capabilities
                <br />
                in production
              </span>
            </div>
          </div>
        </Reveal>

        {/* Skill groups */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {orderedGroups.map(([category, list], i) => (
            <Reveal key={category} delay={(i % 2) * 0.08}>
              <article className="group h-full overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02] transition-colors duration-500 hover:border-[hsl(258_94%_76%_/_0.35)]">
                <header className="flex items-center gap-5 border-b border-white/[0.06] px-8 py-6">
                  <span className="font-display text-3xl text-transparent transition-colors duration-500 group-hover:text-[hsl(258_94%_84%)]" style={{ WebkitTextStroke: "1px #4a3a6e" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[hsl(43_70%_60%)]">
                      Discipline
                    </span>
                    <h3 className="mt-1 font-display text-2xl font-medium text-[#f4efe6]">
                      {category}
                    </h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-[#a89e8e]">
                    {list.length}
                  </span>
                </header>

                <div className="flex flex-col gap-6 p-8">
                  {list.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-sm font-medium text-[#d8d0c2]">
                          {skill.name}
                        </span>
                        <span className="font-display text-lg text-[hsl(258_94%_84%)]">
                          {skill.proficiency}
                          <span className="ml-0.5 text-xs text-[#8a8174]">%</span>
                        </span>
                      </div>
                      <div className="mt-2 h-[4px] overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#7c3aed,#FFD9FE)] shadow-[0_0_12px_hsl(258_94%_76%_/_0.5)]"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{
                            duration: 1.1,
                            ease: [0.22, 1, 0.36, 1],
                            delay: i * 0.06,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mb-28 mt-20">
          <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-white/[0.07] bg-[linear-gradient(135deg,rgba(216,178,92,0.08),transparent_60%)] p-10 sm:flex-row sm:items-center">
            <h2 className="font-display text-3xl font-medium leading-tight text-[#f4efe6] sm:text-4xl">
              Need this capability on a{" "}
              <em className="text-[hsl(258_94%_84%)]">real product?</em>
            </h2>
            <GoldButton href="/contact">Start a conversation</GoldButton>
          </div>
        </Reveal>
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
    ...Array.from(
      new Set(blogs.map((b) => b.category || "Uncategorized")),
    ).sort(),
  ];

  const filtered = blogs.filter(
    (b) =>
      (category === "All" || (b.category || "Uncategorized") === category) &&
      `${b.title} ${b.excerpt} ${(b.tags || []).join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );

  return (
    <div className="overflow-hidden bg-[#0c0a08]">
      <PageHero
        eyebrow="Journal · Field notes"
        title="Notes from"
        accent="the work."
        lead="Practical writing about architecture, deployment, product engineering, and lessons learned in production."
      />

      <section className="mx-auto max-w-7xl px-6 pt-16 sm:px-8 sm:pt-24">
        {/* Controls */}
        <div className="flex flex-col gap-6 border-b border-white/[0.06] pb-10 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex w-full max-w-sm items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 transition-colors focus-within:border-[hsl(258_94%_76%_/_0.5)]">
            <Search className="size-4 text-[#938a7d]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles or tags"
              aria-label="Search articles"
              className="w-full bg-transparent text-sm text-[#f4efe6] outline-none placeholder:text-[#938a7d]"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={
                  "rounded-full border px-4 py-2 text-xs transition-colors duration-300 " +
                  (category === item
                    ? "border-[hsl(258_94%_76%_/_0.5)] bg-[hsl(268_84%_55%)] text-[#f4efe6]"
                    : "border-white/10 bg-white/[0.02] text-[#a89e8e] hover:border-white/25")
                }
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 text-[10px] uppercase tracking-[0.22em] text-[#938a7d]">
          {String(filtered.length).padStart(2, "0")} articles shown
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((blog, i) => (
            <Reveal key={blog.id} delay={(i % 3) * 0.06}>
              <Link
                href={`/blogs/${blog.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0f0c09] transition-colors duration-500 hover:border-[hsl(258_94%_76%_/_0.35)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {blog.cover_image ? (
                    <Image
                      src={blogImageSrc(blog.cover_image)}
                      alt=""
                      width={1200}
                      height={750}
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,#17130e,#0e0b08)]">
                      <span className="px-4 text-center font-display text-2xl text-[#3a352c]">
                        Field note · {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,#0f0c09)]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
                    <span className="text-[hsl(43_70%_60%)]">
                      {blog.category || "Article"}
                    </span>
                    <span className="text-[#938a7d]">
                      {new Date(blog.created_at).toLocaleDateString("en", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                      })}
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-medium leading-snug text-[#f4efe6] transition-colors duration-300 group-hover:text-[hsl(258_94%_84%)]">
                    {blog.title.replace(/<[^>]*>/g, "")}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#8a8174]">
                    {blog.excerpt.replace(/<[^>]*>/g, "")}
                  </p>
                  <span className="mt-auto flex items-center gap-2 pt-6 text-xs font-medium text-[#a89e8e]">
                    Read article
                    <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {!filtered.length && (
          <p className="py-20 text-center text-sm text-[#938a7d]">
            No articles match that search.
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
    <div className="overflow-hidden bg-[#0c0a08]">
      <PageHero
        eyebrow="Contact · Open channel"
        title="Good work starts"
        accent="with a clear brief."
        lead="For product development, web engineering, technical leadership, or a project that needs a dependable delivery partner."
      />

      <section className="mx-auto max-w-7xl px-6 pb-28 pt-16 sm:px-8 sm:pt-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="flex flex-col">
            <Reveal>
              <Eyebrow>01 · Start here</Eyebrow>
              <h2 className="mt-6 font-display text-4xl font-medium leading-[1.05] text-[#f4efe6] sm:text-5xl">
                Tell me what needs to{" "}
                <em className="text-[hsl(258_94%_84%)]">change.</em>
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#8a8174]">
                Share the context, desired outcome, and important constraints.
                You&apos;ll receive a practical response — not a sales sequence.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-12 flex flex-col gap-4">
                <a
                  href={`mailto:${profile?.email || "jahid.bubtcse29@gmail.com"}`}
                  className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-colors duration-300 hover:border-[hsl(258_94%_76%_/_0.4)]"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-[hsl(268_84%_55%)]">
                    <Mail className="size-5 text-[#f4efe6]" />
                  </span>
                  <span>
                    <small className="block text-[10px] uppercase tracking-[0.18em] text-[#6f675c]">
                      Email
                    </small>
                    <span className="break-all text-sm text-[#f4efe6]">
                      {profile?.email || "jahid.bubtcse29@gmail.com"}
                    </span>
                  </span>
                </a>

                <div className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                  <span className="grid size-11 place-items-center rounded-xl bg-[hsl(268_84%_55%)]">
                    <MapPin className="size-5 text-[#f4efe6]" />
                  </span>
                  <span>
                    <small className="block text-[10px] uppercase tracking-[0.18em] text-[#6f675c]">
                      Based in
                    </small>
                    <span className="text-sm text-[#f4efe6]">
                      {profile?.location || "Bangladesh"}
                    </span>
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-auto flex items-center gap-3 pt-12 text-xs text-[#8a8174]">
                <span
                  className={
                    "size-2 rounded-full " +
                    (profile?.available_for_work
                      ? "bg-[hsl(258_94%_76%)] shadow-[0_0_12px_hsl(258_94%_76%)]"
                      : "bg-[#6f675c]")
                  }
                />
                {profile?.available_for_work
                  ? "Available for select projects"
                  : "Currently focused on active projects"}
              </div>
            </Reveal>
          </aside>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-8 sm:p-10">
              <header className="mb-8 flex items-center justify-between border-b border-white/[0.06] pb-6">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[hsl(43_70%_60%)]">
                  02 · Project brief
                </span>
                <span className="text-xs text-[#6f675c]">
                  Response within 2 business days
                </span>
              </header>
              <LumeContactForm />
            </div>
          </Reveal>
        </div>
        <OpenStreetMap theme="lume" />
      </section>
    </div>
  );
}
