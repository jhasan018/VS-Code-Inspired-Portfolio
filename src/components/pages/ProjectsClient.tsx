"use client";
import { Project } from "@/lib/types";
import { PhotoIcon, GlobeAltIcon, XMarkIcon, BuildingOffice2Icon, CodeBracketIcon, UserGroupIcon, BriefcaseIcon, SparklesIcon } from "@heroicons/react/24/outline";
import SafeImage from "@/components/ui/SafeImage";
import { useState, useMemo } from "react";

interface Props { projects: Project[] }
type ProjectType = Project["project_type"];

export default function ProjectsClient({ projects }: Props) {
  const [activeType, setActiveType] = useState<ProjectType>("company");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const companyName = "Dcastalia";

  const typedProjects = useMemo(() => {
    return projects.map(project => ({
      ...project,
      project_type: project.project_type || "company",
    }));
  }, [projects]);

  const currentProjects = useMemo(() => {
    return typedProjects.filter(project => project.project_type === activeType);
  }, [typedProjects, activeType]);

  const categories = useMemo(() => {
    const cats = new Set(currentProjects.map(p => p.category || "General"));
    return ["All", ...Array.from(cats)].sort();
  }, [currentProjects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return currentProjects;
    return currentProjects.filter(p => (p.category || "General") === activeCategory);
  }, [currentProjects, activeCategory]);

  const projectTypes: Array<{ label: string; value: ProjectType; count: number; icon: typeof BriefcaseIcon }> = [
    { label: "Company Projects", value: "company", count: typedProjects.filter(project => project.project_type === "company").length, icon: BriefcaseIcon },
    { label: "Client / Freelance", value: "client", count: typedProjects.filter(project => project.project_type === "client").length, icon: UserGroupIcon },
    { label: "Personal Projects", value: "personal", count: typedProjects.filter(project => project.project_type === "personal").length, icon: SparklesIcon },
  ];

  const activeTypeLabel = activeType === "company" ? "Company Projects" : activeType === "client" ? "Client / Freelance Projects" : "Personal Projects";

  return (
    <div className="max-w-[95%] md:max-w-[90%] mx-auto animate-in fade-in duration-500 pb-20">
      <div className="text-[var(--vsc-comment)] font-mono text-xs md:text-sm mb-6">
        <span>{"// projects.tsx - Professional delivery work"}</span>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-8">
        <div className="flex-1 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--vsc-text-bright)] mb-4 tracking-tighter">
            <span className="text-[var(--vsc-keyword)] font-mono text-3xl md:text-4xl">export</span>
            {" "}Client Delivery
          </h1>
          <p className="text-[var(--vsc-text-dim)] text-base md:text-lg max-w-2xl opacity-90 leading-relaxed font-sans">
            A clear split between company-led client work from my role at {companyName} and independent builds I create personally.
          </p>
        </div>
      </div>

      <div className="border border-[var(--vsc-border)] bg-[var(--vsc-bg-alt)]/40 rounded-lg overflow-hidden mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[var(--vsc-border)]">
          {projectTypes.map(({ label, value, count, icon: Icon }) => {
            const isActive = activeType === value;

            return (
              <button
                key={value}
                onClick={() => {
                  setActiveType(value);
                  setActiveCategory("All");
                }}
                className={`
                  min-h-16 px-5 py-4 text-left flex items-center justify-between gap-4 transition-colors cursor-pointer border-b-2
                  ${isActive
                    ? "bg-[var(--vsc-selected)] text-[var(--vsc-text-bright)] border-[var(--vsc-accent)]"
                    : "bg-[var(--vsc-bg-alt)] text-[var(--vsc-text-dim)] border-transparent opacity-70 hover:opacity-100 hover:text-[var(--vsc-text)] hover:bg-[var(--vsc-hover)]"}
                `}
              >
                <span className="inline-flex items-center gap-3 min-w-0">
                  <span className={`w-9 h-9 rounded-md border flex items-center justify-center shrink-0 ${isActive ? "border-[var(--vsc-accent)] bg-[var(--vsc-accent)]/20 text-[var(--vsc-accent)]" : "border-[var(--vsc-border)] text-[var(--vsc-text-dim)]"}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold truncate">{label}</span>
                    <span className={`block text-[10px] font-mono mt-0.5 ${isActive ? "text-[var(--vsc-accent)]" : "text-[var(--vsc-comment)]"}`}>
                      {isActive ? "Active" : "Inactive"} / {count} item{count === 1 ? "" : "s"}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--vsc-border)] border-t border-[var(--vsc-border)]">
          {activeType === "company" ? (
            <>
              <div className="bg-[var(--vsc-bg-alt)]/60 px-4 py-3 flex items-center gap-3">
                <BuildingOffice2Icon className="w-4 h-4 text-[var(--vsc-accent)] shrink-0" />
                <div>
                  <div className="text-[9px] uppercase tracking-widest font-mono text-[var(--vsc-comment)]">Project Owner</div>
                  <div className="text-sm font-semibold text-[var(--vsc-text-bright)] leading-tight">{companyName} / Client Work</div>
                </div>
              </div>
              <div className="bg-[var(--vsc-bg-alt)]/60 px-4 py-3 flex items-center gap-3">
                <CodeBracketIcon className="w-4 h-4 text-[var(--vsc-accent)] shrink-0" />
                <div>
                  <div className="text-[9px] uppercase tracking-widest font-mono text-[var(--vsc-comment)]">My Role</div>
                  <div className="text-sm font-semibold text-[var(--vsc-text-bright)] leading-tight">Development Contributor</div>
                </div>
              </div>
              <div className="bg-[var(--vsc-bg-alt)]/60 px-4 py-3 flex items-center gap-3">
                <UserGroupIcon className="w-4 h-4 text-[var(--vsc-accent)] shrink-0" />
                <div>
                  <div className="text-[9px] uppercase tracking-widest font-mono text-[var(--vsc-comment)]">Context</div>
                  <div className="text-sm font-semibold text-[var(--vsc-text-bright)] leading-tight">Built within a company team</div>
                </div>
              </div>
            </>
          ) : activeType === "client" ? (
            <>
              <div className="bg-[var(--vsc-bg-alt)]/60 px-4 py-3 flex items-center gap-3">
                <UserGroupIcon className="w-4 h-4 text-[var(--vsc-accent)] shrink-0" />
                <div><div className="text-[9px] uppercase tracking-widest font-mono text-[var(--vsc-comment)]">Project Owner</div><div className="text-sm font-semibold text-[var(--vsc-text-bright)] leading-tight">Direct Client</div></div>
              </div>
              <div className="bg-[var(--vsc-bg-alt)]/60 px-4 py-3 flex items-center gap-3">
                <CodeBracketIcon className="w-4 h-4 text-[var(--vsc-accent)] shrink-0" />
                <div><div className="text-[9px] uppercase tracking-widest font-mono text-[var(--vsc-comment)]">My Role</div><div className="text-sm font-semibold text-[var(--vsc-text-bright)] leading-tight">Freelance Delivery</div></div>
              </div>
              <div className="bg-[var(--vsc-bg-alt)]/60 px-4 py-3 flex items-center gap-3">
                <BriefcaseIcon className="w-4 h-4 text-[var(--vsc-accent)] shrink-0" />
                <div><div className="text-[9px] uppercase tracking-widest font-mono text-[var(--vsc-comment)]">Context</div><div className="text-sm font-semibold text-[var(--vsc-text-bright)] leading-tight">Independent client engagement</div></div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-[var(--vsc-bg-alt)]/60 px-4 py-3 flex items-center gap-3">
                <SparklesIcon className="w-4 h-4 text-[var(--vsc-accent)] shrink-0" />
                <div>
                  <div className="text-[9px] uppercase tracking-widest font-mono text-[var(--vsc-comment)]">Project Owner</div>
                  <div className="text-sm font-semibold text-[var(--vsc-text-bright)] leading-tight">Jahid Hasan</div>
                </div>
              </div>
              <div className="bg-[var(--vsc-bg-alt)]/60 px-4 py-3 flex items-center gap-3">
                <CodeBracketIcon className="w-4 h-4 text-[var(--vsc-accent)] shrink-0" />
                <div>
                  <div className="text-[9px] uppercase tracking-widest font-mono text-[var(--vsc-comment)]">My Role</div>
                  <div className="text-sm font-semibold text-[var(--vsc-text-bright)] leading-tight">Product and Development</div>
                </div>
              </div>
              <div className="bg-[var(--vsc-bg-alt)]/60 px-4 py-3 flex items-center gap-3">
                <UserGroupIcon className="w-4 h-4 text-[var(--vsc-accent)] shrink-0" />
                <div>
                  <div className="text-[9px] uppercase tracking-widest font-mono text-[var(--vsc-comment)]">Context</div>
                  <div className="text-sm font-semibold text-[var(--vsc-text-bright)] leading-tight">Independent build</div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-4 py-4 flex flex-col md:flex-row md:items-center gap-3">
          <div className="text-[10px] uppercase tracking-widest font-mono text-[var(--vsc-comment)] md:w-28 shrink-0">
            Sector
          </div>
          <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-3 py-1.5 rounded-md text-xs font-medium font-mono transition-colors border cursor-pointer
                ${activeCategory === cat
                  ? "bg-[var(--vsc-selected)] border-[var(--vsc-accent)] text-[var(--vsc-text-bright)]"
                  : "bg-transparent border-[var(--vsc-border)] text-[var(--vsc-text-dim)] hover:bg-white/5 hover:text-[var(--vsc-text)]"}
              `}
            >
              {cat}
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* Active Filter Display */}
      {activeCategory !== "All" && (
        <div className="flex items-center gap-3 mb-8 text-xs font-mono text-[var(--vsc-text-dim)] animate-in slide-in-from-left duration-300">
          <span>Showing {filteredProjects.length} {activeCategory} items in {activeTypeLabel}</span>
          <div className="h-3 w-[1px] bg-[var(--vsc-border)]" />
          <button
            onClick={() => setActiveCategory("All")}
            className="text-[var(--vsc-accent)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <XMarkIcon className="w-3 h-3" /> Clear filter
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8">
        {filteredProjects.map((project) => (
          <div key={project.id} className="vsc-card !p-0 group flex flex-col border border-[var(--vsc-border)] rounded-lg overflow-hidden hover:border-[var(--vsc-accent)]/50 transition-all duration-300 bg-[var(--vsc-bg-alt)]/30">
            <div className="relative aspect-[16/9] bg-[var(--vsc-bg)] overflow-hidden">
              {project.cover_image ? (
                <SafeImage
                  src={project.cover_image}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1536px) 30vw, (min-width: 1024px) 45vw, 90vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-[var(--vsc-text-dim)]">
                  <PhotoIcon className="w-10" />
                </div>
              )}

              <div className="absolute top-4 left-4 bg-[var(--vsc-bg)]/85 backdrop-blur-md border border-white/10 text-[var(--vsc-accent)] px-3 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase">
                {project.category || "General"}
              </div>

              {project.featured && (
                <div className="absolute top-4 right-4 bg-[var(--vsc-text-bright)] text-[var(--vsc-bg)] px-3 py-1 rounded-md text-[9px] font-black tracking-widest">
                  SELECTED
                </div>
              )}
            </div>

            <div className="p-5 md:p-6 flex-1 flex flex-col text-left">
              <div className="flex items-center gap-2 mb-4 text-[10px] font-mono text-[var(--vsc-text-dim)]">
                {project.project_type === "personal" ? (
                  <SparklesIcon className="w-3.5 h-3.5 text-[var(--vsc-accent)]" />
                ) : project.project_type === "client" ? (
                  <UserGroupIcon className="w-3.5 h-3.5 text-[var(--vsc-accent)]" />
                ) : (
                  <BuildingOffice2Icon className="w-3.5 h-3.5 text-[var(--vsc-accent)]" />
                )}
                <span>{project.project_type === "personal" ? "Personal project" : project.project_type === "client" ? "Client / freelance project" : `${companyName} project`}</span>
                <span className="text-[var(--vsc-border)]">/</span>
                <span>Development</span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-[var(--vsc-text-bright)] mb-3 font-jakarta group-hover:text-[var(--vsc-accent)] transition-colors tracking-tight leading-snug">
                {project.title}
              </h3>
              <p className="text-sm text-[var(--vsc-text-dim)] leading-relaxed mb-6 flex-1 opacity-80 group-hover:opacity-100 transition-opacity">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {(project.tech_stack ?? []).map(tech => (
                  <span key={tech} className="vsc-tag text-[9px] md:text-[10px] font-mono py-1 px-2.5 bg-white/[0.03] hover:bg-[var(--vsc-accent)]/10 transition-colors">#{tech}</span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener" className="btn-primary flex-1 text-xs px-4 py-3 rounded-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer">
                    <GlobeAltIcon className="w-4 h-4" /> View Live Project
                  </a>
                )}
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener" className="btn-ghost flex-1 text-xs px-4 py-3 rounded-md hover:bg-white/5 transition-all text-center flex items-center justify-center gap-2 cursor-pointer border border-white/5">
                    Related Reference
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-start justify-center py-32 text-left animate-in zoom-in duration-300">
          <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center mb-6 border border-dashed border-[var(--vsc-border)]">
            <PhotoIcon className="w-8 h-8 text-[var(--vsc-text-dim)] opacity-30" />
          </div>
          <div className="text-[var(--vsc-text-bright)] font-bold text-xl mb-2">No projects found</div>
          <p className="text-[var(--vsc-text-dim)] font-mono text-sm max-w-sm mb-8 opacity-60">
            {`// No ${activeTypeLabel.toLowerCase()} matched the "${activeCategory}" filter.`}
          </p>
          <button
            onClick={() => setActiveCategory("All")}
            className="btn-primary px-8 py-3 rounded-xl font-bold cursor-pointer"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
}
