import { createServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createServerClient();
  const [{ count: projects }, { count: blogs }, { count: messages }, { count: skills }] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("blogs").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("read", false),
    supabase.from("skills").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Projects", value: projects ?? 0, color: "#007acc", icon: "📦" },
    { label: "Blog Posts", value: blogs ?? 0, color: "#4ec9b0", icon: "📝" },
    { label: "Unread Messages", value: messages ?? 0, color: "#f44747", icon: "📬" },
    { label: "Skills", value: skills ?? 0, color: "#dcdcaa", icon: "⚡" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Overview</h1>
      <p style={{ color: "#858585", fontSize: 14, marginBottom: 32 }}>Welcome back! Here&apos;s your portfolio at a glance.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
        {stats.map(({ label, value, color, icon }) => (
          <div key={label} style={{
            background: "#252526", border: "1px solid #3c3c3c", borderRadius: 10,
            padding: "24px 20px", display: "flex", flexDirection: "column", gap: 12,
          }}>
            <div style={{ fontSize: 28 }}>{icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color, fontFamily: "monospace" }}>{value}</div>
            <div style={{ fontSize: 13, color: "#858585" }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#252526", border: "1px solid #3c3c3c", borderRadius: 10, padding: 24 }}>
        <h2 style={{ color: "#d4d4d4", fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Quick Actions</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Add Project", href: "/dashboard/projects", color: "#007acc" },
            { label: "Write Blog", href: "/dashboard/blogs", color: "#4ec9b0" },
            { label: "Update Skills", href: "/dashboard/skills", color: "#dcdcaa" },
            { label: "Edit Profile", href: "/dashboard/profile", color: "#c586c0" },
          ].map(({ label, href, color }) => (
            <a key={label} href={href} style={{
              padding: "10px 20px", background: `${color}20`, color,
              border: `1px solid ${color}40`, borderRadius: 6, fontSize: 13,
              textDecoration: "none", fontWeight: 500, transition: "all 0.15s",
            }}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
