"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProfileDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [about, setAbout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [timelineJson, setTimelineJson] = useState("");
  const [educationJson, setEducationJson] = useState("");

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(d => {
      setProfile(d.profile ?? {});
      setAbout(d.about ?? {});
      setTimelineJson(JSON.stringify(d.about?.timeline ?? [], null, 2));
      setEducationJson(JSON.stringify(d.about?.education ?? [], null, 2));
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      let parsedTimeline, parsedEdu;
      try { 
        parsedTimeline = JSON.parse(timelineJson); 
        parsedEdu = JSON.parse(educationJson);
      } catch { return toast.error("Invalid JSON format"); }
      
      const res = await fetch("/api/profile", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, about: { ...about, timeline: parsedTimeline, education: parsedEdu } }),
      });
      if (res.ok) toast.success("Profile saved!");
      else toast.error("Failed to save");
    } finally { setSaving(false); }
  };

  const inp = (obj: any, set: any, field: string, label: string, type = "text", placeholder = "") => (
    <div key={field}>
      <label style={lbl}>{label}</label>
      <input type={type} value={obj?.[field] ?? ""} placeholder={placeholder}
        onChange={e => set((p: any) => ({ ...p, [field]: e.target.value }))}
        style={ipt} onFocus={e => e.target.style.borderColor = "#007acc"} onBlur={e => e.target.style.borderColor = "#3c3c3c"} />
    </div>
  );

  const lbl: React.CSSProperties = { display: "block", fontSize: 12, color: "#858585", fontFamily: "monospace", marginBottom: 6 };
  const ipt: React.CSSProperties = { width: "100%", padding: "9px 14px", background: "#1e1e1e", border: "1px solid #3c3c3c", borderRadius: 5, color: "#d4d4d4", fontSize: 13, outline: "none", fontFamily: "inherit" };
  const section = (title: string) => <h2 style={{ color: "#d4d4d4", fontSize: 15, fontWeight: 600, marginTop: 8, paddingTop: 20, borderTop: "1px solid #3c3c3c" }}>{title}</h2>;

  if (loading) return <div style={{ color: "#858585", textAlign: "center", padding: 60 }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>Profile</h1>
          <p style={{ fontSize: 13, color: "#858585", marginTop: 4 }}>Edit your personal information</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save Changes"}</button>
      </div>

      <div style={{ background: "#252526", border: "1px solid #3c3c3c", borderRadius: 10, padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Basic Info */}
        {inp(profile, setProfile, "name", "full name", "text", "Jahid Hasan")}
        {inp(profile, setProfile, "title", "job title", "text", "Full Stack Web Developer")}
        {inp(profile, setProfile, "subtitle", "subtitle")}
        <div>
          <label style={lbl}>bio</label>
          <textarea value={profile?.bio ?? ""} onChange={e => setProfile((p: any) => ({ ...p, bio: e.target.value }))}
            rows={4} style={{ ...ipt, resize: "vertical" }}
            onFocus={e => e.target.style.borderColor = "#007acc"} onBlur={e => e.target.style.borderColor = "#3c3c3c"} />
        </div>
        {inp(profile, setProfile, "email", "email", "email")}
        {inp(profile, setProfile, "location", "location", "text", "Bangladesh")}

        {section("Social Links")}
        {inp(profile, setProfile, "github_url", "github url", "url", "https://github.com/...")}
        {inp(profile, setProfile, "linkedin_url", "linkedin url", "url", "https://linkedin.com/in/...")}
        {inp(profile, setProfile, "twitter_url", "twitter url", "url", "https://twitter.com/...")}
        {inp(profile, setProfile, "resume_url", "resume url (Google Drive / PDF)", "url")}
        
        <div>
          <label style={lbl}>avatar image</label>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#1e1e1e", border: "1px solid #3c3c3c", overflow: "hidden", flexShrink: 0 }}>
              {profile?.avatar_url && <img src={profile.avatar_url} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </div>
            <input type="file" accept="image/*" onChange={async e => {
              const file = e.target.files?.[0];
              if (!file) return;
              const loadingToast = toast.loading("Uploading avatar...");
              try {
                const { uploadImage } = await import("@/lib/supabase/storage");
                const url = await uploadImage(file);
                setProfile((p: any) => ({ ...p, avatar_url: url }));
                toast.success("Avatar uploaded!", { id: loadingToast });
              } catch (err) {
                toast.error("Upload failed", { id: loadingToast });
              }
            }} style={{ fontSize: 12, color: "#858585" }} />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input type="checkbox" id="available" checked={profile?.available_for_work ?? true}
            onChange={e => setProfile((p: any) => ({ ...p, available_for_work: e.target.checked }))}
            style={{ width: 16, height: 16, accentColor: "#007acc" }} />
          <label htmlFor="available" style={{ ...lbl, margin: 0, cursor: "pointer" }}>available for work</label>
        </div>

        {section("About Page Stats")}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[["experience_years", "years of experience"], ["projects_count", "projects count"], ["clients_count", "clients count"]].map(([field, label]) => (
            <div key={field}>
              <label style={lbl}>{label}</label>
              <input type="number" value={about?.[field] ?? 0} onChange={e => setAbout((p: any) => ({ ...p, [field]: Number(e.target.value) }))}
                style={ipt} onFocus={e => e.target.style.borderColor = "#007acc"} onBlur={e => e.target.style.borderColor = "#3c3c3c"} />
            </div>
          ))}
        </div>

        {section("Timeline (JSON)")}
        <div>
          <label style={lbl}>timeline — edit as JSON array</label>
          <textarea value={timelineJson} onChange={e => setTimelineJson(e.target.value)}
            rows={10} style={{ ...ipt, resize: "vertical", fontFamily: "monospace", fontSize: 12, lineHeight: 1.6 }}
            onFocus={e => e.target.style.borderColor = "#007acc"} onBlur={e => e.target.style.borderColor = "#3c3c3c"} />
          <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>
            Format: [{`{"year":"2024","title":"Job Title","company":"Company","description":"...","type":"work"}`}]
          </div>
        </div>

        {section("Education (JSON)")}
        <div>
          <label style={lbl}>education — edit as JSON array</label>
          <textarea value={educationJson} onChange={e => setEducationJson(e.target.value)}
            rows={10} style={{ ...ipt, resize: "vertical", fontFamily: "monospace", fontSize: 12, lineHeight: 1.6 }}
            onFocus={e => e.target.style.borderColor = "#007acc"} onBlur={e => e.target.style.borderColor = "#3c3c3c"} />
          <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>
            Format: [{`{"year":"2020-2024","degree":"B.Sc in CSE","school":"University Name","description":"..."}`}]
          </div>
        </div>

        <button onClick={save} disabled={saving} className="btn-primary" style={{ alignSelf: "flex-start" }}>
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
