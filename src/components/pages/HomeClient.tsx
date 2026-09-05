"use client";
import { Profile, About } from "@/lib/types";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

interface Props {
  profile: Profile | null;
  about: About | null;
}

export default function HomeClient({ profile, about }: Props) {
  const [typed, setTyped] = useState(0);

  // Dynamically generate code lines based on profile data
  const codeLines = useMemo(() => {
    const name = profile?.name ?? "Jahid Hasan";
    const role = profile?.title ?? "Interactive Web Developer";
    const location = profile?.location ?? "Bangladesh 🇧🇩";

    return [
      { n: 1, tokens: [{ t: "comment", v: "// Welcome to my portfolio" }] },
      { n: 2, tokens: [] },
      { n: 3, tokens: [{ t: "keyword", v: "const" }, { t: "plain", v: " developer " }, { t: "plain", v: "= {" }] },
      { n: 4, tokens: [{ t: "plain", v: "  name: " }, { t: "string", v: `"${name}"` }, { t: "plain", v: "," }] },
      { n: 5, tokens: [{ t: "plain", v: "  role: " }, { t: "string", v: `"${role}"` }, { t: "plain", v: "," }] },
      { n: 6, tokens: [{ t: "plain", v: "  location: " }, { t: "string", v: `"${location}"` }, { t: "plain", v: "," }] },
      { n: 7, tokens: [{ t: "plain", v: "  available: " }, { t: "number", v: profile?.available_for_work ? "true" : "false" }, { t: "plain", v: "," }] },
      { n: 8, tokens: [{ t: "plain", v: "};" }] },
      { n: 9, tokens: [] },
      { n: 10, tokens: [{ t: "keyword", v: "function" }, { t: "fn", v: " hire" }, { t: "plain", v: "(dev) {" }] },
      { n: 11, tokens: [{ t: "plain", v: "  " }, { t: "keyword", v: "return" }, { t: "plain", v: " dev." }, { t: "fn", v: "buildAmazingThings" }, { t: "plain", v: "();" }] },
      { n: 12, tokens: [{ t: "plain", v: "}" }] },
    ];
  }, [profile]);

  useEffect(() => {
    if (typed < codeLines.length) {
      const t = setTimeout(() => setTyped(p => p + 1), 60);
      return () => clearTimeout(t);
    }
  }, [typed, codeLines.length]);

  const name = profile?.name ?? "Jahid Hasan";

  const stats = [
    { label: "Experience", value: `${about?.experience_years ?? 3}+ Years`, color: "var(--vsc-accent)", sub: "Production Level" },
    { label: "Projects", value: `${about?.projects_count ?? 30}+`, color: "var(--vsc-green)", sub: "Completed & Live" },
    { label: "Satisfied Clients", value: `${about?.clients_count ?? 15}+`, color: "var(--vsc-purple)", sub: "Global Reach" },
  ];

  return (
    <div className="relative min-h-full w-full animate-in fade-in duration-600 bg-transparent">
      {/* Hero Background Image (Hidden on Mobile) */}
      <div
        className="absolute top-0 right-0 w-[60%] h-full bg-cover bg-center z-0 grayscale-[20%] contrast-[1.2] brightness-[0.7] pointer-events-none hidden lg:block"
        style={{
          backgroundImage: 'url("/myself.jpg")',
          maskImage: "linear-gradient(to left, black 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to left, black 40%, transparent 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[var(--vsc-bg)] opacity-40 mix-blend-multiply" />
      </div>

      <div className="max-w-[95%] mx-auto relative z-10">
        {/* Hero Section */}
        <div className="mb-16 lg:mb-24 text-left">
          <div className="inline-flex items-center gap-3 mb-6 lg:mb-8 px-3 py-1 bg-[rgba(106,153,85,0.1)] border border-[rgba(106,153,85,0.2)] rounded-full">
            <span className="text-[var(--vsc-comment)] font-mono text-[10px] sm:text-xs md:text-sm">
              // available_for_work = {profile?.available_for_work ? "true" : "false"}
            </span>
            <div className={`w-2 h-2 rounded-full ${profile?.available_for_work ? 'bg-[#4ec9b0] shadow-[0_0_10px_#4ec9b0]' : 'bg-red-500 shadow-[0_0_10px_red]'}`} />
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[var(--vsc-text-bright)] leading-[1.1] mb-6 tracking-tighter">
            Interactive websites<br />
            <span className="bg-gradient-to-br from-[var(--vsc-accent)] to-[var(--vsc-green)] bg-clip-text text-transparent">that move.</span>
          </h1>

          <div className="text-lg md:text-xl lg:text-2xl text-[var(--vsc-text)] font-mono mb-8 flex flex-wrap items-center justify-start gap-2 sm:gap-3">
            <span className="text-[var(--vsc-keyword)]">const</span>
            <span className="text-[var(--vsc-fn)]">developer</span>
            <span className="text-[var(--vsc-text-dim)]">=</span>
            <span className="text-[var(--vsc-string)] truncate max-w-[200px] sm:max-w-none">&quot;{name}&quot;</span>
          </div>

          <p className="text-[var(--vsc-text-dim)] text-sm sm:text-base md:text-lg max-w-[600px] leading-relaxed mb-10 font-sans mx-auto lg:mx-0 px-0 lg:px-0">
            I design and develop animated, fast, and scalable web experiences using React, Next.js, and GSAP — from first line of code to production launch.
          </p>

          <div className="flex flex-wrap gap-4 justify-start">
            <Link href="/projects" prefetch={true} className="btn-primary flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 text-sm sm:text-base font-semibold">
              <ArrowTopRightOnSquareIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              Explore My Work
            </Link>
            <Link href="/contact" prefetch={true} className="btn-ghost px-6 py-2.5 sm:px-7 sm:py-3 text-sm sm:text-base font-semibold bg-white/5">
              Contact Me
            </Link>
          </div>
        </div>

        {/* Editor & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-start pb-[40px]">
          {/* Editor Area */}
          <div className="glass-card rounded-xl h-full overflow-hidden border border-[var(--vsc-border)] ">
            <div className=" px-5 py-2.5 flex items-center justify-between border-b border-[var(--vsc-border)]">
              <div className="flex gap-2">
                {["#ff5f57", "#febc2e", "#28c840"].map(c => (
                  <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <span className="text-[10px] text-[var(--vsc-text-dim)] font-mono uppercase tracking-tighter opacity-50">
                {profile?.name?.toLowerCase().replace(/\s/g, '_') || "jahid_hasan"}.ts — portfolio
              </span>
            </div>
            <div className="home-code-body py-6 overflow-x-auto custom-scrollbar">
              {codeLines.slice(0, typed).map(({ n, tokens }) => (
                <div key={n} className="code-line whitespace-nowrap min-w-max">
                  <span className="line-number">{n}</span>
                  <span className="text-[11px] sm:text-sm">
                    {tokens.map((tk, i) => (
                      <span key={i} className={`token-${tk.t}`}>{tk.v}</span>
                    ))}
                    {n === typed && <span className="cursor-blink" />}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Column */}
          <div className="flex flex-col gap-6 w-full">
            {stats.map(({ label, value, color, sub }) => (
              <div key={label} className="glass-card p-6 rounded-xl border border-[var(--vsc-border)] hover:border-[var(--vsc-accent)]/30 transition-colors">
                <div className="text-[10px] md:text-xs text-[var(--vsc-text-dim)] uppercase tracking-widest mb-2 font-mono ">
                  {label}
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-mono mb-1" style={{ color }}>
                  {value}
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-[var(--vsc-text-dim)] opacity-70">
                  {sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
