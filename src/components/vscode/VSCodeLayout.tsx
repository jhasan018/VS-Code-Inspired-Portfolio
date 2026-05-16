"use client";
import ActivityBar from "@/components/vscode/ActivityBar";
import Sidebar from "@/components/vscode/Sidebar";
import TabBar from "@/components/vscode/TabBar";
import StatusBar from "@/components/vscode/StatusBar";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VSCodeLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 991;
      setIsMobile(mobile);
      // Auto-close sidebar on window resize if switching to desktop
      if (!mobile) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on path change (mobile only)
  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [pathname, isMobile]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={`vsc-layout flex flex-col h-screen w-screen overflow-hidden ${isMobile ? 'is-mobile' : ''}`}>
      {/* Title Bar - Elevated z-index and explicit positioning */}
      <div className="vsc-titlebar flex items-center h-[30px] md:h-[22px] bg-[#3c3c3c] text-[#cccccc] text-[12px] flex-shrink-0 z-[100] relative">
        {isMobile && (
          <button 
            onClick={toggleSidebar}
            className="p-2 ml-1 text-[#858585] hover:text-white transition-colors flex items-center justify-center"
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </button>
        )}
        <div className="flex-1 text-center font-medium opacity-70 truncate px-4">
          portfolio — Jahid Hasan — VS Code
        </div>
        {/* Placeholder for symmetry on mobile */}
        {isMobile && <div className="w-10" />}
      </div>

      {/* Main area */}
      <div className="vsc-main flex flex-1 overflow-hidden relative">
        {/* Sidebar Container */}
        <div 
          className={`
            fixed md:relative inset-y-0 left-0 flex z-[90] h-full transition-transform duration-300 ease-in-out bg-[var(--vsc-bg)]
            ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
            ${isMobile ? 'w-[280px]' : ''}
          `}
        >
          <ActivityBar />
          <Sidebar onSelect={() => isMobile && setIsSidebarOpen(false)} />
        </div>
        
        {/* Mobile Overlay */}
        {isMobile && isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-[80] backdrop-blur-sm animate-in fade-in duration-200"
          />
        )}

        {/* Editor Area */}
        <div className="vsc-editor-area flex flex-1 flex-col overflow-hidden min-w-0 bg-[var(--vsc-bg)]">
          <TabBar />
          <div className="vsc-editor flex-1 overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </div>
      </div>

      <StatusBar />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--vsc-scrollbar);
          border: 2px solid var(--vsc-bg);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5a5a5a;
        }
        
        @media (max-width: 991px) {
          .vsc-editor {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
