"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight, MapPin } from "lucide-react";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-screen place-items-center bg-[#eef1eb] text-sm font-medium text-slate-600">
      ইন্টার‌্যাক্টিভ মানচিত্র লোড হচ্ছে…
    </div>
  ),
});

type MapTheme = "vscode" | "dimension" | "lume" | "solace";

const mapUrl =
  "https://www.openstreetmap.org/?mlat=23.81793&mlon=90.37214#map=16/23.81793/90.37214";

const themes: Record<
  MapTheme,
  { section: string; eyebrow: string; title: string; copy: string; frame: string; link: string }
> = {
  vscode: {
    section: "mt-14 overflow-hidden rounded-xl border border-[var(--vsc-border)] bg-white/[0.02]",
    eyebrow: "text-[var(--vsc-comment)]",
    title: "text-[var(--vsc-text-bright)]",
    copy: "text-[var(--vsc-text-dim)]",
    frame: "border-[var(--vsc-border)]",
    link: "text-[var(--vsc-accent)] focus-visible:outline-[var(--vsc-accent)]",
  },
  dimension: {
    section: "mt-12 overflow-hidden rounded-[1.5rem] border border-black/10 bg-white/40",
    eyebrow: "text-black/50",
    title: "text-[#171512]",
    copy: "text-black/60",
    frame: "border-black/10",
    link: "text-[#171512] focus-visible:outline-[#171512]",
  },
  lume: {
    section: "mt-12 overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02]",
    eyebrow: "text-[hsl(43_70%_60%)]",
    title: "text-[#f4efe6]",
    copy: "text-[#8a8174]",
    frame: "border-white/[0.07]",
    link: "text-[hsl(258_94%_84%)] focus-visible:outline-[hsl(258_94%_76%)]",
  },
  solace: {
    section: "mt-16 overflow-hidden rounded-xl border border-[var(--sol-line)] bg-[var(--sol-tint)]",
    eyebrow: "text-[var(--sol-accent-deep)]",
    title: "text-[var(--sol-ink)]",
    copy: "text-[var(--sol-muted)]",
    frame: "border-[var(--sol-line)]",
    link: "text-[var(--sol-accent-deep)] focus-visible:outline-[var(--sol-accent)]",
  },
};

export default function OpenStreetMap({ theme = "vscode" }: { theme?: MapTheme }) {
  const styles = themes[theme];

  return (
    <section className={styles.section} aria-labelledby={`map-title-${theme}`}>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
        <div>
          <p className={`mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] ${styles.eyebrow}`}>
            <MapPin className="size-3.5" aria-hidden="true" />
            অবস্থান
          </p>
          <h2 id={`map-title-${theme}`} className={`text-xl font-semibold sm:text-2xl ${styles.title}`}>
            মিরপুর সেকশন ১১, ঢাকা ১২১৬
          </h2>
          <p className={`mt-2 text-sm ${styles.copy}`}>ঢাকার মিরপুরের প্রাণকেন্দ্রে অবস্থিত।</p>
        </div>
        <a
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex min-h-11 w-fit items-center gap-2 rounded-md text-sm font-semibold underline decoration-current/30 underline-offset-4 transition-opacity duration-200 hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 ${styles.link}`}
        >
          ওপেনস্ট্রিটম্যাপে দেখুন
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </div>
      <div className={`border-t ${styles.frame}`}>
        <LeafletMap />
      </div>
    </section>
  );
}
