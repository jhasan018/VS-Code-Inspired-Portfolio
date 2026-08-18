"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        toast.success("Welcome back!");
        router.replace("/dashboard");
      } else {
        toast.error("Invalid credentials");
        setLoading(false);
      }
    } catch {
      toast.error("Network error");
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px",
    background: "#2d2d2d", border: "1px solid #3c3c3c",
    borderRadius: 6, color: "#d4d4d4", fontSize: 14,
    outline: "none", fontFamily: "inherit",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#1e1e1e",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        width: "100%", maxWidth: 400,
        background: "#252526", border: "1px solid #3c3c3c",
        borderRadius: 12, padding: "40px 36px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        {/* VS Code logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Dashboard Login</h1>
          <p style={{ fontSize: 13, color: "#858585" }}>Portfolio Admin Panel</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ fontSize: 12, color: "#858585", fontFamily: "monospace", display: "block", marginBottom: 8 }}>
              email
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              style={inputStyle} placeholder="admin@portfolio.com" required
              onFocus={e => e.target.style.borderColor = "#007acc"}
              onBlur={e => e.target.style.borderColor = "#3c3c3c"}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#858585", fontFamily: "monospace", display: "block", marginBottom: 8 }}>
              password
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              style={inputStyle} placeholder="••••••••" required
              onFocus={e => e.target.style.borderColor = "#007acc"}
              onBlur={e => e.target.style.borderColor = "#3c3c3c"}
            />
          </div>
          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "12px",
              background: loading ? "#555" : "#007acc",
              color: "#fff", border: "none", borderRadius: 6,
              fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.2s", marginTop: 8,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#555" }}>
          Default: admin@portfolio.com / admin123
        </p>
      </div>
    </div>
  );
}
