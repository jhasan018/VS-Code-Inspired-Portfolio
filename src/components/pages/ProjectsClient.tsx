"use client";
import { Project } from "@/lib/types";
import { PhotoIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

interface Props { projects: Project[] }

export default function ProjectsClient({ projects }: Props) {
  return (
    <div className="max-w-[95%] mx-auto animate-in fade-in duration-500">
      <div className="text-[var(--vsc-comment)] font-mono text-xs md:text-sm mb-6">
        <span>// projects.tsx — My work & contributions</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--vsc-text-bright)] mb-12 font-syne">
        <span className="text-[var(--vsc-keyword)] font-mono">export</span>
        {" "}Projects
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project.id} className="vsc-card group flex flex-col border border-[var(--vsc-border)] rounded-xl overflow-hidden hover:border-[var(--vsc-accent)]/50 transition-colors bg-[var(--vsc-bg)]">
            {/* Project Thumbnail */}
            <div className="relative h-44 md:h-48 bg-[#1e1e1e] overflow-hidden">
              {project.cover_image ? (
                <img 
                  src={project.cover_image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
              ) : (
                <div className="h-full flex items-center justify-center text-[#3c3c3c]">
                  <PhotoIcon className="w-16" />
                </div>
              )}
              {project.featured && (
                <div className="absolute top-3 right-3 bg-[rgba(220,220,170,0.9)] text-[#1e1e1e] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
                  FEATURED
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-extrabold text-[var(--vsc-text-bright)] mb-2 font-syne group-hover:text-[var(--vsc-accent)] transition-colors">
                {project.title}
              </h3>
              <p className="text-xs md:text-sm text-[var(--vsc-text-dim)] leading-relaxed mb-5 flex-1">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mb-5">
                {(project.tech_stack ?? []).map(tech => (
                  <span key={tech} className="vsc-tag text-[9px] md:text-[10px] font-mono">{tech}</span>
                ))}
              </div>

              <div className="flex gap-3">
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener" className="btn-ghost text-xs px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors">
                    Source
                  </a>
                )}
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener" className="btn-primary text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-lg shadow-[var(--vsc-accent)]/20">
                    <GlobeAltIcon className="w-3.5 h-3.5" /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20 text-[var(--vsc-text-dim)] font-mono text-sm opacity-60 italic">
          // No projects found. Coming soon!
        </div>
      )}
    </div>
  );
}
