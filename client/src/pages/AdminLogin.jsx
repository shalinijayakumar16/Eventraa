import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    // Admin login page
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0f172a, #1e293b)", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.25)", borderRadius: 16, padding: 24, boxShadow: "0 14px 40px rgba(0,0,0,0.35)" }}>
        <h1 style={{ color: "#e2e8f0", fontSize: 28, marginBottom: 6 }}>Admin Login</h1>
        <p style={{ color: "#94a3b8", marginBottom: 20 }}>Sign in to access the admin dashboard.</p>

        <form onSubmit={handleAdminLogin}>
          <label htmlFor="admin-username" style={{ color: "#cbd5e1", fontWeight: 600, display: "block", marginBottom: 6 }}>Username</label>
          <input
            id="admin-username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter username"
            required
            style={{ width: "100%", marginBottom: 14, padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(148,163,184,0.4)", background: "#0b1220", color: "#e2e8f0", outline: "none" }}
          />

          <label htmlFor="admin-password" style={{ color: "#cbd5e1", fontWeight: 600, display: "block", marginBottom: 6 }}>Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            required
            style={{ width: "100%", marginBottom: 14, padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(148,163,184,0.4)", background: "#0b1220", color: "#e2e8f0", outline: "none" }}
          />

          {error && <p style={{ color: "#fca5a5", marginBottom: 12 }}>{error}</p>}

          <button
            type="submit"
            style={{ width: "100%", border: "none", borderRadius: 10, padding: "11px 14px", fontWeight: 700, background: "linear-gradient(135deg, #0ea5e9, #3b82f6)", color: "white", cursor: "pointer" }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;