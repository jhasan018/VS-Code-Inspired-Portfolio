"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TrashIcon, EnvelopeOpenIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { ContactMessage } from "@/lib/types";
import { format } from "date-fns";

export default function MessagesDashboard() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const load = async () => { const r = await fetch("/api/messages"); setMessages(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await fetch("/api/messages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, read: true }) });
    load();
  };

  const deleteMsg = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const res = await fetch("/api/messages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (res.ok) { toast.success("Deleted"); setSelected(null); load(); }
  };

  const openMessage = (m: ContactMessage) => {
    setSelected(m);
    if (!m.read) markRead(m.id);
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>Messages</h1>
        <p style={{ fontSize: 13, color: "#858585", marginTop: 4 }}>
          {unread > 0 ? <span style={{ color: "#f44747" }}>{unread} unread message{unread !== 1 ? "s" : ""}</span> : "All messages read"} · {messages.length} total
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20, minHeight: 500 }}>
        {/* List */}
        <div style={{ background: "#252526", border: "1px solid #3c3c3c", borderRadius: 10, overflow: "hidden" }}>
          {loading ? <div style={{ color: "#858585", textAlign: "center", padding: 40 }}>Loading...</div> : (
            <div>
              {messages.map(m => (
                <div key={m.id} onClick={() => openMessage(m)} style={{
                  padding: "14px 18px", borderBottom: "1px solid #3c3c3c", cursor: "pointer",
                  background: selected?.id === m.id ? "rgba(0,122,204,0.1)" : (m.read ? "transparent" : "rgba(244,71,71,0.04)"),
                  transition: "background 0.15s",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {m.read
                        ? <EnvelopeOpenIcon style={{ width: 13, height: 13, color: "#555" }} />
                        : <EnvelopeIcon style={{ width: 13, height: 13, color: "#f44747" }} />
                      }
                      <span style={{ fontWeight: m.read ? 400 : 600, color: m.read ? "#858585" : "#d4d4d4", fontSize: 13 }}>{m.name}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "#555" }}>{format(new Date(m.created_at), "MMM dd")}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#858585", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {m.subject || m.message}
                  </div>
                </div>
              ))}
              {messages.length === 0 && <div style={{ color: "#858585", fontFamily: "monospace", fontSize: 13, textAlign: "center", padding: "60px 0" }}>// No messages yet.</div>}
            </div>
          )}
        </div>

        {/* Detail */}
        <div style={{ background: "#252526", border: "1px solid #3c3c3c", borderRadius: 10, padding: 24 }}>
          {selected ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{selected.subject || "(No subject)"}</div>
                  <div style={{ fontSize: 13, color: "#858585" }}>
                    From: <span style={{ color: "#4ec9b0" }}>{selected.name}</span> &lt;{selected.email}&gt;
                  </div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{format(new Date(selected.created_at), "MMMM dd, yyyy 'at' HH:mm")}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn-primary" style={{ fontSize: 12, padding: "6px 14px" }}>
                    Reply
                  </a>
                  <button onClick={() => deleteMsg(selected.id)} style={{ padding: "6px 10px", background: "transparent", border: "1px solid #3c3c3c", borderRadius: 5, color: "#f44747", cursor: "pointer" }}>
                    <TrashIcon style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>
              <div style={{ borderTop: "1px solid #3c3c3c", paddingTop: 20 }}>
                <p style={{ color: "#d4d4d4", fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{selected.message}</p>
              </div>
            </div>
          ) : (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontFamily: "monospace", fontSize: 13 }}>
              // Select a message to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
