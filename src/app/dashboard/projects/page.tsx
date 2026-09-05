"use client";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, PhotoIcon, ArrowUpTrayIcon, GlobeAltIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import { Project, Category } from "@/lib/types";
import { uploadImage } from "@/lib/supabase/storage";
import slugify from "slug";

const empty: Partial<Project> = {
  title: "", slug: "", description: "", long_description: "",
  tech_stack: [], github_url: "", live_url: "", featured: false,
  project_type: "company", status: "completed", order_index: 0, cover_image: "",
  image_alt: "", role_label: "", seo_description: ""
};

type SortOption = "title-asc" | "title-desc" | "date-newest" | "date-oldest" | "order" | "status";

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Project>>(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("date-newest");
  const [orderModal, setOrderModal] = useState(false);
  const [orderProjects, setOrderProjects] = useState<Project[]>([]);
  const [draggedProject, setDraggedProject] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const res = await fetch("/api/projects");
    setProjects(await res.json());

    const catRes = await fetch("/api/categories?type=project");
    setCategories(await catRes.json());

    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(empty); setTechInput(""); setModal(true); };
  const openEdit = (p: Project) => { 
    setEditing({ ...p, project_type: p.project_type || "company" });
    setTechInput(p.tech_stack?.join(", ") || "");
    setModal(true); 
  };
  const closeModal = () => { setModal(false); setEditing(empty); setTechInput(""); };

  const openOrderModal = () => {
    const sorted = [...projects].sort((a, b) => a.order_index - b.order_index);
    setOrderProjects(sorted);
    setOrderModal(true);
  };

  const closeOrderModal = () => { setOrderModal(false); setOrderProjects([]); };

  const handleDragStart = (projectId: string) => {
    setDraggedProject(projectId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (targetId: string) => {
    if (!draggedProject || draggedProject === targetId) return;

    const draggedIndex = orderProjects.findIndex(p => p.id === draggedProject);
    const targetIndex = orderProjects.findIndex(p => p.id === targetId);

    const newOrder = [...orderProjects];
    [newOrder[draggedIndex], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[draggedIndex]];

    setOrderProjects(newOrder);
    setDraggedProject(null);
  };

  const updateOrderIndexes = async () => {
    try {
      for (let i = 0; i < orderProjects.length; i++) {
        await fetch("/api/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: orderProjects[i].id, order_index: i }),
        });
      }
      toast.success("Project order updated!");
      load();
      closeOrderModal();
    } catch (err) {
      toast.error("Failed to update order");
      console.error(err);
    }
  };

  const updateOrderIndex = (projectId: string, newIndex: number) => {
    setOrderProjects(orderProjects.map(p =>
      p.id === projectId ? { ...p, order_index: newIndex } : p
    ));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setEditing(prev => ({ ...prev, cover_image: url }));
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error("Upload failed. Make sure Supabase Storage is set up.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!editing.title || !editing.slug) return toast.error("Title and Slug are required");
    setSaving(true);
    
    // Parse tech stack input
    const finalTech = techInput.split(",").map(s => s.trim()).filter(s => s !== "");
    const finalData = { ...editing, tech_stack: finalTech };

    try {
      const res = await fetch("/api/projects", {
        method: editing.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      if (res.ok) { toast.success("Saved!"); closeModal(); load(); }
      else toast.error("Failed to save");
    } finally { setSaving(false); }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch("/api/projects", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  const getSortedProjects = (items: Project[]): Project[] => {
    const sorted = [...items];
    switch (sortBy) {
      case "title-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case "date-newest":
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case "date-oldest":
        return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case "order":
        return sorted.sort((a, b) => a.order_index - b.order_index);
      case "status":
        return sorted.sort((a, b) => a.status.localeCompare(b.status));
      default:
        return sorted;
    }
  };

  const sortedProjects = getSortedProjects(projects);

  const inputClass = "w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded-md px-4 py-2.5 text-[#d4d4d4] text-sm outline-none focus:border-[#007acc] transition-colors";
  const labelClass = "block text-[11px] text-[#858585] font-mono mb-2 uppercase tracking-wider";

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects Gallery</h1>
          <p className="text-sm text-[#858585] mt-1">Showcase your best work with detailed metadata</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={openOrderModal}
            className="btn-ghost flex items-center gap-2 px-4 py-2.5 rounded-md font-semibold border border-[#3c3c3c] text-[#d4d4d4] whitespace-nowrap"
          >
            <ArrowUpTrayIcon className="w-4 h-4" /> Manage Order
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-[#252526] text-sm text-[#d4d4d4] border border-[#3c3c3c] rounded-md px-4 py-2.5 outline-none focus:border-[#007acc] transition-colors"
          >
            <option value="date-newest">Newest First</option>
            <option value="date-oldest">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="order">Manual Order</option>
            <option value="status">By Status</option>
          </select>
          <button onClick={openNew} className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-md font-semibold whitespace-nowrap">
            <PlusIcon className="w-5 h-5" /> Add Project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-[#858585] font-mono animate-pulse">
          {"// loading_projects..."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map(p => (
            <div key={p.id} className="bg-[#252526] border border-[#3c3c3c] rounded-xl overflow-hidden group hover:border-[#007acc]/40 transition-colors flex flex-col">
              <div className="relative h-48 bg-[#1e1e1e] overflow-hidden">
                {p.cover_image ? (
                  <img src={p.cover_image} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt={p.title} />
                ) : (
                  <div className="h-full flex items-center justify-center text-[#3c3c3c]">
                    <PhotoIcon className="w-12 h-12" />
                  </div>
                )}
                {p.featured && (
                  <div className="absolute top-4 left-4 bg-yellow-500/90 text-black px-2 py-0.5 rounded text-[10px] font-bold">FEATURED</div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  {(p.project_type || "company") === "client" ? "Client / Freelance" : (p.project_type || "company") === "personal" ? "Personal" : "Company"}
                </div>
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(p)} className="p-2 bg-black/60 rounded-lg hover:bg-[#007acc] transition-colors"><PencilIcon className="w-4 h-4 text-white" /></button>
                  <button onClick={() => deleteProject(p.id)} className="p-2 bg-black/60 rounded-lg hover:bg-red-600 transition-colors"><TrashIcon className="w-4 h-4 text-white" /></button>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-white mb-2">{p.title}</h3>
                <p className="text-xs text-[#858585] line-clamp-2 mb-4 flex-1">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {(p.tech_stack ?? []).slice(0, 3).map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 bg-[#1e1e1e] border border-[#3c3c3c] text-[#858585] rounded">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 animate-in fade-in">
          <div className="bg-[#252526] border border-[#3c3c3c] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-[#3c3c3c] flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{editing.id ? "Edit Project" : "New Project"}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-white/5 rounded-full transition-colors"><XMarkIcon className="w-6 h-6 text-[#858585]" /></button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
              <div className="space-y-8">
                {/* Visuals */}
                <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6">
                  <div className="h-32 bg-[#1e1e1e] rounded-xl border border-[#3c3c3c] flex items-center justify-center overflow-hidden">
                    {editing.cover_image ? <img src={editing.cover_image} className="w-full h-full object-cover" /> : <PhotoIcon className="w-10 h-10 text-[#3c3c3c]" />}
                  </div>
                  <div>
                    <label className={labelClass}>Project Thumbnail</label>
                    <div className="flex flex-col gap-3">
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                      <button onClick={() => fileInputRef.current?.click()} className="btn-ghost w-full py-2.5 justify-center flex items-center gap-2 rounded-md" disabled={uploading}>
                        <ArrowUpTrayIcon className="w-4 h-4" /> {uploading ? "Uploading..." : "Replace Cover Image"}
                      </button>
                      <input className={inputClass} style={{fontSize: 12}} placeholder="Or paste external image URL" value={editing.cover_image || ""} onChange={e => setEditing({...editing, cover_image: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>title</label>
                    <input className={inputClass} value={editing.title} onChange={e => {
                      const val = e.target.value;
                      setEditing({...editing, title: val, slug: editing.id ? editing.slug : slugify(val)});
                    }} />
                  </div>
                  <div>
                    <label className={labelClass}>slug</label>
                    <input className={inputClass} value={editing.slug} onChange={e => setEditing({...editing, slug: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>short description</label>
                  <textarea className={`${inputClass} h-20 resize-none`} value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})} />
                </div>

                <div>
                  <label className={labelClass}>SEO / technology description</label>
                  <textarea className={`${inputClass} h-20 resize-none`} placeholder="One sentence describing the stack and interactivity delivered" value={editing.seo_description || ""} onChange={e => setEditing({...editing, seo_description: e.target.value})} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Image alt text</label>
                    <input className={inputClass} placeholder="Describe the project screenshot" value={editing.image_alt || ""} onChange={e => setEditing({...editing, image_alt: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelClass}>Role / agency attribution</label>
                    <input className={inputClass} placeholder="Web Developer · Dcastalia Limited" value={editing.role_label || ""} onChange={e => setEditing({...editing, role_label: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>GitHub URL</label>
                    <div className="relative">
                      <input className={`${inputClass} pl-10`} value={editing.github_url || ""} onChange={e => setEditing({...editing, github_url: e.target.value})} />
                      <CodeBracketIcon className="absolute left-3 top-3 w-4 h-4 text-[#858585]" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Live Preview URL</label>
                    <div className="relative">
                      <input className={`${inputClass} pl-10`} value={editing.live_url || ""} onChange={e => setEditing({...editing, live_url: e.target.value})} />
                      <GlobeAltIcon className="absolute left-3 top-3 w-4 h-4 text-[#858585]" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Tech Stack (comma separated)</label>
                  <input className={inputClass} placeholder="React, Next.js, Tailwind, etc." value={techInput} onChange={e => setTechInput(e.target.value)} />
                </div>

                <div className="flex flex-wrap gap-8 items-center bg-[#1e1e1e] p-5 rounded-xl border border-[#3c3c3c]">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => setEditing({...editing, featured: !editing.featured})}>
                    <input type="checkbox" checked={editing.featured || false} readOnly className="w-4 h-4 rounded border-[#3c3c3c] bg-[#1e1e1e] accent-[#007acc]" />
                    <span className="text-sm text-[#d4d4d4]">Feature on Home Page</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#858585] uppercase tracking-widest">Project Type:</span>
                    <select className="bg-[#252526] text-sm text-[#d4d4d4] border border-[#3c3c3c] rounded px-3 py-1 outline-none focus:border-[#007acc]" value={editing.project_type || "company"} onChange={e => setEditing({...editing, project_type: e.target.value as Project['project_type']})}>
                      <option value="company">Company Project</option>
                      <option value="client">Client / Freelance Project</option>
                      <option value="personal">Personal Project</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#858585] uppercase tracking-widest">Category:</span>
                    <select className="bg-[#252526] text-sm text-[#d4d4d4] border border-[#3c3c3c] rounded px-3 py-1 outline-none focus:border-[#007acc]" value={editing.category || ""} onChange={e => setEditing({...editing, category: e.target.value})}>
                      <option value="">None</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#858585] uppercase tracking-widest">Status:</span>
                    <select className="bg-[#252526] text-sm text-[#d4d4d4] border border-[#3c3c3c] rounded px-3 py-1 outline-none focus:border-[#007acc]" value={editing.status} onChange={e => setEditing({...editing, status: e.target.value as 'completed' | 'in-progress' | 'planned'})}>
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="planned">Planned</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#858585] uppercase tracking-widest">Order:</span>
                    <input type="number" className="bg-[#252526] text-sm text-[#d4d4d4] border border-[#3c3c3c] rounded px-3 py-1 outline-none focus:border-[#007acc] w-20" value={editing.order_index || 0} onChange={e => setEditing({...editing, order_index: parseInt(e.target.value) || 0})} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#3c3c3c] bg-[#1e1e1e] flex gap-4">
              <button onClick={save} disabled={saving} className="btn-primary flex-1 py-3 rounded-lg font-bold shadow-lg shadow-[#007acc]/20">
                {saving ? "Saving Changes..." : "Save Project"}
              </button>
              <button onClick={closeModal} className="btn-ghost px-6 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {orderModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-[#252526] border border-[#3c3c3c] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-[#3c3c3c] flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Manage Project Order</h2>
              <button onClick={closeOrderModal} className="p-2 hover:bg-white/5 rounded-full transition-colors"><XMarkIcon className="w-6 h-6 text-[#858585]" /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <p className="text-xs text-[#858585] mb-4 font-mono">Drag projects to reorder or edit the order index directly. Changes will be saved to the database.</p>

              <div className="space-y-3">
                {orderProjects.map((p, index) => (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={() => handleDragStart(p.id)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(p.id)}
                    className={`flex items-center gap-4 p-4 bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg cursor-move transition-all ${
                      draggedProject === p.id ? "opacity-50 border-[#007acc]" : "hover:border-[#007acc]/40"
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-[#007acc]/20 rounded text-[#007acc] font-bold text-sm">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">{p.title}</h3>
                      <p className="text-xs text-[#858585] truncate">{p.category || "General"}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#858585] uppercase tracking-widest">Order:</span>
                      <input
                        type="number"
                        value={p.order_index}
                        onChange={(e) => updateOrderIndex(p.id, parseInt(e.target.value) || 0)}
                        className="w-16 bg-[#252526] text-sm text-[#d4d4d4] border border-[#3c3c3c] rounded px-2 py-1 outline-none focus:border-[#007acc]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-[#3c3c3c] bg-[#1e1e1e] flex gap-4">
              <button
                onClick={updateOrderIndexes}
                className="btn-primary flex-1 py-3 rounded-lg font-bold shadow-lg shadow-[#007acc]/20"
              >
                Save Order
              </button>
              <button onClick={closeOrderModal} className="btn-ghost px-6 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
