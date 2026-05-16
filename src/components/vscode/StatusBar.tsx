"use client";
import { usePathname } from "next/navigation";

export default function StatusBar() {
  const pathname = usePathname();

  const branch = "main";
  const getLang = () => {
    if (pathname.includes("blog")) return "Markdown";
    return "TypeScript React";
  };

  return (
    <div className="vsc-status-bar flex items-center px-3 h-[22px] bg-[var(--vsc-status)] text-[var(--vsc-status-text)] text-[12px] overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 hover:bg-white/10 px-2 h-full cursor-pointer transition-colors">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1 6.5L8 1l7 5.5V15H1V6.5z" />
          </svg>
          <span className="whitespace-nowrap">⎇ {branch}</span>
        </div>
        
        <div className="hidden sm:flex items-center gap-1.5 hover:bg-white/10 px-2 h-full cursor-pointer transition-colors">
          <span>⚠ 0</span>
        </div>
        
        <div className="hidden sm:flex items-center gap-1.5 hover:bg-white/10 px-2 h-full cursor-pointer transition-colors">
          <span>✗ 0</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4 h-full">
        <div 
          className="flex items-center gap-1.5 hover:bg-white/10 px-2 h-full cursor-pointer transition-colors whitespace-nowrap group"
          onClick={() => {
            const themes = ["dark", "light", "darcula"];
            const current = document.documentElement.dataset.theme || "dark";
            const next = themes[(themes.indexOf(current) + 1) % themes.length];
            document.documentElement.dataset.theme = next;
            localStorage.setItem("vsc-theme", next);
          }}
          title="Cycle Theme"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="opacity-70 group-hover:opacity-100">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 13V2a6 6 0 110 12z" />
          </svg>
          <span className="hidden sm:inline">Theme</span>
        </div>

        <div className="hidden md:flex items-center hover:bg-white/10 px-2 h-full cursor-pointer transition-colors whitespace-nowrap">
          <span>Ln 1, Col 1</span>
        </div>
        
        <div className="hidden sm:flex items-center hover:bg-white/10 px-2 h-full cursor-pointer transition-colors">
          <span>UTF-8</span>
        </div>
        
        <div className="flex items-center hover:bg-white/10 px-2 h-full cursor-pointer transition-colors whitespace-nowrap">
          <span>{getLang()}</span>
        </div>
        
        <div className="flex items-center px-2 h-full">
          <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] md:text-[11px] font-semibold whitespace-nowrap">
            🚀 Available
          </span>
        </div>
      </div>
    </div>
  );
}
