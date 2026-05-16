"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Skill } from "@/lib/types";

const empty: Partial<Skill> = { name: "", category: "Frontend", proficiency: 80, icon: "", order_index: 0 };
const categories = ["Frontend", "Backend", "Tools", "Database", "DevOps", "Other"];

export default function SkillsDashboard() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Partial<Skill>>(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => { const r = await fetch("/api/skills"); setSkills(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.name) return toast.error("Name is required");
    setSaving(true);
    try {
      const res = await fetch("/api/skills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { toast.success("Skill added!"); setModal(false); setForm(empty); load(); }
      else toast.error("Failed");
    } finally { setSaving(false); }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    const res = await fetch("/api/skills", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (res.ok) { toast.success("Deleted"); load(); }
  };

  const groupedSkills = categories.reduce((acc, cat) => {
    const catSkills = skills.filter(s => s.category === cat);
    if (catSkills.length > 0) acc[cat] = catSkills;
    return acc;
  }, {} as Record<string, Skill[]>);

  const catColor: Record<string, string> = { Frontend: "#569cd6", Backend: "#4ec9b0", Tools: "#dcdcaa", Database: "#ce9178", DevOps: "#c586c0", Other: "#858585" };
  const lbl: React.CSSProperties = { display: "block", fontSize: 12, color: "#858585", fontFamily: "monospace", marginBottom: 6 };
  const ipt: React.CSSProperties = { width: "100%", padding: "9px 14px", background: "#1e1e1e", border: "1px solid #3c3c3c", borderRadius: 5, color: "#d4d4d4", fontSize: 13, outline: "none", fontFamily: "inherit" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>Skills</h1>
          <p style={{ fontSize: 13, color: "#858585", marginTop: 4 }}>Manage your technical skills</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <PlusIcon style={{ width: 16, height: 16 }} /> Add Skill
        </button>
      </div>

      {loading ? <div style={{ color: "#858585", textAlign: "center", padding: "40px 0" }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {Object.entries(groupedSkills).map(([cat, catSkills]) => (
            <div key={cat}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: catColor[cat] ?? "#858585" }} />
                <span style={{ color: catColor[cat] ?? "#858585", fontFamily: "monospace", fontSize: 13, fontWeight: 600 }}>{cat}</span>
                <span style={{ color: "#555", fontSize: 12 }}>({catSkills.length})</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                {catSkills.map(skill => (
                  <div key={skill.id} style={{ background: "#252526", border: "1px solid #3c3c3c", borderRadius: 8, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontWeight: 600, color: "#d4d4d4", fontSize: 13 }}>{skill.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, color: catColor[cat] ?? "#858585", fontFamily: "monospace" }}>{skill.proficiency}%</span>
                        <button onClick={() => deleteSkill(skill.id)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer" }}>
                          <TrashIcon style={{ width: 13, height: 13 }} />
                        </button>
                      </div>
                    </div>
                    <div style={{ height: 4, background: "#3c3c3c", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${skill.proficiency}%`, background: catColor[cat] ?? "#569cd6", borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {skills.length === 0 && <div style={{ color: "#858585", fontFamily: "monospace", fontSize: 13, textAlign: "center", padding: "60px 0" }}>// No skills yet. Add your first skill.</div>}
        </div>
      )}

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: "#252526", border: "1px solid #3c3c3c", borderRadius: 12, padding: 32, width: "100%", maxWidth: 440 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 600 }}>Add Skill</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", color: "#858585", cursor: "pointer" }}><XMarkIcon style={{ width: 20, height: 20 }} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={lbl}>skill name *</label>
                <input value={form.name ?? ""} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={ipt} placeholder="React"
                  onFocus={e => e.target.style.borderColor = "#007acc"} onBlur={e => e.target.style.borderColor = "#3c3c3c"} />
              </div>
              <div>
                <label style={lbl}>category</label>
                <select value={form.category ?? "Frontend"} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ ...ipt, cursor: "pointer" }}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>proficiency: {form.proficiency}%</label>
                <input type="range" min={0} max={100} value={form.proficiency ?? 80}
                  onChange={e => setForm(p => ({ ...p, proficiency: Number(e.target.value) }))}
                  style={{ width: "100%", accentColor: "#007acc" }} />
              </div>
              <div>
                <label style={lbl}>order index</label>
                <input type="number" value={form.order_index ?? 0} onChange={e => setForm(p => ({ ...p, order_index: Number(e.target.value) }))} style={ipt}
                  onFocus={e => e.target.style.borderColor = "#007acc"} onBlur={e => e.target.style.borderColor = "#3c3c3c"} />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={save} disabled={saving} className="btn-primary">{saving ? "Saving..." : "Add Skill"}</button>
                <button onClick={() => setModal(false)} className="btn-ghost">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
