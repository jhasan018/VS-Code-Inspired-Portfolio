"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PlusIcon, TrashIcon, TagIcon, Squares2X2Icon, BookOpenIcon, XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Category } from "@/lib/types";
import slugify from "slug";

const empty: Partial<Category> = { name: "", type: "blog" };

export default function CategoriesDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Category>>(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing.name) return toast.error("Name is required");
    setSaving(true);
    const slug = slugify(editing.name.toLowerCase());
    try {
      const res = await fetch("/api/categories", {
        method: editing.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editing, slug }),
      });
      if (res.ok) { toast.success("Saved!"); setModal(false); load(); }
      else toast.error("Failed to save");
    } finally { setSaving(false); }
  };

  const deleteCat = async (id: string) => {
    if (!confirm("Delete this category? Items using this category might break.")) return;
    await fetch("/api/categories", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Category Management</h1>
          <p className="text-sm text-[#858585] mt-1 font-mono uppercase tracking-widest text-[10px]">Configure dynamic filters for Blogs & Projects</p>
        </div>
        <button 
          onClick={() => { setEditing(empty); setModal(true); }} 
          className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-[#007acc]/20 transition-all hover:scale-[1.02]"
        >
          <PlusIcon className="w-5 h-5" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Blog Categories */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#858585] mb-2">
            <BookOpenIcon className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-widest">Blog Categories</h2>
          </div>
          <div className="grid gap-3">
            {categories.filter(c => c.type === 'blog').map(c => (
              <CategoryCard key={c.id} category={c} onDelete={() => deleteCat(c.id)} onEdit={() => { setEditing(c); setModal(true); }} />
            ))}
          </div>
        </div>

        {/* Project Categories */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#858585] mb-2">
            <Squares2X2Icon className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-widest">Project Categories</h2>
          </div>
          <div className="grid gap-3">
            {categories.filter(c => c.type === 'project').map(c => (
              <CategoryCard key={c.id} category={c} onDelete={() => deleteCat(c.id)} onEdit={() => { setEditing(c); setModal(true); }} />
            ))}
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 animate-in fade-in backdrop-blur-sm">
          <div className="bg-[#252526] border border-[#3c3c3c] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#3c3c3c] flex justify-between items-center bg-[#1e1e1e]/40">
              <h2 className="text-lg font-bold text-white">{editing.id ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <XMarkIcon className="w-5 h-5 text-[#858585]" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] text-[#858585] font-mono mb-2 uppercase tracking-widest">Category Name</label>
                <input 
                  className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg px-4 py-3 text-white outline-none focus:border-[#007acc] transition-all" 
                  placeholder="e.g. Frontend Development"
                  value={editing.name}
                  onChange={e => setEditing({...editing, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#858585] font-mono mb-2 uppercase tracking-widest">Apply To</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setEditing({...editing, type: 'blog'})}
                    className={`py-3 rounded-lg border text-sm font-bold transition-all ${editing.type === 'blog' ? 'bg-[#007acc]/20 border-[#007acc] text-[#007acc]' : 'bg-[#1e1e1e] border-[#3c3c3c] text-[#858585]'}`}
                  >
                    Blogs
                  </button>
                  <button 
                    onClick={() => setEditing({...editing, type: 'project'})}
                    className={`py-3 rounded-lg border text-sm font-bold transition-all ${editing.type === 'project' ? 'bg-[#4ec9b0]/20 border-[#4ec9b0] text-[#4ec9b0]' : 'bg-[#1e1e1e] border-[#3c3c3c] text-[#858585]'}`}
                  >
                    Projects
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 bg-[#1e1e1e]/60 flex gap-3 border-t border-[#3c3c3c]">
              <button onClick={save} disabled={saving} className="btn-primary flex-1 py-3 rounded-lg font-bold">
                {saving ? "Saving..." : "Save Category"}
              </button>
              <button onClick={() => setModal(false)} className="btn-ghost px-6 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryCard({ category, onDelete, onEdit }: { category: Category, onDelete: () => void, onEdit: () => void }) {
  return (
    <div className="bg-[#1e1e1e] border border-[#3c3c3c] p-4 rounded-xl flex items-center justify-between group hover:border-[#007acc]/40 transition-all">
      <div className="flex items-center gap-3">
        <div className={`w-1.5 h-1.5 rounded-full ${category.type === 'blog' ? 'bg-[#007acc]' : 'bg-[#4ec9b0]'}`} />
        <div>
          <div className="text-sm font-bold text-white">{category.name}</div>
          <div className="text-[10px] font-mono text-[#858585] mt-0.5">/{category.slug}</div>
        </div>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-2 hover:bg-[#007acc]/20 text-[#858585] hover:text-[#007acc] rounded-lg transition-colors"><PencilIcon className="w-4 h-4" /></button>
        <button onClick={onDelete} className="p-2 hover:bg-red-500/20 text-[#858585] hover:text-red-500 rounded-lg transition-colors"><TrashIcon className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
