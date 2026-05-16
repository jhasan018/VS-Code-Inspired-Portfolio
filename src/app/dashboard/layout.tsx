"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HomeIcon, FolderIcon, BookOpenIcon, CommandLineIcon,
  EnvelopeIcon, UserIcon, ArrowLeftIcon, ArrowRightStartOnRectangleIcon,
  Bars3Icon, XMarkIcon
} from "@heroicons/react/24/outline";

const navItems = [
  { href: "/dashboard",          label: "Overview",  icon: HomeIcon },
  { href: "/dashboard/profile",  label: "Profile",   icon: UserIcon },
  { href: "/dashboard/projects", label: "Projects",  icon: FolderIcon },
  { href: "/dashboard/blogs",    label: "Blogs",     icon: BookOpenIcon },
  { href: "/dashboard/skills",   label: "Skills",    icon: CommandLineIcon },
  { href: "/dashboard/messages", label: "Messages",  icon: EnvelopeIcon },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/dashboard/login");
    router.refresh();
    toast.success("Logged out");
  };

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (pathname === "/dashboard/login") return <>{children}<Toaster /></>;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#1e1e1e] font-sans overflow-hidden">
      <Toaster position="top-right" toastOptions={{ style: { background: "#252526", color: "#d4d4d4", border: "1px solid #3c3c3c" } }} />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-[#3c3c3c] z-[60] sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#007acc] to-[#4ec9b0] flex items-center justify-center text-lg">⚡</div>
          <span className="font-bold text-white text-sm">Dashboard</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 text-[#858585] hover:text-white transition-colors">
          {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[50] md:hidden backdrop-blur-sm animate-in fade-in" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 w-64 bg-[#252526] border-r border-[#3c3c3c] 
        flex flex-col flex-shrink-0 z-[55] transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        {/* Header (Desktop) */}
        <div className="hidden md:block p-6 border-b border-[#3c3c3c]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#007acc] to-[#4ec9b0] flex items-center justify-center text-xl shadow-lg shadow-[#007acc]/20">⚡</div>
            <div>
              <div className="text-sm font-bold text-white uppercase tracking-tight">Admin Console</div>
              <div className="text-[10px] text-[#858585] uppercase tracking-widest font-mono">Portfolio CMS</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} className="block no-underline">
                <div className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200
                  ${isActive 
                    ? "bg-[#007acc]/10 text-[#007acc] border border-[#007acc]/30 font-semibold" 
                    : "text-[#858585] hover:bg-white/5 border border-transparent"}
                `}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#007acc]' : ''}`} />
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#3c3c3c] space-y-2 bg-[#1e1e1e]/20">
          <Link href="/" className="block no-underline">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#858585] hover:text-white hover:bg-white/5 text-sm transition-all">
              <ArrowLeftIcon className="w-4 h-4" />
              View Live Site
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-500 hover:bg-red-500/10 text-sm transition-all text-left"
          >
            <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#1e1e1e] relative">
        <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
