"use client";
import { About, Profile } from "@/lib/types";

interface Props { about: About | null; profile: Profile | null }

export default function AboutClient({ about, profile }: Props) {
  const timeline = (about?.timeline as any[]) ?? [];
  const education = (about as any)?.education ?? [];

  return (
    <div className="max-w-[90%] mx-auto animate-in fade-in duration-400 space-y-12">
      {/* Breadcrumb comment */}
      <div className="text-[var(--vsc-comment)] font-mono text-xs md:text-sm mb-6 opacity-80">
        <span>// about.tsx</span>
        <br />
        <span>{"// Learn more about me"}</span>
      </div>

      {/* Profile section */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-10 mb-12 items-center text-center md:text-left">
        <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-[var(--vsc-accent)] to-[var(--vsc-green)] flex items-center justify-center flex-shrink-0 border-2 border-[var(--vsc-border)] overflow-hidden shadow-2xl">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl">👨‍💻</span>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--vsc-text-bright)] mb-2 font-syne">
            {profile?.name ?? "Jahid Hasan"}
          </h1>
          <p className="text-[var(--vsc-green)] font-mono text-sm md:text-base mb-4">
            {profile?.title ?? "Full Stack Web Developer"}
          </p>
          <p className="text-[var(--vsc-text)] leading-relaxed text-sm md:text-base">
            {about?.bio ?? profile?.bio ?? "Passionate Full Stack Developer with expertise in modern web technologies."}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
        {[
          { label: "Experience", value: `${about?.experience_years ?? 3}+`, color: "var(--vsc-accent)" },
          { label: "Projects", value: `${about?.projects_count ?? 30}+`, color: "var(--vsc-green)" },
          { label: "Clients", value: `${about?.clients_count ?? 15}+`, color: "var(--vsc-yellow)" },
        ].map(({ label, value, color }) => (
          <div key={label} className="vsc-card p-4 md:p-6 text-center border border-[var(--vsc-border)] rounded-xl bg-[var(--vsc-bg)]">
            <div className="text-2xl md:text-3xl font-extrabold font-mono" style={{ color: `var(${color})` }}>{value}</div>
            <div className="text-[10px] md:text-xs text-[var(--vsc-text-dim)] mt-1 uppercase tracking-widest">{label}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="mb-16">
        <h2 className="text-xl md:text-2xl font-extrabold text-[var(--vsc-text-bright)] mb-6 flex items-center gap-2 font-syne">
          <span className="text-[var(--vsc-keyword)] font-mono">const</span>
          <span className="text-[var(--vsc-fn)] font-mono"> timeline</span>
          <span className="text-[var(--vsc-text-dim)] font-mono"> = [</span>
        </h2>
        <div className="relative pl-6 border-l-2 border-[var(--vsc-border)] space-y-8">
          {timeline.map((item: any, i: number) => (
            <div key={i} className="relative">
              <div className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-[var(--vsc-bg)] ${item.type === "work" ? "bg-[var(--vsc-accent)]" : "bg-[var(--vsc-green)]"}`} />
              <div className="vsc-card p-4 md:p-5 border border-[var(--vsc-border)] rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                  <div>
                    <div className="font-bold text-[var(--vsc-text-bright)] text-sm md:text-base">{item.title}</div>
                    <div className="text-[var(--vsc-accent)] text-xs md:text-sm font-medium">{item.company}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="vsc-tag text-[9px] md:text-[10px] py-0.5 px-2">{item.type}</span>
                    <span className="text-[var(--vsc-text-dim)] text-xs font-mono">{item.year}</span>
                  </div>
                </div>
                <p className="text-[var(--vsc-text-dim)] text-xs md:text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
          {timeline.length === 0 && <div className="text-[var(--vsc-text-dim)] font-mono text-sm pl-4">// No entries.</div>}
        </div>
        <div className="text-[var(--vsc-text-dim)] font-mono text-sm md:text-base mt-2">];</div>
      </div>

      {/* Education */}
      <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-extrabold text-[var(--vsc-text-bright)] mb-6 flex items-center gap-2 font-syne">
          <span className="text-[var(--vsc-keyword)] font-mono">const</span>
          <span className="text-[var(--vsc-fn)] font-mono"> education</span>
          <span className="text-[var(--vsc-text-dim)] font-mono"> = [</span>
        </h2>
        <div className="space-y-5">
          {education.map((edu: any, i: number) => (
            <div key={i} className="vsc-card p-5 border-l-4 border-l-[var(--vsc-green)] border border-[var(--vsc-border)] rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-white text-sm md:text-base">{edu.degree}</div>
                  <div className="text-[var(--vsc-green)] text-sm">{edu.school}</div>
                </div>
                <div className="text-[var(--vsc-text-dim)] text-xs font-mono">{edu.year}</div>
              </div>
              <p className="text-[var(--vsc-text-dim)] text-sm leading-relaxed">{edu.description}</p>
            </div>
          ))}
          {education.length === 0 && <div className="text-[var(--vsc-text-dim)] font-mono text-sm pl-4">// No entries.</div>}
        </div>
        <div className="text-[var(--vsc-text-dim)] font-mono text-sm md:text-base mt-2">];</div>
      </div>
    </div>
  );
}
