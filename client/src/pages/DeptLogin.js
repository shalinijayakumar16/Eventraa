import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import EventraLogo from "../components/EventraLogo";

const API_BASE = "http://localhost:5000";

/* ─── Styles (matching Landing page aesthetic) ─────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #07091A;
    --surface: rgba(255,255,255,0.04);
    --border: rgba(255,255,255,0.08);
    --primary: #6366F1;
    --accent: #8B5CF6;
    --pink: #EC4899;
    --text: #E2E8F0;
    --muted: #64748B;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 999px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes blobPulse {
    0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: scale(1); }
    50%       { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: scale(1.07); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33%       { transform: translateY(-14px) rotate(1.2deg); }
    66%       { transform: translateY(8px) rotate(-0.8deg); }
  }
  @keyframes rotate {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to   { transform: translate(-50%, -50%) rotate(360deg); }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.2); }
    50%       { box-shadow: 0 0 30px rgba(139,92,246,0.6), 0 0 90px rgba(139,92,246,0.3); }
  }
  @keyframes inputFocus {
    from { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
    to   { box-shadow: 0 0 0 3px rgba(99,102,241,0.25); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }

  .animate-fadeUp  { animation: fadeUp  0.65s ease both; }
  .animate-fadeIn  { animation: fadeIn  0.5s ease both; }
  .animate-float   { animation: float 6s ease-in-out infinite; }
  .animate-blob    { animation: blobPulse 8s ease-in-out infinite; }
  .animate-shake   { animation: shake 0.4s ease; }

  .gradient-text {
    background: linear-gradient(135deg, #E2E8F0 0%, #A5B4FC 40%, #8B5CF6 70%, #EC4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .gradient-text-brand {
    background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .dept-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 14px 18px 14px 46px;
    color: #E2E8F0;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
    letter-spacing: 0.01em;
  }
  .dept-input::placeholder { color: #475569; }
  .dept-input:focus {
    border-color: rgba(99,102,241,0.6);
    background: rgba(99,102,241,0.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
  }
  .dept-input.dept-id-input {
    text-transform: uppercase;
    font-weight: 600;
    font-family: 'Outfit', sans-serif;
    letter-spacing: 0.08em;
  }

  .btn-primary-glow {
    width: 100%;
    background: linear-gradient(135deg, #6366F1, #8B5CF6);
    color: #fff;
    border: none;
    padding: 15px 32px;
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(99,102,241,0.35);
    letter-spacing: 0.02em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .btn-primary-glow::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%);
    border-radius: 12px;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .btn-primary-glow:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(99,102,241,0.55); }
  .btn-primary-glow:hover:not(:disabled)::before { opacity: 1; }
  .btn-primary-glow:active:not(:disabled) { transform: translateY(0); }
  .btn-primary-glow:disabled { opacity: 0.6; cursor: not-allowed; }

  .back-link {
    color: #64748B;
    font-size: 13px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: color 0.2s;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    padding: 0;
  }
  .back-link:hover { color: #A5B4FC; }

  .dept-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 5px 14px;
    border-radius: 999px;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.25);
    color: #A5B4FC;
    font-size: 12px;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .card-glass {
    background: rgba(255,255,255,0.035);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    position: relative;
    overflow: hidden;
  }
  .card-glass::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.5) 40%, rgba(236,72,153,0.4) 70%, transparent 100%);
  }

  .error-toast {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 10px;
    padding: 11px 16px;
    color: #FCA5A5;
    font-size: 13.5px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: fadeUp 0.3s ease both;
  }

  .input-group {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .input-label {
    color: #94A3B8;
    font-size: 12px;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }
  .input-icon {
    position: absolute;
    left: 14px;
    bottom: 14px;
    pointer-events: none;
    opacity: 0.5;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .spinner {
    width: 17px; height: 17px;
    border: 2px solid rgba(255,255,255,0.25);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @media (max-width: 480px) {
    .login-card { padding: 32px 20px !important; margin: 0 16px !important; }
  }
`;

/* ─── SVG Icons ────────────────────────────────────────────────────────────── */
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    building: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M3 9h6"/><path d="M3 15h6"/><path d="M15 9h3"/><path d="M15 15h3"/>
      </svg>
    ),
    lock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    eye: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    eyeOff: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
      </svg>
    ),
    arrowLeft: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/>
      </svg>
    ),
    arrowRight: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
      </svg>
    ),
    alertCircle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    shield: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  };
  return icons[name] || null;
};

/* ─── Blob Background ──────────────────────────────────────────────────────── */
const BlobBg = () => (
  <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    <div className="animate-blob" style={{
      position: "absolute", top: "-20%", left: "-15%",
      width: "70vw", height: "70vw", maxWidth: 650, maxHeight: 650,
      background: "radial-gradient(circle at 40% 40%, rgba(99,102,241,0.16) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)",
      filter: "blur(70px)", animationDelay: "0s",
    }}/>
    <div className="animate-blob" style={{
      position: "absolute", bottom: "-10%", right: "-15%",
      width: "60vw", height: "60vw", maxWidth: 560, maxHeight: 560,
      background: "radial-gradient(circle at 60% 60%, rgba(236,72,153,0.12) 0%, rgba(139,92,246,0.07) 50%, transparent 70%)",
      filter: "blur(80px)", animationDelay: "-4s",
    }}/>
    {/* grid */}
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: "linear-gradient(rgba(99,102,241,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.035) 1px, transparent 1px)",
      backgroundSize: "80px 80px",
      maskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 80%)",
    }}/>

    {/* Floating dots */}
    {[
      { size: 5, top: "15%", left: "8%",  delay: "0s",   dur: "5s",   color: "#6366F1" },
      { size: 4, top: "70%", left: "5%",  delay: "1.5s", dur: "6s",   color: "#8B5CF6" },
      { size: 7, top: "25%", right: "7%", delay: "0.8s", dur: "4.5s", color: "#EC4899" },
      { size: 4, top: "75%", right: "10%",delay: "2s",   dur: "5.5s", color: "#6366F1" },
      { size: 5, top: "50%", left: "3%",  delay: "0.3s", dur: "7s",   color: "#A5B4FC" },
    ].map((dot, i) => (
      <div key={i} className="animate-float" style={{
        position: "absolute",
        width: dot.size, height: dot.size,
        borderRadius: "50%",
        background: dot.color,
        top: dot.top, left: dot.left, right: dot.right,
        animationDelay: dot.delay,
        animationDuration: dot.dur,
        boxShadow: `0 0 ${dot.size * 3}px ${dot.color}`,
        opacity: 0.65,
      }}/>
    ))}
  </div>
);

/* ─── Main Component ───────────────────────────────────────────────────────── */
function DeptLogin() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [deptId, setDeptId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shakeCard, setShakeCard] = useState(false);

  const triggerShake = () => {
    setShakeCard(true);
    setTimeout(() => setShakeCard(false), 450);
  };

  const handleDeptLogin = async () => {
    setError("");
    if (!deptId.trim()) { setError("Please enter your Department ID."); triggerShake(); return; }
    if (!password.trim()) { setError("Please enter your password."); triggerShake(); return; }

    setLoading(true);
    try {
      const payload = { deptId: deptId.trim().toUpperCase(), password };
      const loginUrl = `${API_BASE}/api/department/login`;

      console.log("[DeptLogin] Sending login request", {
        url: loginUrl,
        deptId: payload.deptId,
      });

      const res = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        localStorage.setItem("deptId", payload.deptId);
        showToast("Login successful ✅", "success");
        navigate("/dept-dashboard");
      } else {
        const backendMessage = data.message || "Invalid credentials. Please try again.";
        console.warn("[DeptLogin] Backend login error", {
          status: res.status,
          message: backendMessage,
        });
        setError(backendMessage);
        triggerShake();
      }
    } catch (error) {
      console.error("[DeptLogin] Network/server error", error);
      const networkMessage = "Unable to reach server. Check backend at http://localhost:5000 and try again.";
      showToast(networkMessage, "error");
      setError(networkMessage);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleDeptLogin();
  };

  return (
    <>
      <style>{STYLES}</style>
      <div style={{
        background: "#07091A",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
      }}>
        <BlobBg />

        {/* Back to home */}
        <div className="animate-fadeIn" style={{ position: "absolute", top: 24, left: 24, zIndex: 10, animationDelay: "0.1s" }}>
          <button className="back-link" onClick={() => navigate("/")}>
            <Icon name="arrowLeft" size={15} color="#64748B" />
            Back to Eventra
          </button>
        </div>

        {/* Logo */}
        <div className="animate-fadeUp" style={{ marginBottom: 36, zIndex: 1, animationDelay: "0.1s" }}>
          <EventraLogo size={36} textSize={22} />
        </div>

        {/* Card */}
        <div
          className={`card-glass animate-fadeUp ${shakeCard ? "animate-shake" : ""}`}
          style={{
            width: "100%", maxWidth: 440,
            padding: "44px 40px",
            zIndex: 1,
            animationDelay: "0.2s",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            {/* Icon orb */}
            <div style={{
              width: 64, height: 64, borderRadius: 18, margin: "0 auto 20px",
              background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))",
              border: "1px solid rgba(99,102,241,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 32px rgba(99,102,241,0.2)",
              animation: "glowPulse 3s ease infinite",
            }}>
              <Icon name="shield" size={28} color="#818CF8" />
            </div>

            <div className="dept-badge" style={{ marginBottom: 16 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6EE7B7", display: "inline-block", boxShadow: "0 0 8px #6EE7B7" }}/>
              Department Portal
            </div>

            <h1 style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: "1.85rem",
              letterSpacing: "-0.035em",
              lineHeight: 1.2,
              marginBottom: 8,
            }}>
              <span className="gradient-text">Department</span>{" "}
              <span style={{ color: "#E2E8F0" }}>Login</span>
            </h1>
            <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
              Access your department's event management dashboard
            </p>
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Dept ID */}
            <div className="input-group">
              <label className="input-label">Department ID</label>
              <div style={{ position: "relative" }}>
                <span className="input-icon">
                  <Icon name="building" size={17} color="#6366F1" />
                </span>
                <input
                  className="dept-input dept-id-input"
                  type="text"
                  placeholder="CSE, IT, ECE, MECH..."
                  value={deptId}
                  onChange={(e) => { setDeptId(e.target.value.toUpperCase()); setError(""); }}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position: "relative" }}>
                <span className="input-icon">
                  <Icon name="lock" size={17} color="#6366F1" />
                </span>
                <input
                  className="dept-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={handleKeyDown}
                  style={{ paddingRight: 48 }}
                />
                <button
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: "absolute", right: 14, bottom: 13,
                    background: "none", border: "none", cursor: "pointer",
                    opacity: 0.45, transition: "opacity 0.2s", padding: 0,
                    display: "flex", alignItems: "center",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0.45}
                  tabIndex={-1}
                >
                  <Icon name={showPassword ? "eyeOff" : "eye"} size={17} color="#94A3B8" />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="error-toast">
                <Icon name="alertCircle" size={16} color="#F87171" />
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              className="btn-primary-glow"
              onClick={handleDeptLogin}
              disabled={loading}
              style={{ marginTop: 4 }}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Verifying...
                </>
              ) : (
                <>
                  Access Dashboard
                  <Icon name="arrowRight" size={17} color="white" />
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            margin: "28px 0 22px",
          }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }}/>
            <span style={{ color: "#334155", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }}/>
          </div>

          {/* Student login link */}
          <button
            onClick={() => navigate("/login")}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: "13px 20px",
              color: "#94A3B8",
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              transition: "background 0.2s, border-color 0.2s, color 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
              e.currentTarget.style.color = "#E2E8F0";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "#94A3B8";
            }}
          >
            <Icon name="arrowLeft" size={15} color="currentColor" />
            Student Login
          </button>
        </div>

        {/* Footer note */}
        <p className="animate-fadeIn" style={{
          color: "#1E293B", fontSize: 12,
          fontFamily: "'DM Sans', sans-serif",
          marginTop: 28, zIndex: 1,
          animationDelay: "0.5s",
        }}>
          © 2026 Eventra · Department access is restricted
        </p>
      </div>
    </>
  );
}

export default DeptLogin;