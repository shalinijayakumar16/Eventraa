import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// ─── Minimal motion shim (no framer-motion dep required in sandbox) ───────────
// If framer-motion is available in the project, swap `motion.div` for real ones.
// Here we animate via CSS + inline style so the file is self-contained.

const COLORS = {
  bg: "#07091A",
  surface: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  primary: "#6366F1",
  accent: "#8B5CF6",
  pink: "#EC4899",
  text: "#E2E8F0",
  muted: "#64748B",
};

/* ─── Keyframe injection ──────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: ${COLORS.bg};
    --surface: ${COLORS.surface};
    --border: ${COLORS.border};
    --primary: ${COLORS.primary};
    --accent: ${COLORS.accent};
    --pink: ${COLORS.pink};
    --text: ${COLORS.text};
    --muted: ${COLORS.muted};
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
  }

  /* scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 999px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33%       { transform: translateY(-18px) rotate(1.5deg); }
    66%       { transform: translateY(10px) rotate(-1deg); }
  }
  @keyframes blobPulse {
    0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: scale(1); }
    50%       { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: scale(1.08); }
  }
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes stepLine {
    from { height: 0; opacity: 0; }
    to   { height: 100%; opacity: 1; }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.2); }
    50%       { box-shadow: 0 0 30px rgba(139,92,246,0.6), 0 0 90px rgba(139,92,246,0.3); }
  }
  @keyframes orbitSpin {
    from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
  }
  @keyframes gradShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  .animate-fadeUp  { animation: fadeUp  0.7s ease both; }
  .animate-fadeIn  { animation: fadeIn  0.6s ease both; }
  .animate-float   { animation: float   6s ease-in-out infinite; }
  .animate-blob    { animation: blobPulse 8s ease-in-out infinite; }
  .animate-rotate  { animation: rotate  20s linear infinite; }
  .animate-shimmer {
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
    background-size: 200% auto;
    animation: shimmer 2.5s linear infinite;
  }

  .glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.08);
  }

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

  .btn-primary-glow {
    background: linear-gradient(135deg, #6366F1, #8B5CF6);
    color: #fff;
    border: none;
    padding: 14px 32px;
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(99,102,241,0.35);
    letter-spacing: 0.01em;
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
  .btn-primary-glow:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(99,102,241,0.55); }
  .btn-primary-glow:hover::before { opacity: 1; }
  .btn-primary-glow:active { transform: translateY(0); }

  .btn-ghost {
    background: rgba(255,255,255,0.04);
    color: #CBD5E1;
    border: 1px solid rgba(255,255,255,0.12);
    padding: 13px 30px;
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.2s, color 0.2s;
    backdrop-filter: blur(8px);
  }
  .btn-ghost:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(99,102,241,0.5);
    color: #E2E8F0;
    transform: translateY(-2px);
  }

  .feature-card {
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 32px 28px;
    transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s, background 0.3s;
    backdrop-filter: blur(12px);
    position: relative;
    overflow: hidden;
  }
  .feature-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .feature-card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 20px 60px rgba(99,102,241,0.18), 0 0 0 1px rgba(99,102,241,0.2);
    border-color: rgba(99,102,241,0.3);
    background: rgba(255,255,255,0.055);
  }
  .feature-card:hover::before { opacity: 1; }

  .icon-box {
    width: 52px; height: 52px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    margin-bottom: 20px;
    position: relative;
  }

  .step-card {
    display: flex;
    gap: 24px;
    align-items: flex-start;
    padding: 28px 32px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    transition: border-color 0.3s, background 0.3s;
  }
  .step-card:hover {
    border-color: rgba(99,102,241,0.3);
    background: rgba(99,102,241,0.06);
  }
  .step-num {
    min-width: 44px; height: 44px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 16px;
    background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3));
    border: 1px solid rgba(99,102,241,0.4);
    color: #A5B4FC;
    flex-shrink: 0;
  }

  .ticker-track {
    display: flex;
    gap: 48px;
    animation: marquee 22s linear infinite;
    white-space: nowrap;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .hero-heading { font-size: clamp(2.8rem, 9vw, 4rem) !important; }
    .features-grid { grid-template-columns: 1fr !important; }
    .steps-grid { grid-template-columns: 1fr !important; }
    .nav-links { display: none !important; }
    .hero-ctas { flex-direction: column; align-items: center; }
    .hero-ctas button { width: 100%; max-width: 300px; justify-content: center; }
  }
  @media (max-width: 1024px) {
    .features-grid { grid-template-columns: 1fr 1fr !important; }
  }
`;

/* ─── SVG Icons ───────────────────────────────────────────────────────────── */
const Icon = ({ name, size = 22, color = "currentColor" }) => {
  const icons = {
    compass: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"/>
      </svg>
    ),
    zap: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
      </svg>
    ),
    filter: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
      </svg>
    ),
    bell: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20,6 9,17 4,12"/>
      </svg>
    ),
    star: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    ),
    arrowRight: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
      </svg>
    ),
    calendar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    users: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  };
  return icons[name] || null;
};

/* ─── Blob Background ─────────────────────────────────────────────────────── */
const BlobBg = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    {/* large blobs */}
    <div className="animate-blob" style={{
      position: "absolute", top: "-15%", left: "-10%",
      width: "65vw", height: "65vw", maxWidth: 700, maxHeight: 700,
      background: "radial-gradient(circle at 40% 40%, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)",
      filter: "blur(60px)", animationDelay: "0s",
    }}/>
    <div className="animate-blob" style={{
      position: "absolute", top: "20%", right: "-15%",
      width: "55vw", height: "55vw", maxWidth: 600, maxHeight: 600,
      background: "radial-gradient(circle at 60% 60%, rgba(236,72,153,0.14) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)",
      filter: "blur(70px)", animationDelay: "-3s",
    }}/>
    <div className="animate-blob" style={{
      position: "absolute", bottom: "-10%", left: "30%",
      width: "50vw", height: "50vw", maxWidth: 500, maxHeight: 500,
      background: "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 65%)",
      filter: "blur(80px)", animationDelay: "-6s",
    }}/>
    {/* grid overlay */}
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)",
      backgroundSize: "80px 80px",
      maskImage: "radial-gradient(ellipse at 50% 0%, black 30%, transparent 80%)",
    }}/>
  </div>
);

/* ─── Navbar ──────────────────────────────────────────────────────────────── */
const Navbar = ({ navigate }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 24px",
      height: 68,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "background 0.4s, border-bottom 0.4s, backdrop-filter 0.4s",
      background: scrolled ? "rgba(7,9,26,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: "linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(99,102,241,0.45)",
          fontSize: 15, fontWeight: 800, color: "#fff",
          fontFamily: "'Outfit', sans-serif",
        }}>E</div>
        <span style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 20,
          background: "linear-gradient(135deg, #E2E8F0, #A5B4FC)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "-0.02em",
        }}>Eventra</span>
      </div>

      {/* Nav links */}
      <div className="nav-links" style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {["Features", "How It Works", "For Departments"].map(link => (
          <a key={link} href={`#${link.toLowerCase().replace(/ /g, "-")}`} style={{
            color: "#94A3B8", textDecoration: "none", fontSize: 14,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            transition: "color 0.2s",
          }}
          onMouseEnter={e => e.target.style.color = "#E2E8F0"}
          onMouseLeave={e => e.target.style.color = "#94A3B8"}
          >{link}</a>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={() => navigate("/login")} className="btn-ghost" style={{ padding: "9px 20px", fontSize: 14 }}>
          Log In
        </button>
        <button onClick={() => navigate("/register")} className="btn-primary-glow" style={{ padding: "9px 20px", fontSize: 14 }}>
          Sign Up →
        </button>
      </div>
    </nav>
  );
};

/* ─── Hero ────────────────────────────────────────────────────────────────── */
const HeroSection = ({ navigate }) => (
  <section id="hero" style={{
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    padding: "120px 24px 80px", position: "relative", textAlign: "center",
  }}>
    <BlobBg />

    {/* Floating orbit elements */}
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {[
        { size: 8, top: "22%", left: "12%", delay: "0s", dur: "4s", color: "#6366F1" },
        { size: 5, top: "55%", left: "8%",  delay: "1s", dur: "5s", color: "#8B5CF6" },
        { size: 6, top: "35%", right: "10%", delay: "2s", dur: "6s", color: "#EC4899" },
        { size: 4, top: "70%", right: "15%", delay: "0.5s", dur: "4.5s", color: "#6366F1" },
        { size: 10, top: "15%", right: "25%", delay: "1.5s", dur: "7s", color: "#A5B4FC" },
      ].map((dot, i) => (
        <div key={i} className="animate-float" style={{
          position: "absolute", width: dot.size, height: dot.size,
          borderRadius: "50%", background: dot.color,
          top: dot.top, left: dot.left, right: dot.right,
          animationDelay: dot.delay, animationDuration: dot.dur,
          boxShadow: `0 0 ${dot.size * 3}px ${dot.color}`,
          opacity: 0.7,
        }}/>
      ))}
    </div>

    <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto" }}>
      {/* Badge */}
      <div className="animate-fadeUp" style={{ animationDelay: "0.1s", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "7px 16px", borderRadius: 999,
          background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
          fontSize: 13, color: "#A5B4FC", fontFamily: "'DM Sans', sans-serif",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6EE7B7", display: "inline-block", boxShadow: "0 0 8px #6EE7B7" }}/>
          Now live at your campus · Join 2,400+ students
        </div>
      </div>

      {/* Heading */}
      <h1 className="hero-heading animate-fadeUp" style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: "clamp(3.6rem, 8vw, 5.5rem)",
        fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em",
        marginBottom: 24, animationDelay: "0.2s",
      }}>
        <span className="gradient-text">Where Campus</span>
        <br/>
        <span style={{ color: "#E2E8F0" }}>Events Come</span>{" "}
        <span className="gradient-text-brand">Alive</span>
      </h1>

      {/* Sub */}
      <p className="animate-fadeUp" style={{
        fontSize: "clamp(1rem, 2.5vw, 1.2rem)", color: "#94A3B8",
        lineHeight: 1.7, maxWidth: 540, margin: "0 auto 44px",
        fontFamily: "'DM Sans', sans-serif", animationDelay: "0.35s",
      }}>
        Discover, register, and stay updated with all campus events in one elegant platform built for modern students.
      </p>

      {/* CTAs */}
      <div className="hero-ctas animate-fadeUp" style={{ display: "flex", gap: 14, justifyContent: "center", animationDelay: "0.5s" }}>
        <button onClick={() => navigate("/register")} className="btn-primary-glow" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, padding: "15px 36px" }}>
          Get Started
          <Icon name="arrowRight" size={18} color="white" />
        </button>
        <button className="btn-ghost" style={{ fontSize: 16, padding: "15px 36px", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="compass" size={18} color="#94A3B8" />
          Explore Events
        </button>
      </div>

      {/* Social proof */}
      <div className="animate-fadeIn" style={{ animationDelay: "0.7s", marginTop: 56, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", gap: -6 }}>
          {["#6366F1","#8B5CF6","#EC4899","#6EE7B7","#F59E0B"].map((c,i) => (
            <div key={i} style={{
              width: 32, height: 32, borderRadius: "50%",
              background: `linear-gradient(135deg, ${c}, ${c}cc)`,
              border: "2px solid #07091A",
              marginLeft: i === 0 ? 0 : -10,
              boxShadow: `0 2px 8px ${c}66`,
            }}/>
          ))}
        </div>
        <p style={{ color: "#64748B", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
          Trusted by <strong style={{ color: "#94A3B8" }}>2,400+</strong> students across 18 departments
        </p>
      </div>
    </div>

    {/* Bottom gradient fade */}
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: 120,
      background: "linear-gradient(to top, #07091A, transparent)", pointerEvents: "none",
    }}/>
  </section>
);

/* ─── Ticker ─────────────────────────────────────────────────────────────── */
const TickerSection = () => {
  const items = ["Tech Fest 2026", "Cultural Week", "Hackathon", "Sports Day", "Alumni Meet", "Science Expo", "Drama Night", "Career Fair"];
  return (
    <div style={{ overflow: "hidden", padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "relative" }}>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 100,
        background: "linear-gradient(to right, #07091A, transparent)", zIndex: 1,
      }}/>
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 100,
        background: "linear-gradient(to left, #07091A, transparent)", zIndex: 1,
      }}/>
      <div className="ticker-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 16, color: "#475569", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
            <span style={{ color: "#6366F1", fontSize: 8 }}>◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── Features ────────────────────────────────────────────────────────────── */
const features = [
  {
    icon: "compass", label: "Discover Events",
    desc: "Browse curated events from every department in a unified, beautiful feed — filtered by category, date, or interest.",
    gradient: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05))",
    glow: "rgba(99,102,241,0.3)", iconColor: "#818CF8",
  },
  {
    icon: "zap", label: "Easy Registration",
    desc: "One-click registration with instant confirmation. No forms, no friction — just show up and participate.",
    gradient: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))",
    glow: "rgba(139,92,246,0.3)", iconColor: "#A78BFA",
  },
  {
    icon: "filter", label: "Department Filtering",
    desc: "Narrow down events by your department, year, or club. See only what's relevant and exciting to you.",
    gradient: "linear-gradient(135deg, rgba(236,72,153,0.2), rgba(236,72,153,0.05))",
    glow: "rgba(236,72,153,0.3)", iconColor: "#F472B6",
  },
  {
    icon: "bell", label: "Real-time Updates",
    desc: "Never miss a deadline or schedule change. Instant notifications keep you in the loop at every step.",
    gradient: "linear-gradient(135deg, rgba(110,231,183,0.2), rgba(110,231,183,0.05))",
    glow: "rgba(110,231,183,0.3)", iconColor: "#6EE7B7",
  },
];

const FeaturesSection = () => (
  <section id="features" style={{ padding: "100px 24px", position: "relative" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 999, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#A5B4FC", fontSize: 12, fontFamily: "'Outfit', sans-serif", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
          Platform Features
        </div>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 2.8rem)", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 16 }}>
          <span className="gradient-text">Everything you need,</span>
          <br/><span style={{ color: "#E2E8F0" }}>nothing you don't</span>
        </h2>
        <p style={{ color: "#64748B", fontSize: 16, maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>
          Built for students who want to experience more of campus life without the chaos.
        </p>
      </div>

      <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 20 }}>
        {features.map((f, i) => (
          <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="icon-box" style={{ background: f.gradient, boxShadow: `0 8px 24px ${f.glow}` }}>
              <Icon name={f.icon} size={22} color={f.iconColor} />
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 17, color: "#E2E8F0", marginBottom: 10, letterSpacing: "-0.01em" }}>{f.label}</h3>
            <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── How It Works ────────────────────────────────────────────────────────── */
const steps = [
  { num: "01", icon: "search", title: "Browse Events", desc: "Open Eventra and explore all upcoming events from your college. Filter by department, category, or date to find exactly what interests you.", color: "#6366F1" },
  { num: "02", icon: "zap",    title: "Register Easily", desc: "Found something exciting? Hit register and you're done. Get an instant confirmation and a calendar invite automatically.", color: "#8B5CF6" },
  { num: "03", icon: "star",   title: "Attend & Enjoy", desc: "Show up, show your QR pass, and dive into the experience. Collect memories, connect with peers, and track your event history.", color: "#EC4899" },
];

const HowItWorksSection = () => (
  <section id="how-it-works" style={{ padding: "100px 24px", position: "relative" }}>
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      background: "radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 65%)",
    }}/>
    <div style={{ maxWidth: 780, margin: "0 auto", position: "relative" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 999, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", color: "#C4B5FD", fontSize: 12, fontFamily: "'Outfit', sans-serif", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
          How It Works
        </div>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 2.8rem)", letterSpacing: "-0.03em", marginBottom: 16 }}>
          <span style={{ color: "#E2E8F0" }}>Three steps to your</span>
          <br/><span className="gradient-text-brand">next great experience</span>
        </h2>
      </div>

      <div className="steps-grid" style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
        {/* Connecting line */}
        <div style={{
          position: "absolute", left: 53, top: 60, bottom: 60, width: 1,
          background: "linear-gradient(to bottom, rgba(99,102,241,0.4), rgba(236,72,153,0.4))",
          zIndex: 0,
        }}/>
        {steps.map((s, i) => (
          <div key={i} className="step-card" style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              minWidth: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: `linear-gradient(135deg, ${s.color}33, ${s.color}11)`,
              border: `1px solid ${s.color}55`,
              fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 13,
              color: s.color, flexShrink: 0,
            }}>{s.num}</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Icon name={s.icon} size={18} color={s.color} />
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 17, color: "#E2E8F0", letterSpacing: "-0.01em" }}>{s.title}</h3>
              </div>
              <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Stats ───────────────────────────────────────────────────────────────── */
const StatsSection = () => (
  <section style={{ padding: "80px 24px" }}>
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
        gap: 2, borderRadius: 20, overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.02)",
      }}>
        {[
          { val: "2,400+", label: "Active Students", icon: "users" },
          { val: "180+",   label: "Events Hosted",   icon: "calendar" },
          { val: "18",     label: "Departments",      icon: "filter" },
        ].map((s, i) => (
          <div key={i} style={{
            padding: "40px 24px", textAlign: "center",
            borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
            background: "rgba(255,255,255,0.015)",
          }}>
            <div style={{ marginBottom: 12, opacity: 0.5, display: "flex", justifyContent: "center" }}>
              <Icon name={s.icon} size={20} color="#6366F1" />
            </div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 2.8rem)", letterSpacing: "-0.04em" }}>
              <span className="gradient-text-brand">{s.val}</span>
            </div>
            <div style={{ color: "#64748B", fontSize: 14, marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── CTA ─────────────────────────────────────────────────────────────────── */
const CTASection = ({ navigate }) => (
  <section style={{ padding: "100px 24px", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(700px, 90vw)", height: "min(700px, 90vw)",
        background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)",
        filter: "blur(60px)",
      }}/>
      {/* Decorative ring */}
      <div className="animate-rotate" style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500, height: 500,
        border: "1px dashed rgba(99,102,241,0.12)",
        borderRadius: "50%",
      }}/>
      <div className="animate-rotate" style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 350, height: 350,
        border: "1px solid rgba(139,92,246,0.08)",
        borderRadius: "50%",
        animationDirection: "reverse",
      }}/>
    </div>

    <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
      <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "clamp(2.4rem, 6vw, 3.8rem)", letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 20 }}>
        <span style={{ color: "#E2E8F0" }}>Ready to explore</span>
        <br/>
        <span className="gradient-text-brand">campus events?</span>
      </h2>
      <p style={{ color: "#64748B", fontSize: 17, lineHeight: 1.65, marginBottom: 44 }}>
        Join thousands of students already using Eventra to make the most of their college life.
      </p>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => navigate("/register")} className="btn-primary-glow" style={{ fontSize: 17, padding: "16px 44px", display: "inline-flex", alignItems: "center", gap: 10, animation: "glowPulse 3s ease infinite" }}>
          Join Eventra Today
          <Icon name="arrowRight" size={20} color="white" />
        </button>
        <button onClick={() => navigate("/login")} className="btn-ghost" style={{ fontSize: 16, padding: "16px 36px" }}>
          Already a member?
        </button>
      </div>

      {/* trust */}
      <div style={{ marginTop: 40, display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
        {["Free to join", "No credit card", "Instant access"].map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748B", fontSize: 13 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(110,231,183,0.15)", border: "1px solid rgba(110,231,183,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="check" size={10} color="#6EE7B7" />
            </div>
            {t}
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Footer ──────────────────────────────────────────────────────────────── */
const Footer = () => (
  <footer style={{
    borderTop: "1px solid rgba(255,255,255,0.06)",
    padding: "48px 24px 36px",
    background: "rgba(0,0,0,0.2)",
  }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
        {/* brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9,
              background: "linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, color: "#fff",
              fontFamily: "'Outfit', sans-serif",
              boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
            }}>E</div>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, background: "linear-gradient(135deg, #E2E8F0, #A5B4FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Eventra</span>
          </div>
          <p style={{ color: "#475569", fontSize: 14, maxWidth: 220, lineHeight: 1.6 }}>
            Where campus events come alive.
          </p>
        </div>

        {/* links */}
        {[
          { label: "Product", links: ["Features", "How It Works", "For Departments", "Roadmap"] },
          { label: "Support", links: ["Help Center", "Contact Us", "Status", "Privacy Policy"] },
        ].map(col => (
          <div key={col.label}>
            <div style={{ color: "#E2E8F0", fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>{col.label}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {col.links.map(l => (
                <a key={l} href="#" style={{ color: "#475569", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "#94A3B8"}
                  onMouseLeave={e => e.target.style.color = "#475569"}
                >{l}</a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ color: "#334155", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
          © 2026 Eventra · Built for campus, by campus
        </p>
        <p style={{ color: "#334155", fontSize: 13 }}>Made with ♥ for students</p>
      </div>
    </div>
  </footer>
);

/* ─── Main Component ──────────────────────────────────────────────────────── */


function Landing() {
  const navigate = useNavigate(); // ✅ REAL navigation

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ background: "#07091A", minHeight: "100vh", color: "#E2E8F0" }}>
        <Navbar navigate={navigate} />
        <HeroSection navigate={navigate} />
        <TickerSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <CTASection navigate={navigate} />
        <Footer />
      </div>
    </>
  );
}

export default Landing;