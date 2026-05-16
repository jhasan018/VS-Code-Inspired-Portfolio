"use client";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon, ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Blog } from "@/lib/types";
import { uploadImage } from "@/lib/supabase/storage";
import dynamic from "next/dynamic";
import slugify from "slug";

// Dynamically import Tiptap to avoid SSR issues
const TiptapEditor = dynamic(() => import("@/components/dashboard/TiptapEditor"), { ssr: false });

const empty: Partial<Blog> = { 
  title: "", 
  slug: "", 
  excerpt: "", 
  content: "", 
  category: "Technical", 
  tags: [], 
  published: false, 
  cover_image: "" 
};

export default function BlogsDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Blog>>(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const load = async () => { 
    try {
      const r = await fetch("/api/blogs"); 
      const data = await r.json();
      setBlogs(data); 
    } catch (e) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false); 
    }
  };
  
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(empty); setModal(true); };
  const openEdit = (b: Blog) => { setEditing(b); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(empty); };

  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setEditing(prev => ({ ...prev, cover_image: url }));
      toast.success("Thumbnail uploaded!");
    } catch (err) { toast.error("Upload failed"); } finally { setUploading(false); }
  };

  const save = async () => {
    if (!editing.title) return toast.error("Title is required");
    setSaving(true);
    try {
      const slug = editing.slug || slugify(editing.title.toLowerCase());
      const tags = typeof editing.tags === 'string' ? (editing.tags as string).split(',').map(t => t.trim()).filter(t => t !== "") : editing.tags;
      
      const res = await fetch("/api/blogs", {
        method: editing.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editing, slug, tags }),
      });
      if (res.ok) { toast.success("Saved!"); closeModal(); load(); }
      else toast.error("Failed to save");
    } finally { setSaving(false); }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    await fetch("/api/blogs", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  const inputClass = "w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded-md px-4 py-2.5 text-[#d4d4d4] text-sm outline-none focus:border-[#007acc] transition-colors placeholder:opacity-30";
  const labelClass = "block text-[11px] text-[#858585] font-mono mb-2 uppercase tracking-wider";

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-white font-syne">Blog Management</h1>
          <p className="text-sm text-[#858585] mt-1">Write and publish articles for your audience</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-md font-semibold">
          <PlusIcon className="w-5 h-5" /> New Article
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-[#858585] font-mono animate-pulse">
          {"// fetching_articles..."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {blogs.map(b => (
            <div key={b.id} className="bg-[#252526] border border-[#3c3c3c] rounded-xl p-4 flex items-center gap-6 group hover:border-[#007acc]/40 transition-colors">
              <div className="w-16 h-12 rounded-lg bg-[#1e1e1e] overflow-hidden flex-shrink-0 border border-[#3c3c3c]">
                {b.cover_image && <img src={b.cover_image} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">{b.title}</div>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${b.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {b.published ? "Published" : "Draft"}
                  </span>
                  <span className="text-[10px] text-[#858585] uppercase font-mono tracking-widest">{b.category}</span>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(b)} className="p-2 bg-black/40 rounded-lg hover:bg-[#007acc] transition-colors"><PencilIcon className="w-4 h-4 text-white" /></button>
                <button onClick={() => deleteBlog(b.id)} className="p-2 bg-black/40 rounded-lg hover:bg-red-600 transition-colors"><TrashIcon className="w-4 h-4 text-white" /></button>
              </div>
            </div>
          ))}
          {blogs.length === 0 && (
            <div className="py-20 text-center text-[#858585] font-mono border-2 border-dashed border-[#3c3c3c] rounded-xl uppercase tracking-widest">
              {"// No articles found"}
            </div>
          )}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4 animate-in fade-in">
          <div className="bg-[#252526] border border-[#3c3c3c] rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-[#3c3c3c] flex justify-between items-center bg-[#1e1e1e]/40">
              <h2 className="text-xl font-bold text-white">{editing.id ? "Edit Article" : "Write New Article"}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-white/5 rounded-full transition-colors"><XMarkIcon className="w-6 h-6 text-[#858585]" /></button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
              <div className="space-y-8">
                {/* Meta Row */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
                  {/* Thumbnail */}
                  <div>
                    <label className={labelClass}>Article Thumbnail</label>
                    <div className="flex gap-4 items-center">
                      <div className="w-32 h-20 bg-[#1e1e1e] rounded-xl border border-[#3c3c3c] overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {editing.cover_image ? <img src={editing.cover_image} className="w-full h-full object-cover" /> : <PhotoIcon className="w-8 h-8 text-[#3c3c3c]" />}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input type="file" ref={thumbInputRef} onChange={handleThumbUpload} className="hidden" accept="image/*" />
                        <button onClick={() => thumbInputRef.current?.click()} className="btn-ghost w-full py-2 justify-center flex items-center gap-2 rounded-md text-xs" disabled={uploading}>
                          <ArrowUpTrayIcon className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload Cover"}
                        </button>
                        <input className={`${inputClass} !py-1.5 !text-[11px]`} placeholder="Or paste image URL" value={editing.cover_image || ""} onChange={e => setEditing({...editing, cover_image: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Category</label>
                      <select 
                        className={inputClass}
                        value={editing.category}
                        onChange={e => setEditing({...editing, category: e.target.value})}
                      >
                        <option value="Technical">Technical</option>
                        <option value="Career">Career</option>
                        <option value="Design">Design</option>
                        <option value="Personal">Personal</option>
                        <option value="Tutorial">Tutorial</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Tags (comma separated)</label>
                      <input className={inputClass} placeholder="nextjs, tailwind, etc" value={Array.isArray(editing.tags) ? editing.tags.join(', ') : (editing.tags as any || "")} onChange={e => setEditing({...editing, tags: e.target.value as any})} />
                    </div>
                    <div className="col-span-2 flex items-center gap-3 bg-[#1e1e1e] px-4 py-2.5 rounded-lg border border-[#3c3c3c]">
                      <input type="checkbox" id="pub-chk" className="w-4 h-4 accent-[#007acc]" checked={editing.published} onChange={e => setEditing({...editing, published: e.target.checked})} />
                      <label htmlFor="pub-chk" className="text-xs text-[#d4d4d4] cursor-pointer font-medium">Publish this article (make it live)</label>
                    </div>
                  </div>
                </div>

                {/* Title & Slug */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <label className={labelClass}>Article Title</label>
                    <input className={`${inputClass} text-lg font-bold`} placeholder="The Future of Web Development" value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelClass}>Slug</label>
                    <input className={inputClass} placeholder="auto-generated" value={editing.slug || ""} onChange={e => setEditing({...editing, slug: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Excerpt (Short Summary)</label>
                  <textarea className={`${inputClass} h-20 resize-none`} placeholder="A brief overview of what this article is about..." value={editing.excerpt} onChange={e => setEditing({...editing, excerpt: e.target.value})} />
                </div>
                
                <div>
                  <label className={labelClass}>Content (Editor)</label>
                  <div className="border border-[#3c3c3c] rounded-xl overflow-hidden min-h-[400px]">
                    <TiptapEditor 
                      content={editing.content || ""} 
                      onChange={(html) => setEditing(prev => ({ ...prev, content: html }))} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#3c3c3c] bg-[#1e1e1e]/60 flex gap-4">
              <button onClick={save} disabled={saving} className="btn-primary flex-1 py-3 rounded-lg font-bold shadow-lg shadow-[#007acc]/20 transition-all hover:scale-[1.01] active:scale-[0.99]">
                {saving ? "Publishing Changes..." : "Save Article"}
              </button>
              <button onClick={closeModal} className="btn-ghost px-8 rounded-lg">Discard Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
