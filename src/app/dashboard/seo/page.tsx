"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GlobeAltIcon, XMarkIcon, PencilSquareIcon, CheckIcon } from "@heroicons/react/24/outline";
import { PageMeta } from "@/lib/types";

export default function SEODashboard() {
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PageMeta | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/seo");
      const data = await res.json();
      setPages(data);
    } catch (e) {
      toast.error("Failed to load SEO data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (res.ok) {
        toast.success(`${editing.page_slug} SEO Updated!`);
        setEditing(null);
        load();
      } else {
        toast.error("Failed to save changes");
      }
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded-md px-4 py-2.5 text-[#d4d4d4] text-sm outline-none focus:border-[#007acc] transition-colors";
  const labelClass = "block text-[10px] text-[#858585] font-mono mb-1 uppercase tracking-wider font-bold";

  return (
    <div className="p-4 md:p-8">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white">Search Engine Optimization</h1>
        <p className="text-sm text-[#858585] mt-1">Manage metadata and social tags for your primary site pages</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-[#858585] font-mono animate-pulse uppercase tracking-widest">
          {"// fetching_meta_records..."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 max-w-5xl">
          {pages.map(page => (
            <div key={page.id} className="bg-[#252526] border border-[#3c3c3c] rounded-xl overflow-hidden group hover:border-[#007acc]/30 transition-colors">
              <div className="p-5 flex items-center justify-between bg-[#1e1e1e]/40 border-b border-[#3c3c3c]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#007acc]/10 flex items-center justify-center border border-[#007acc]/20">
                    <GlobeAltIcon className="w-4 h-4 text-[#007acc]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-tighter">{page.page_slug} Page</h3>
                    <p className="text-[10px] text-[#858585] font-mono">path: /{page.page_slug === 'home' ? '' : page.page_slug}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEditing(editing?.id === page.id ? null : page)}
                  className={`p-2 rounded-lg transition-colors ${editing?.id === page.id ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-[#1e1e1e] text-[#858585] hover:text-white border border-[#3c3c3c]'}`}
                >
                  {editing?.id === page.id ? <XMarkIcon className="w-5 h-5" /> : <PencilSquareIcon className="w-5 h-5" />}
                </button>
              </div>

              {editing?.id === page.id ? (
                <div className="p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Meta Title</label>
                      <input className={inputClass} value={editing.meta_title || ""} onChange={e => setEditing({...editing, meta_title: e.target.value})} />
                    </div>
                    <div>
                      <label className={labelClass}>Canonical URL</label>
                      <input className={inputClass} value={editing.canonical_url || ""} onChange={e => setEditing({...editing, canonical_url: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Meta Description</label>
                    <textarea className={`${inputClass} h-20 resize-none`} value={editing.meta_description || ""} onChange={e => setEditing({...editing, meta_description: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>OG Title (Social)</label>
                      <input className={inputClass} value={editing.og_title || ""} onChange={e => setEditing({...editing, og_title: e.target.value})} />
                    </div>
                    <div>
                      <label className={labelClass}>OG Description</label>
                      <input className={inputClass} value={editing.og_description || ""} onChange={e => setEditing({...editing, og_description: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>OG Image URL</label>
                    <input className={inputClass} value={editing.og_image || ""} onChange={e => setEditing({...editing, og_image: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelClass}>JSON-LD Schema</label>
                    <textarea className={`${inputClass} h-32 font-mono text-[11px]`} placeholder='{ "@context": "https://schema.org", ... }' value={editing.schema_data ? (typeof editing.schema_data === 'string' ? editing.schema_data : JSON.stringify(editing.schema_data, null, 2)) : ""} onChange={e => {
                      try {
                        const json = JSON.parse(e.target.value);
                        setEditing({...editing, schema_data: json});
                      } catch {
                        setEditing({...editing, schema_data: e.target.value as any});
                      }
                    }} />
                  </div>
                  <div className="flex justify-end pt-4">
                    <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2 px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-[#007acc]/20">
                      {saving ? "Saving..." : <><CheckIcon className="w-5 h-5" /> Save Changes</>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 flex flex-wrap gap-x-10 gap-y-4">
                  <div className="flex-1 min-w-[200px]">
                    <span className="text-[10px] text-[#858585] font-mono block mb-1 uppercase tracking-widest font-bold">SEO Title</span>
                    <p className="text-sm text-[#d4d4d4] font-medium line-clamp-1">{page.meta_title || "Not set"}</p>
                  </div>
                  <div className="flex-1 min-w-[300px]">
                    <span className="text-[10px] text-[#858585] font-mono block mb-1 uppercase tracking-widest font-bold">SEO Description</span>
                    <p className="text-sm text-[#858585] line-clamp-1">{page.meta_description || "Not set"}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
