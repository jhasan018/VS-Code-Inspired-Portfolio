"use client";
import { Skill } from "@/lib/types";
import { useEffect, useState, useRef, useMemo } from "react";

interface Props { skills: Skill[] }

const categoryColors: Record<string, string> = {
  Frontend: "#d3dad9",
  Backend: "#715a5a",
  Tools: "#d3dad9",
  Database: "#715a5a",
  DevOps: "#d3dad9",
  Languages: "#715a5a",
  "Generative AI & LLM Engineering": "#d3dad9",
  "AI · ML · Data Science": "#715a5a",
  "Backend & APIs": "#d3dad9",
};

const colors = ["#d3dad9", "#715a5a"];

export default function SkillsClient({ skills }: Props) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const categories = useMemo(() => {
    const order = ["Frontend", "Backend", "Database", "Tools"];
    const cats = Array.from(new Set(skills.map(s => s.category)));
    
    return cats.sort((a, b) => {
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [skills]);

  return (
    <div ref={ref} className="px-6 py-12 md:px-12 max-w-[95%] mx-auto animate-in fade-in duration-800">
      {/* Top Comment */}
      <div className="text-[var(--vsc-comment)] font-mono text-sm mb-6 opacity-80">
        {"// skills.json – tech stack & tools I actually use"}
      </div>

      {/* Main Title */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[var(--vsc-text-bright)] mb-5 tracking-tighter">
        Technical skills and stack
      </h1>

      {/* Status JSON Header */}
      <div className="font-mono text-sm text-[var(--vsc-text-dim)] mb-14 opacity-70">
        {"{ \"status\": \"always_learning\", \"passion\": \"immeasurable\" }"}
      </div>
      <p className="text-[var(--vsc-text-dim)] max-w-3xl mb-12 leading-relaxed">I build interactive applications with React, Next.js, TypeScript, and GSAP on the frontend, backed by PHP, Laravel, Yii2, MySQL, and WordPress.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-14">
        {categories.map((category, idx) => {
          const catSkills = skills.filter(s => s.category === category);
          const color = categoryColors[category] ?? colors[idx % colors.length];
          
          return (
            <div key={category} className="space-y-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color }}>
                {category}
              </h2>

              <div className="flex flex-col gap-4">
                {catSkills.map(skill => (
                  <div key={skill.id} className="flex items-center gap-5 group">
                    <div className="w-28 md:w-36 text-xs md:text-sm text-[var(--vsc-text-dim)] font-mono flex-shrink-0 group-hover:text-[var(--vsc-text-bright)] transition-colors">
                      {skill.name}
                    </div>
                    
                    <div className="flex-1 h-0.5 bg-white/10 relative rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                          width: animated ? `${skill.proficiency}%` : "0%",
                          background: color,
                          boxShadow: `0 0 10px ${color}66`
                        }} 
                      />
                    </div>

                    <div className="w-10 text-[10px] md:text-xs font-bold font-mono text-right flex-shrink-0" style={{ color }}>
                      {skill.proficiency}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {skills.length === 0 && (
        <div className="text-left py-24 text-[var(--vsc-text-dim)] font-mono text-sm opacity-60">
          // No skills found. Add some from the dashboard.
        </div>
      )}
    </div>
  );
}
