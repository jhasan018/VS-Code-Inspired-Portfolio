"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import type { FrontendTheme } from "@/lib/theme";

const themes = [
  { id: "vscode" as const, name: "VS Code", description: "Your original developer workspace theme.", colors: ["#37353e", "#715a5a", "#d3dad9"] },
  { id: "dimension" as const, name: "Digital Dimension", description: "Immersive molten 3D portfolio experience.", colors: ["#08090c", "#ff5a1f", "#f2f1ed"] },
];

export default function ThemeSettings({ initialTheme }: { initialTheme: FrontendTheme }) {
  const [active, setActive] = useState(initialTheme);
  const [saving, setSaving] = useState(false);
  async function selectTheme(theme: FrontendTheme) {
    setSaving(true);
    const response = await fetch("/api/theme", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ theme }) });
    setSaving(false);
    if (!response.ok) return toast.error("Could not switch the frontend theme.");
    setActive(theme);
    toast.success(`${themes.find(item => item.id === theme)?.name} is now live.`);
  }
  return <div>
    <h1 className="text-2xl font-bold text-white mb-2">Frontend theme</h1>
    <p className="text-[#858585] text-sm mb-8">Choose the public experience. Your content and backend stay shared.</p>
    <div className="grid md:grid-cols-2 gap-5">
      {themes.map(theme => <button key={theme.id} disabled={saving} onClick={() => selectTheme(theme.id)} className={`text-left rounded-xl border p-6 transition-all ${active === theme.id ? "border-[#007acc] bg-[#007acc]/10" : "border-[#3c3c3c] bg-[#252526] hover:border-[#666]"}`}>
        <div className="flex gap-2 mb-6">{theme.colors.map(color => <span key={color} className="h-12 flex-1 rounded-md" style={{ background: color }} />)}</div>
        <div className="flex items-center justify-between gap-4"><div><h2 className="text-white font-semibold">{theme.name}</h2><p className="text-[#858585] text-xs mt-1">{theme.description}</p></div>{active === theme.id && <span className="text-[10px] uppercase tracking-widest text-[#4ec9b0]">Live</span>}</div>
      </button>)}
    </div>
  </div>;
}
