import { useEffect, useState } from "react";

/* ─── Styles — exact tokens from Landing page ────────────────────────────── */
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
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes blobPulse {
    0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: scale(1); }
    50%       { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: scale(1.06); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes modalSlideIn {
    from { opacity: 0; transform: scale(0.94) translateY(20px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes overlayFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.15); }
    50%       { box-shadow: 0 0 30px rgba(139,92,246,0.6), 0 0 80px rgba(139,92,246,0.25); }
  }

  .animate-fadeUp { animation: fadeUp 0.6s ease both; }
  .animate-fadeIn { animation: fadeIn 0.5s ease both; }
  .animate-blob   { animation: blobPulse 8s ease-in-out infinite; }
  .animate-float  { animation: float 5s ease-in-out infinite; }

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

  /* ── Buttons (same as landing) ── */
  .btn-primary-glow {
    background: linear-gradient(135deg, #6366F1, #8B5CF6);
    color: #fff;
    border: none;
    padding: 11px 24px;
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(99,102,241,0.35);
    letter-spacing: 0.01em;
    white-space: nowrap;
  }
  .btn-primary-glow:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(99,102,241,0.55);
  }
  .btn-primary-glow:active { transform: translateY(0); }
  .btn-primary-glow:disabled {
    background: rgba(255,255,255,0.06);
    color: #4ade80;
    cursor: not-allowed;
    box-shadow: none;
    border: 1px solid rgba(74,222,128,0.2);
    transform: none;
  }

  .btn-ghost {
    background: rgba(255,255,255,0.04);
    color: #CBD5E1;
    border: 1px solid rgba(255,255,255,0.10);
    padding: 10px 20px;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
    white-space: nowrap;
  }
  .btn-ghost:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(99,102,241,0.4);
    transform: translateY(-1px);
  }

  .btn-logout {
    background: rgba(239,68,68,0.08);
    color: #FCA5A5;
    border: 1px solid rgba(239,68,68,0.2);
    padding: 8px 16px;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    transition: background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    white-space: nowrap;
  }
  .btn-logout:hover {
    background: rgba(239,68,68,0.18);
    border-color: rgba(239,68,68,0.45);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(239,68,68,0.2);
  }

  /* ── Form inputs (same as landing's form-input) ── */
  .form-input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 11px 14px;
    color: #E2E8F0;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .form-input:focus {
    border-color: rgba(99,102,241,0.6);
    background: rgba(99,102,241,0.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }
  .form-input::placeholder { color: #475569; }

  .form-label {
    display: block;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #94A3B8;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  /* ── Event card (same pattern as feature-card on landing) ── */
  .event-card {
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .event-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .event-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 48px rgba(99,102,241,0.16), 0 0 0 1px rgba(99,102,241,0.18);
    border-color: rgba(99,102,241,0.28);
  }
  .event-card:hover::before { opacity: 1; }

  /* ── Sidebar my-event chips ── */
  .my-event-chip {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    transition: border-color 0.2s, background 0.2s;
    cursor: default;
  }
  .my-event-chip:hover {
    border-color: rgba(99,102,241,0.3);
    background: rgba(99,102,241,0.06);
  }

  /* ── Filter select ── */
  .filter-select {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    color: #CBD5E1;
    padding: 9px 36px 9px 14px;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2364748B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    transition: border-color 0.2s, background 0.2s;
    min-width: 150px;
    outline: none;
  }
  .filter-select:focus {
    border-color: rgba(99,102,241,0.5);
    background-color: rgba(99,102,241,0.06);
  }
  .filter-select option { background: #0D1130; }

  /* ── Modal overlay (same as landing's dept dashboard) ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(7,9,26,0.82);
    backdrop-filter: blur(10px);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: overlayFadeIn 0.25s ease;
  }
  .modal-box {
    background: #0D1130;
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px;
    width: 100%;
    max-width: 460px;
    max-height: 90vh;
    overflow-y: auto;
    animation: modalSlideIn 0.3s ease;
    box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.12);
  }
  .modal-box::-webkit-scrollbar { width: 3px; }
  .modal-box::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 999px; }

  /* ── Profile dropdown ── */
  .profile-dropdown {
    position: absolute;
    top: 74px;
    right: 32px;
    background: #0D1130;
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 20px;
    padding: 0;
    width: 280px;
    z-index: 300;
    box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1);
    animation: modalSlideIn 0.2s ease;
    overflow: hidden;
  }

  /* ── Dept / type badge pill ── */
  .badge-pill {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* ── Stat pill (same as dept dashboard) ── */
  .stat-pill {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    flex: 1;
    min-width: 130px;
  }

  /* ── Empty state ── */
  .empty-state {
    text-align: center;
    padding: 80px 24px;
    color: #475569;
    grid-column: 1 / -1;
  }

  @media (max-width: 768px) {
    .events-grid { grid-template-columns: 1fr !important; }
    .stats-row { flex-wrap: wrap !important; }
    .topbar { padding: 0 16px !important; }
    .main-content { padding: 24px 16px 48px !important; }
    .sidebar { display: none !important; }
    .btn-logout span { display: none; }
  }
  @media (max-width: 1024px) {
    .events-grid { grid-template-columns: 1fr 1fr !important; }
  }
`;

/* ─── Icons (same set as landing) ─────────────────────────────────────────── */
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    calendar: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
    users:    (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
    map:      (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21,10c0,7-9,13-9,13S3,17,3,10a9,9,0,0,1,18,0z"/><circle cx="12" cy="10" r="3"/></svg>),
    clock:    (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>),
    user:     (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
    logout:   (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>),
    check:    (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>),
    x:        (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
    filter:   (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/></svg>),
    zap:      (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>),
    arrowRight: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>),
    list:     (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>),
  };
  return icons[name] || null;
};

/* ─── Blob Background (exact same as landing) ─────────────────────────────── */
const BlobBg = () => (
  <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    <div className="animate-blob" style={{
      position: "absolute", top: "-10%", left: "-5%",
      width: "55vw", height: "55vw", maxWidth: 600, maxHeight: 600,
      background: "radial-gradient(circle at 40% 40%, rgba(99,102,241,0.13) 0%, rgba(139,92,246,0.07) 40%, transparent 70%)",
      filter: "blur(60px)",
    }}/>
    <div className="animate-blob" style={{
      position: "absolute", top: "30%", right: "-10%",
      width: "45vw", height: "45vw", maxWidth: 500,
      background: "radial-gradient(circle at 60% 60%, rgba(236,72,153,0.1) 0%, transparent 70%)",
      filter: "blur(70px)", animationDelay: "-4s",
    }}/>
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)",
      backgroundSize: "80px 80px",
      maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)",
    }}/>
  </div>
);

/* ─── Type badge colors ────────────────────────────────────────────────────── */
const TYPE_STYLE = {
  Workshop: { bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.3)", color: "#A5B4FC" },
  Seminar:  { bg: "rgba(236,72,153,0.15)", border: "rgba(236,72,153,0.3)", color: "#F9A8D4" },
  default:  { bg: "rgba(110,231,183,0.15)", border: "rgba(110,231,183,0.3)", color: "#6EE7B7" },
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
function StudentDashboard() {
  const [events, setEvents]               = useState([]);
  const [department, setDepartment]       = useState("");
  const [type, setType]                   = useState("");
  const [myEvents, setMyEvents]           = useState([]);
  const [user, setUser]                   = useState(null);
  const [showProfile, setShowProfile]     = useState(false);
  const [showForm, setShowForm]           = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formValues, setFormValues]       = useState({});

  const userId = localStorage.getItem("userId");

  useEffect(() => { fetchEvents(); }, [department, type]);
  useEffect(() => { fetchMyEvents(); fetchUser(); }, []);

  const fetchEvents = async () => {
    try {
      let url = "http://localhost:5000/api/events?";
      if (department) url += `department=${department}&`;
      if (type) url += `type=${type}`;
      if (userId) url += `userId=${userId}`;
      const res  = await fetch(url);
      const data = await res.json();

      // ── FIXED: backend now returns { active, expired } not { upcoming, past }
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        setEvents([
          ...(data.active  || []),
          ...(data.expired || []),
        ]);
      }
    } catch (err) { console.log(err); setEvents([]); }
  };

  const fetchMyEvents = async () => {
    try {
      const res  = await fetch(`http://localhost:5000/api/registrations/my-events/${userId}`);
      const data = await res.json();
      setMyEvents(Array.isArray(data) ? data : []);
    } catch (err) { console.log(err); setMyEvents([]); }
  };

  const fetchUser = async () => {
    try {
      const res  = await fetch(`http://localhost:5000/api/user/${userId}`);
      const data = await res.json();
      setUser(data);
    } catch (err) { console.log(err); }
  };

  const handleSubmitForm = async () => {
  for (let field of selectedEvent.formFields || []) {
    if (field.required && !formValues[field.label]) {
      alert(`${field.label} is required`);
      return;
    }
  }

  try {
    await fetch("http://localhost:5000/api/registrations/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        eventId: selectedEvent._id,
        answers: Object.entries(formValues).map(([q, a]) => ({
          question: q,
          answer: a
        })),
      }),
    });


console.log("REGISTER RESPONSE:");

    alert("Registered successfully 🎉");

    // ✅ STEP 2 FIX — instant UI update
    setMyEvents(prev => [
      ...prev,
      { eventId: selectedEvent._id }
    ]);

    // close modal
    setShowForm(false);
    setSelectedEvent(null);
    setFormValues({});

    // sync with backend
    fetchMyEvents();

  } catch (err) {
    console.log(err);
  }
};
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  // ── FIXED: derive counts from the single source of truth ─────────────────
  const totalEvents      = events.length;
  const registeredCount  = myEvents.length;
  const departmentCount  = [...new Set(events.map(e => e.department))].filter(Boolean).length;

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ background: "#07091A", minHeight: "100vh", color: "#E2E8F0", position: "relative" }}>
        <BlobBg />

        {/* ── Topbar (same glass style as landing navbar) ── */}
        <header className="topbar" style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(7,9,26,0.85)", backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "0 32px", height: 68,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Logo — identical to landing */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 800, color: "#fff",
              fontFamily: "'Outfit', sans-serif",
              boxShadow: "0 4px 16px rgba(99,102,241,0.45)",
            }}>E</div>
            <div>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 19, background: "linear-gradient(135deg, #E2E8F0, #A5B4FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em" }}>Eventra</span>
              <span style={{ color: "#475569", fontSize: 13, marginLeft: 8, fontFamily: "'DM Sans', sans-serif" }}>/ Student</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* User dept pill */}
            {user && (
              <div style={{ padding: "6px 14px", borderRadius: 999, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.28)", fontSize: 13, color: "#A5B4FC", fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>
                {user.department}
              </div>
            )}
            {/* Profile avatar */}
            <button
              onClick={() => setShowProfile(p => !p)}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #6366F1, #EC4899)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: showProfile ? "0 0 0 3px rgba(99,102,241,0.4)" : "none",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <Icon name="user" size={17} color="white" />
            </button>
            {/* Logout */}
            <button className="btn-logout" onClick={handleLogout}>
              <Icon name="logout" size={15} color="#FCA5A5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* ── Profile Dropdown ── */}
        {showProfile && user && (
          <div className="profile-dropdown">
            {/* Header gradient strip */}
            <div style={{
              padding: "20px 20px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(236,72,153,0.06))",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366F1, #EC4899)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0,
                }}>
                  <Icon name="user" size={20} color="white" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: "#E2E8F0" }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{user.department} · Year {user.year}</div>
                </div>
              </div>
            </div>
            {/* Info rows */}
            <div style={{ padding: "12px 20px 16px" }}>
              {[["Register No", user.registerNo], ["Email", user.email]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: 12, color: "#64748B", fontFamily: "'Outfit', sans-serif", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{k}</span>
                  <span style={{ fontSize: 13, color: "#CBD5E1" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Page Layout ── */}
        <div style={{ display: "flex", position: "relative", zIndex: 1 }} onClick={() => showProfile && setShowProfile(false)}>

          {/* ── Sidebar ── */}
          <aside className="sidebar" style={{
            width: 260, flexShrink: 0,
            borderRight: "1px solid rgba(255,255,255,0.06)",
            padding: "32px 18px",
            display: "flex", flexDirection: "column", gap: 8,
            minHeight: "calc(100vh - 68px)",
            position: "sticky", top: 68,
            alignSelf: "flex-start",
          }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#475569", marginBottom: 10, paddingLeft: 4 }}>
              My Registrations
            </div>

            {myEvents.length === 0 ? (
              <div style={{ padding: "20px 12px", color: "#475569", fontSize: 13, fontStyle: "italic", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
                No registrations yet
              </div>
            ) : (
              myEvents.map((e) => (
                <div className="my-event-chip" key={e._id}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#6EE7B7", flexShrink: 0, boxShadow: "0 0 6px #6EE7B7" }} />
                  <span style={{ fontSize: 13, color: "#CBD5E1", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3 }}>
                    {e.eventId?.title}
                  </span>
                </div>
              ))
            )}

            {/* Stats at bottom of sidebar */}
            {myEvents.length > 0 && (
              <div style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)", textAlign: "center" }}>
                  {/* ── FIXED: uses registeredCount ── */}
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 24, color: "#A5B4FC" }}>{registeredCount}</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>events joined</div>
                </div>
              </div>
            )}
          </aside>

          {/* ── Main Content ── */}
          <main className="main-content" style={{ flex: 1, padding: "40px 36px 60px", maxWidth: "calc(100vw - 260px)" }}>

            {/* Page title */}
            <div className="animate-fadeUp" style={{ marginBottom: 32 }}>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 6 }}>
                <span className="gradient-text">Discover</span>{" "}
                <span style={{ color: "#E2E8F0" }}>Campus Events</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>
                Browse and register for events happening across all departments
              </p>
            </div>

            {/* ── Stats row — FIXED: uses derived counts ── */}
            <div className="stats-row animate-fadeUp" style={{ display: "flex", gap: 12, marginBottom: 28, animationDelay: "0.1s" }}>
              {[
                { label: "Total Events", val: totalEvents,     icon: "calendar", color: "#6366F1" },
                { label: "Registered",   val: registeredCount, icon: "check",    color: "#EC4899" },
                { label: "Departments",  val: departmentCount, icon: "filter",   color: "#8B5CF6" },
              ].map((s, i) => (
                <div key={i} className="stat-pill" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={s.icon} size={16} color={s.color} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: "#E2E8F0", lineHeight: 1 }}>{s.val}</div>
                    <div style={{ color: "#64748B", fontSize: 12, marginTop: 2 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="animate-fadeUp" style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap", alignItems: "center", animationDelay: "0.15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748B", fontSize: 13 }}>
                <Icon name="filter" size={14} color="#64748B" />
              </div>
              <select className="filter-select" onChange={(e) => setDepartment(e.target.value)}>
                <option value="">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
              </select>
              <select className="filter-select" onChange={(e) => setType(e.target.value)}>
                <option value="">All Types</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
              </select>
              {/* ── FIXED: uses totalEvents ── */}
              <div style={{ marginLeft: "auto", fontSize: 13, color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
                {totalEvents} event{totalEvents !== 1 ? "s" : ""} found
              </div>
            </div>

            {/* Events Grid */}
            <div className="events-grid animate-fadeUp" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, animationDelay: "0.2s" }}>
              {events.length === 0 ? (
                <div className="empty-state">
                  <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <Icon name="calendar" size={28} color="#6366F1" />
                  </div>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#64748B", marginBottom: 8 }}>No events found</h3>
                  <p style={{ fontSize: 14 }}>Try adjusting your filters</p>
                </div>
              ) : (
                events.map((event, idx) => {
                  const alreadyRegistered = myEvents.some(
  (e) => (e.eventId?._id || e.eventId) === event._id
);
                  const typeStyle = TYPE_STYLE[event.type] || TYPE_STYLE.default;
                  const isPast = new Date(event.date) < new Date();

                  return (
                    <div key={event._id} className="event-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                      {/* Poster / placeholder */}
                      {event.poster ? (
                        <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
                          <img src={`http://localhost:5000/${event.poster}`} alt="poster" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(7,9,26,0.7), transparent)" }} />
                          {isPast && <div style={{ position: "absolute", top: 10, right: 10, padding: "3px 10px", borderRadius: 999, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", fontSize: 11, color: "#94A3B8", fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)" }}>Past</div>}
                        </div>
                      ) : (
                        <div style={{ height: 120, background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(236,72,153,0.08))", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                          <Icon name="calendar" size={32} color="rgba(99,102,241,0.3)" />
                          {isPast && <div style={{ position: "absolute", top: 10, right: 10, padding: "3px 10px", borderRadius: 999, background: "rgba(0,0,0,0.3)", fontSize: 11, color: "#64748B", fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "1px solid rgba(255,255,255,0.07)" }}>Past</div>}
                        </div>
                      )}

                      {/* Card body */}
                      <div style={{ padding: "18px 18px 14px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                        {/* Title + badge */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: "#E2E8F0", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{event.title}</h3>
                          <span className="badge-pill" style={{ background: typeStyle.bg, border: `1px solid ${typeStyle.border}`, color: typeStyle.color }}>
                            {event.type}
                          </span>
                        </div>

                        {/* Meta */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#94A3B8", fontSize: 13 }}>
                            <Icon name="filter" size={13} color="#6366F1" />
                            {event.department}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#94A3B8", fontSize: 13 }}>
                            <Icon name="calendar" size={13} color="#8B5CF6" />
                            {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                          {event.applyBy && (
                            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#94A3B8", fontSize: 13 }}>
                              <Icon name="clock" size={13} color="#F59E0B" />
                              Apply by {new Date(event.applyBy).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </div>
                          )}
                          {event.venue && (
                            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#94A3B8", fontSize: 13 }}>
                              <Icon name="map" size={13} color="#EC4899" />
                              {event.venue}
                            </div>
                          )}
                        </div>

                        {/* Register button */}
                        <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                          <button
                            className="btn-primary-glow"
                            style={{ width: "100%", justifyContent: "center", fontSize: 13, padding: "10px" }}
                            disabled={alreadyRegistered}
                            onClick={() => { setSelectedEvent(event); setFormValues({}); setShowForm(true); }}
                          >
                            {alreadyRegistered ? (
                              <><Icon name="check" size={14} color="#4ade80" /> Registered</>
                            ) : (
                              <>Register Now <Icon name="arrowRight" size={14} color="white" /></>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </main>
        </div>

        {/* ── Registration Modal ── */}
        {showForm && selectedEvent && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
            <div className="modal-box">
              {/* Header */}
              <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 12px", borderRadius: 999, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", fontSize: 11, color: "#A5B4FC", fontFamily: "'Outfit', sans-serif", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>
                    ✨ Event Registration
                  </div>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 19, color: "#E2E8F0", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                    {selectedEvent.title}
                  </h2>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                >
                  <Icon name="x" size={16} color="#94A3B8" />
                </button>
              </div>

              {/* Fields */}
              <div style={{ padding: "20px 28px" }}>
                {selectedEvent.formFields?.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {selectedEvent.formFields.map((field, i) => (
                      <div key={i}>
                        <label className="form-label">{field.label}{field.required ? " *" : ""}</label>
                        <input
                          className="form-input"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          type={field.type}
                          required={field.required}
                          onChange={(e) => setFormValues({ ...formValues, [field.label]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: "16px", borderRadius: 12, background: "rgba(110,231,183,0.06)", border: "1px solid rgba(110,231,183,0.15)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon name="check" size={16} color="#6EE7B7" />
                    <p style={{ color: "#94A3B8", fontSize: 14 }}>No additional details required. Just confirm to register!</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ padding: "0 28px 24px", display: "flex", gap: 10 }}>
                <button className="btn-ghost" onClick={() => setShowForm(false)} style={{ padding: "11px 20px" }}>Cancel</button>
                <button className="btn-primary-glow" onClick={handleSubmitForm} style={{ flex: 1, justifyContent: "center", padding: "11px", animation: "glowPulse 3s ease infinite" }}>
                  <Icon name="check" size={15} color="white" />
                  Confirm Registration
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default StudentDashboard;