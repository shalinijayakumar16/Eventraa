import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlobBg from "../components/BlobBg";
import EventraLogo from "../components/EventraLogo";
import { STYLES } from "../constants/styles";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = (event) => {
    event.preventDefault();

    // Handle admin authentication logic
    if (username === "admin" && password === "admin123") {
      // Store admin session in localStorage
      localStorage.setItem("isAdmin", "true");
      navigate("/admin-dashboard");
      return;
    }

    setError("Invalid admin credentials");
  };

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ minHeight: "100vh", background: "#07091A", color: "#E2E8F0", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "86px 16px 24px" }}>
        <BlobBg />

        {/* Admin login page */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2, padding: "0 24px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(7,9,26,0.82)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <EventraLogo subtitle="Admin" />

          <button onClick={() => navigate("/")} className="btn-ghost" style={{ padding: "9px 18px", fontSize: 13 }}>
            Back to site
          </button>
        </div>

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440, animation: "fadeUp 0.65s ease both" }}>
          <div style={{ position: "relative", padding: "28px 28px 24px", background: "rgba(255,255,255,0.035)", backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, boxShadow: "0 28px 70px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)" }}>
            <div style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.7), rgba(139,92,246,0.7), transparent)" }} />

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 999, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.28)", fontSize: 11, color: "#A5B4FC", fontFamily: "'DM Sans', sans-serif" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#6EE7B7", display: "inline-block", boxShadow: "0 0 7px #6EE7B7" }} />
                Admin access only
              </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.8rem", letterSpacing: "-0.04em", lineHeight: 1.15, marginBottom: 6 }}>
                <span className="gradient-text">Admin Login</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: 13 }}>Sign in to manage the admin dashboard.</p>
            </div>

            {/* Reusing global styles to maintain UI consistency */}
            <form onSubmit={handleAdminLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label htmlFor="admin-username" className="form-label">Username</label>
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter username"
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="form-label">Password</label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  required
                  className="form-input"
                />
              </div>

              {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "11px 14px", color: "#FCA5A5", fontSize: 13 }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary-glow" style={{ width: "100%", justifyContent: "center" }}>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;