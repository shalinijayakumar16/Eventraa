import { useEffect, useState, useCallback } from "react";

/* ─── Styles ────────────────────────────────────────────────────────────── */
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
  @keyframes countdownPulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.7; }
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

  /* ── Buttons ── */
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
  .btn-primary-glow:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(99,102,241,0.55); }
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
  .btn-ghost:hover { background: rgba(255,255,255,0.08); border-color: rgba(99,102,241,0.4); transform: translateY(-1px); }

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
  .btn-logout:hover { background: rgba(239,68,68,0.18); border-color: rgba(239,68,68,0.45); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(239,68,68,0.2); }

  /* ── Search ── */
  .search-input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 10px 14px 10px 40px;
    color: #E2E8F0;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .search-input:focus {
    border-color: rgba(99,102,241,0.6);
    background: rgba(99,102,241,0.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }
  .search-input::placeholder { color: #475569; }

  /* ── Form inputs ── */
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
  .form-input:focus { border-color: rgba(99,102,241,0.6); background: rgba(99,102,241,0.06); box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
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

  /* ── Tabs ── */
  .tab-bar {
    display: flex;
    gap: 4px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 4px;
  }
  .tab-btn {
    padding: 8px 16px;
    border-radius: 10px;
    border: none;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    white-space: nowrap;
    background: transparent;
    color: #64748B;
  }
  .tab-btn:hover { color: #94A3B8; background: rgba(255,255,255,0.04); }
  .tab-btn.active {
    background: linear-gradient(135deg, #6366F1, #8B5CF6);
    color: #fff;
    box-shadow: 0 4px 16px rgba(99,102,241,0.35);
  }

  /* ── Event card ── */
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
  .event-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(99,102,241,0.16), 0 0 0 1px rgba(99,102,241,0.18); border-color: rgba(99,102,241,0.28); }
  .event-card:hover::before { opacity: 1; }

  /* ── Sidebar chips ── */
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
  .my-event-chip:hover { border-color: rgba(99,102,241,0.3); background: rgba(99,102,241,0.06); }

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
    min-width: 140px;
    outline: none;
  }
  .filter-select:focus { border-color: rgba(99,102,241,0.5); background-color: rgba(99,102,241,0.06); }
  .filter-select option { background: #0D1130; }

  /* ── Modal ── */
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
  .modal-box-details {
    background: #0D1130;
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px;
    width: 100%;
    max-width: 540px;
    max-height: 92vh;
    overflow-y: auto;
    animation: modalSlideIn 0.3s ease;
    box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.12);
  }

  /* ── Profile dropdown ── */
  .profile-dropdown {
    position: absolute;
    top: 74px;
    right: 32px;
    background: #0D1130;
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 20px;
    width: 280px;
    z-index: 300;
    box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1);
    animation: modalSlideIn 0.2s ease;
    overflow: hidden;
  }

  /* ── Badge pill ── */
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

  /* ── Stat pill ── */
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

  /* ── Countdown chip ── */
  .countdown-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 8px;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  .countdown-chip.urgent { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25); color: #FCA5A5; animation: countdownPulse 1.5s ease-in-out infinite; }
  .countdown-chip.soon   { background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.25); color: #FCD34D; }
  .countdown-chip.normal { background: rgba(99,102,241,0.10); border: 1px solid rgba(99,102,241,0.22); color: #A5B4FC; }
  .countdown-chip.apply  { background: rgba(236,72,153,0.10); border: 1px solid rgba(236,72,153,0.22); color: #F9A8D4; }

  /* ── Detail meta row ── */
  .detail-meta-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 14px;
    border-radius: 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
  }

  /* ── Empty state ── */
  .empty-state { text-align: center; padding: 80px 24px; color: #475569; grid-column: 1 / -1; }

  @media (max-width: 768px) {
    .events-grid { grid-template-columns: 1fr !important; }
    .stats-row { flex-wrap: wrap !important; }
    .topbar { padding: 0 16px !important; }
    .main-content { padding: 24px 16px 48px !important; }
    .sidebar { display: none !important; }
    .btn-logout span { display: none; }
    .tab-bar { overflow-x: auto; }
    .filters-row { flex-wrap: wrap !important; }
  }
  @media (max-width: 1024px) {
    .events-grid { grid-template-columns: 1fr 1fr !important; }
  }
`;

/* ─── Icons ─────────────────────────────────────────────────────────────── */
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    calendar:   (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
    users:      (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
    map:        (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21,10c0,7-9,13-9,13S3,17,3,10a9,9,0,0,1,18,0z"/><circle cx="12" cy="10" r="3"/></svg>),
    clock:      (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>),
    user:       (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
    logout:     (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>),
    check:      (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>),
    x:          (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
    filter:     (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/></svg>),
    arrowRight: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>),
    info:       (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>),
    tag:        (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>),
    search:     (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
    zap:        (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>),
    list:       (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>),
    star:       (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>),
    trending:   (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></svg>),
  };
  return icons[name] || null;
};

/* ─── Blob Background ────────────────────────────────────────────────────── */
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

/* ─── Type badge colors ──────────────────────────────────────────────────── */
const TYPE_STYLE = {
  Workshop:  { bg: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.3)",  color: "#A5B4FC" },
  Seminar:   { bg: "rgba(236,72,153,0.15)",  border: "rgba(236,72,153,0.3)",  color: "#F9A8D4" },
  Technical: { bg: "rgba(6,182,212,0.15)",   border: "rgba(6,182,212,0.3)",   color: "#67E8F9" },
  Cultural:  { bg: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.3)",  color: "#FCD34D" },
  Sports:    { bg: "rgba(34,197,94,0.15)",   border: "rgba(34,197,94,0.3)",   color: "#86EFAC" },
  Hackathon: { bg: "rgba(168,85,247,0.15)",  border: "rgba(168,85,247,0.3)",  color: "#D8B4FE" },
  Fest:      { bg: "rgba(251,146,60,0.15)",  border: "rgba(251,146,60,0.3)",  color: "#FDBA74" },
  Webinar:   { bg: "rgba(20,184,166,0.15)",  border: "rgba(20,184,166,0.3)",  color: "#5EEAD4" },
  default:   { bg: "rgba(110,231,183,0.15)", border: "rgba(110,231,183,0.3)", color: "#6EE7B7" },
};

/* ─── Countdown helpers ──────────────────────────────────────────────────── */
function getCountdown(targetDate) {
  const diff = new Date(targetDate) - new Date();
  if (diff <= 0) return null;

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0)  return { text: `Starts in ${days}d ${hours}h`, urgency: days <= 1 ? "urgent" : days <= 3 ? "soon" : "normal" };
  if (hours > 0) return { text: `Starts in ${hours}h ${minutes}m`, urgency: "urgent" };
  return { text: `Starts in ${minutes}m`, urgency: "urgent" };
}

function getApplyCountdown(applyBy) {
  if (!applyBy) return null;
  const diff = new Date(applyBy) - new Date();
  if (diff <= 0) return null;

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0)  return { text: `Reg closes in ${days}d`, urgency: days <= 1 ? "urgent" : days <= 3 ? "apply" : "apply" };
  if (hours > 0) return { text: `Reg closes in ${hours}h`, urgency: "urgent" };
  return { text: "Closing soon!", urgency: "urgent" };
}

/* ─── Countdown chip component ───────────────────────────────────────────── */
function CountdownChip({ event }) {
  const [cd, setCd] = useState(() => getCountdown(event.date));
  const [applycd, setApplyCd] = useState(() => getApplyCountdown(event.applyBy));

  useEffect(() => {
    const interval = setInterval(() => {
      setCd(getCountdown(event.date));
      setApplyCd(getApplyCountdown(event.applyBy));
    }, 60000);
    return () => clearInterval(interval);
  }, [event.date, event.applyBy]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {cd && (
        <span className={`countdown-chip ${cd.urgency}`}>
          <Icon name="clock" size={10} color="currentColor" />
          {cd.text}
        </span>
      )}
      {applycd && (
        <span className={`countdown-chip ${applycd.urgency}`}>
          <Icon name="zap" size={10} color="currentColor" />
          {applycd.text}
        </span>
      )}
    </div>
  );
}

/* ─── View Details Modal ─────────────────────────────────────────────────── */
function EventDetailsModal({ event, alreadyJoined, onClose, onRegister }) {
  const typeStyle = TYPE_STYLE[event.type] || TYPE_STYLE.default;
  const isPast    = new Date(event.date) < new Date();

  const metaRows = [
    { icon: "filter",   color: "#6366F1", label: "Department", value: event.department },
    { icon: "calendar", color: "#8B5CF6", label: "Event Date",  value: new Date(event.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
    event.applyBy && { icon: "clock", color: "#F59E0B", label: "Apply By", value: new Date(event.applyBy).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
    event.venue   && { icon: "map",   color: "#EC4899", label: "Venue",    value: event.venue },
    event.type    && { icon: "tag",   color: typeStyle.color, label: "Type", value: event.type },
  ].filter(Boolean);

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box-details">
        {/* Poster / Hero */}
        {event.poster ? (
          <div style={{ position: "relative", height: 220, overflow: "hidden", borderRadius: "24px 24px 0 0" }}>
            <img src={`http://localhost:5000/${event.poster}`} alt="poster" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0D1130 0%, rgba(13,17,48,0.3) 60%, transparent 100%)" }} />
            {isPast && (
              <div style={{ position: "absolute", top: 14, left: 14, padding: "4px 12px", borderRadius: 999, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", fontSize: 11, color: "#94A3B8", fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)" }}>Past Event</div>
            )}
            <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: 9, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="x" size={16} color="#E2E8F0" />
            </button>
          </div>
        ) : (
          <div style={{ position: "relative", height: 140, background: "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(236,72,153,0.10))", borderRadius: "24px 24px 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="calendar" size={40} color="rgba(99,102,241,0.35)" />
            {isPast && <div style={{ position: "absolute", top: 14, left: 14, padding: "4px 12px", borderRadius: 999, background: "rgba(0,0,0,0.3)", fontSize: 11, color: "#64748B", fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "1px solid rgba(255,255,255,0.07)" }}>Past Event</div>}
            <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="x" size={16} color="#94A3B8" />
            </button>
          </div>
        )}

        <div style={{ padding: "22px 28px 28px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, color: "#E2E8F0", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{event.title}</h2>
            <span className="badge-pill" style={{ background: typeStyle.bg, border: `1px solid ${typeStyle.border}`, color: typeStyle.color, marginTop: 3 }}>{event.type}</span>
          </div>

          {/* Countdown in details modal */}
          {!isPast && (
            <div style={{ marginBottom: 14 }}>
              <CountdownChip event={event} />
            </div>
          )}

          {event.description ? (
            <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.7, marginBottom: 20 }}>{event.description}</p>
          ) : (
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>No description provided.</p>
          )}

          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 16 }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {metaRows.map((row, i) => (
              <div key={i} className="detail-meta-row">
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${row.color}18`, border: `1px solid ${row.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={row.icon} size={14} color={row.color} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <span style={{ fontSize: 10, color: "#475569", fontFamily: "'Outfit', sans-serif", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>{row.label}</span>
                  <span style={{ fontSize: 13, color: "#CBD5E1" }}>{row.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-ghost" onClick={onClose} style={{ padding: "11px 20px" }}>Close</button>
            <button
              className="btn-primary-glow"
              style={{ flex: 1, justifyContent: "center", padding: "11px", animation: alreadyJoined ? "none" : "glowPulse 3s ease infinite" }}
              disabled={alreadyJoined || isPast}
              onClick={() => { onClose(); onRegister(); }}
            >
              {alreadyJoined ? (<><Icon name="check" size={14} color="#4ade80" /> Registered</>) : isPast ? <>Event Ended</> : (<>Register Now <Icon name="arrowRight" size={14} color="white" /></>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Tab config ─────────────────────────────────────────────────────────── */
const TABS = [
  { id: "all",        label: "All Events",  icon: "list"     },
  { id: "registered", label: "Registered",  icon: "check"    },
  { id: "upcoming",   label: "Upcoming",    icon: "trending" },
  { id: "completed",  label: "Completed",   icon: "star"     },
];

/* ─── All departments & types ────────────────────────────────────────────── */
const ALL_DEPARTMENTS = ["CSE", "ECE", "EEE", "IT", "MECH", "CIVIL", "CHEM", "BIO", "MBA", "MCA"];
const ALL_TYPES       = ["Workshop", "Seminar", "Technical", "Cultural", "Sports", "Hackathon", "Fest", "Webinar", "Other"];

/* ─── Main Component ─────────────────────────────────────────────────────── */
function StudentDashboard() {
  const [events, setEvents]           = useState([]);
  const [myEvents, setMyEvents]       = useState([]);
  const [user, setUser]               = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // Modals
  const [detailsEvent, setDetailsEvent]   = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formValues, setFormValues]       = useState({});

  // Tabs + filters + search
  const [activeTab, setActiveTab]     = useState("all");
  const [search, setSearch]           = useState("");
  const [department, setDepartment]   = useState("");
  const [type, setType]               = useState("");
  const [dateFilter, setDateFilter]   = useState("");   // ISO date string for "on/after"

  const userId = localStorage.getItem("userId");

  useEffect(() => { fetchEvents(); }, [department, type]);
  useEffect(() => { fetchMyEvents(); fetchUser(); }, []);

  const fetchEvents = async () => {
    try {
      let url = `http://localhost:5000/api/events?`;
      if (department) url += `department=${department}&`;
      if (type)       url += `type=${type}&`;
      if (userId)     url += `userId=${userId}`;
      const res  = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        setEvents([...(data.active || []), ...(data.expired || [])]);
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
          answers: Object.entries(formValues).map(([q, a]) => ({ question: q, answer: a })),
        }),
      });
      alert("Registered successfully 🎉");
      setMyEvents(prev => [...prev, { eventId: selectedEvent._id }]);
      setSelectedEvent(null);
      setFormValues({});
      fetchMyEvents();
    } catch (err) { console.log(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  /* ── Derived: filtered events for current tab ───────────────────────────── */
  const now = new Date();

  const registeredIds = new Set(
    myEvents.map(e => e.eventId?._id || e.eventId)
  );

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const isPast    = eventDate < now;

    // Tab filter
    if (activeTab === "registered" && !registeredIds.has(event._id)) return false;
    if (activeTab === "upcoming"   && isPast)                         return false;
    if (activeTab === "completed"  && !isPast)                        return false;

    // Search
    if (search && !event.title?.toLowerCase().includes(search.toLowerCase())) return false;

    // Date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filterDate.setHours(0, 0, 0, 0);
      const eventDay = new Date(eventDate);
      eventDay.setHours(0, 0, 0, 0);
      if (eventDay < filterDate) return false;
    }

    return true;
  });

  /* ── Stats ───────────────────────────────────────────────────────────────── */
  const totalEvents     = events.length;
  const registeredCount = myEvents.length;
  const upcomingCount   = events.filter(e => new Date(e.date) >= now).length;
  const departmentCount = [...new Set(events.map(e => e.department))].filter(Boolean).length;

  /* ── Tab counts ─────────────────────────────────────────────────────────── */
  const tabCounts = {
    all:        events.length,
    registered: registeredIds.size,
    upcoming:   events.filter(e => new Date(e.date) >= now).length,
    completed:  events.filter(e => new Date(e.date) < now).length,
  };

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ background: "#07091A", minHeight: "100vh", color: "#E2E8F0", position: "relative" }}>
        <BlobBg />

        {/* ── Topbar ── */}
        <header className="topbar" style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(7,9,26,0.85)", backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "0 32px", height: 68,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: "'Outfit', sans-serif",
              boxShadow: "0 4px 16px rgba(99,102,241,0.45)",
            }}>E</div>
            <div>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 19, background: "linear-gradient(135deg, #E2E8F0, #A5B4FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em" }}>Eventra</span>
              <span style={{ color: "#475569", fontSize: 13, marginLeft: 8, fontFamily: "'DM Sans', sans-serif" }}>/ Student</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {user && (
              <div style={{ padding: "6px 14px", borderRadius: 999, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.28)", fontSize: 13, color: "#A5B4FC", fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>
                {user.department}
              </div>
            )}
            <button
              onClick={() => setShowProfile(p => !p)}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #6366F1, #EC4899)",
                border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: showProfile ? "0 0 0 3px rgba(99,102,241,0.4)" : "none",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <Icon name="user" size={17} color="white" />
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              <Icon name="logout" size={15} color="#FCA5A5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* ── Profile Dropdown ── */}
        {showProfile && user && (
          <div className="profile-dropdown">
            <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(236,72,153,0.06))" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #6366F1, #EC4899)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="user" size={20} color="white" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: "#E2E8F0" }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{user.department} · Year {user.year}</div>
                </div>
              </div>
            </div>
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
            {myEvents.length > 0 && (
              <div style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 24, color: "#A5B4FC" }}>{registeredCount}</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>events joined</div>
                </div>
              </div>
            )}
          </aside>

          {/* ── Main Content ── */}
          <main className="main-content" style={{ flex: 1, padding: "40px 36px 60px", maxWidth: "calc(100vw - 260px)" }}>

            {/* Heading */}
            <div className="animate-fadeUp" style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 6 }}>
                <span className="gradient-text">Discover</span>{" "}
                <span style={{ color: "#E2E8F0" }}>Campus Events</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: 15 }}>Browse and register for events happening across all departments</p>
            </div>

            {/* Stats row */}
            <div className="stats-row animate-fadeUp" style={{ display: "flex", gap: 12, marginBottom: 28, animationDelay: "0.08s" }}>
              {[
                { label: "Total Events", val: totalEvents,     icon: "calendar", color: "#6366F1" },
                { label: "Registered",   val: registeredCount, icon: "check",    color: "#EC4899" },
                { label: "Upcoming",     val: upcomingCount,   icon: "trending", color: "#8B5CF6" },
                { label: "Departments",  val: departmentCount, icon: "filter",   color: "#06B6D4" },
              ].map((s, i) => (
                <div key={i} className="stat-pill">
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

            {/* ── TABS ── */}
            <div className="animate-fadeUp" style={{ marginBottom: 22, animationDelay: "0.12s" }}>
              <div className="tab-bar" style={{ overflowX: "auto" }}>
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon name={tab.icon} size={13} color="currentColor" />
                    {tab.label}
                    <span style={{
                      padding: "1px 7px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      background: activeTab === tab.id ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
                      color: activeTab === tab.id ? "#fff" : "#64748B",
                    }}>
                      {tabCounts[tab.id]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── SEARCH + FILTERS ── */}
            <div className="animate-fadeUp" style={{ marginBottom: 24, animationDelay: "0.16s" }}>
              {/* Search bar */}
              <div style={{ position: "relative", marginBottom: 12 }}>
                <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <Icon name="search" size={16} color="#475569" />
                </div>
                <input
                  className="search-input"
                  placeholder="Search events by name…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", opacity: 0.6 }}
                  >
                    <Icon name="x" size={14} color="#94A3B8" />
                  </button>
                )}
              </div>

              {/* Filters row */}
              <div className="filters-row" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748B", fontSize: 13 }}>
                  <Icon name="filter" size={14} color="#64748B" />
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Filter</span>
                </div>

                {/* Department */}
                <select className="filter-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="">All Departments</option>
                  {ALL_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                {/* Type */}
                <select className="filter-select" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">All Types</option>
                  {ALL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                {/* Date from */}
                <div style={{ position: "relative" }}>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      color: dateFilter ? "#CBD5E1" : "#475569",
                      padding: "9px 14px",
                      borderRadius: 10,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      outline: "none",
                      cursor: "pointer",
                      colorScheme: "dark",
                    }}
                  />
                </div>

                {/* Clear filters */}
                {(search || department || type || dateFilter) && (
                  <button
                    className="btn-ghost"
                    onClick={() => { setSearch(""); setDepartment(""); setType(""); setDateFilter(""); }}
                    style={{ fontSize: 12, padding: "8px 14px" }}
                  >
                    <Icon name="x" size={12} color="#94A3B8" />
                    Clear
                  </button>
                )}

                <div style={{ marginLeft: "auto", fontSize: 13, color: "#475569" }}>
                  {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            {/* ── Events Grid ── */}
            <div className="events-grid animate-fadeUp" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, animationDelay: "0.2s" }}>
              {filteredEvents.length === 0 ? (
                <div className="empty-state">
                  <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <Icon name="calendar" size={28} color="#6366F1" />
                  </div>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#64748B", marginBottom: 8 }}>
                    {activeTab === "registered" ? "No registered events yet" :
                     activeTab === "upcoming"   ? "No upcoming events" :
                     activeTab === "completed"  ? "No completed events" :
                     "No events found"}
                  </h3>
                  <p style={{ fontSize: 14 }}>
                    {activeTab === "registered" ? "Register for events to see them here" : "Try adjusting your filters"}
                  </p>
                </div>
              ) : (
                filteredEvents.map((event, idx) => {
                  const alreadyRegistered = registeredIds.has(event._id);
                  const typeStyle = TYPE_STYLE[event.type] || TYPE_STYLE.default;
                  const isPast    = new Date(event.date) < now;

                  return (
                    <div key={event._id} className="event-card" style={{ animationDelay: `${idx * 0.04}s` }}>
                      {/* Poster / placeholder */}
                      {event.poster ? (
                        <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
                          <img src={`http://localhost:5000/${event.poster}`} alt="poster" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(7,9,26,0.7), transparent)" }} />
                          {isPast && <div style={{ position: "absolute", top: 10, right: 10, padding: "3px 10px", borderRadius: 999, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", fontSize: 11, color: "#94A3B8", fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)" }}>Past</div>}
                          {alreadyRegistered && (
                            <div style={{ position: "absolute", top: 10, left: 10, padding: "3px 10px", borderRadius: 999, background: "rgba(74,222,128,0.15)", backdropFilter: "blur(8px)", fontSize: 11, color: "#4ade80", fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "1px solid rgba(74,222,128,0.3)", display: "flex", alignItems: "center", gap: 4 }}>
                              <Icon name="check" size={10} color="#4ade80" /> Registered
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ height: 120, background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(236,72,153,0.08))", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                          <Icon name="calendar" size={32} color="rgba(99,102,241,0.3)" />
                          {isPast && <div style={{ position: "absolute", top: 10, right: 10, padding: "3px 10px", borderRadius: 999, background: "rgba(0,0,0,0.3)", fontSize: 11, color: "#64748B", fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "1px solid rgba(255,255,255,0.07)" }}>Past</div>}
                          {alreadyRegistered && (
                            <div style={{ position: "absolute", top: 10, left: 10, padding: "3px 10px", borderRadius: 999, background: "rgba(74,222,128,0.12)", fontSize: 11, color: "#4ade80", fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "1px solid rgba(74,222,128,0.25)", display: "flex", alignItems: "center", gap: 4 }}>
                              <Icon name="check" size={10} color="#4ade80" /> Registered
                            </div>
                          )}
                        </div>
                      )}

                      {/* Card body */}
                      <div style={{ padding: "18px 18px 14px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                        {/* Title + badge */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: "#E2E8F0", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{event.title}</h3>
                          <span className="badge-pill" style={{ background: typeStyle.bg, border: `1px solid ${typeStyle.border}`, color: typeStyle.color }}>
                            {event.type}
                          </span>
                        </div>

                        {/* Meta */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
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

                        {/* ── Countdown chips ── */}
                        {!isPast && (
                          <div style={{ marginTop: 2 }}>
                            <CountdownChip event={event} />
                          </div>
                        )}

                        {/* ── Buttons ── */}
                        <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8 }}>
                          <button
                            className="btn-ghost"
                            style={{ flex: 1, justifyContent: "center", fontSize: 12, padding: "9px 10px" }}
                            onClick={() => setDetailsEvent(event)}
                          >
                            <Icon name="info" size={13} color="#94A3B8" />
                            Details
                          </button>
                          <button
                            className="btn-primary-glow"
                            style={{ flex: 1, justifyContent: "center", fontSize: 12, padding: "9px 10px" }}
                            disabled={alreadyRegistered || isPast}
                            onClick={() => { setSelectedEvent(event); setFormValues({}); }}
                          >
                            {alreadyRegistered ? (
                              <><Icon name="check" size={13} color="#4ade80" /> Registered</>
                            ) : isPast ? (
                              <>Ended</>
                            ) : (
                              <>Register <Icon name="arrowRight" size={13} color="white" /></>
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

        {/* ── View Details Modal ── */}
        {detailsEvent && (
          <EventDetailsModal
            event={detailsEvent}
            alreadyJoined={registeredIds.has(detailsEvent._id)}
            onClose={() => setDetailsEvent(null)}
            onRegister={() => { setSelectedEvent(detailsEvent); setFormValues({}); setDetailsEvent(null); }}
          />
        )}

        {/* ── Registration Form Modal ── */}
        {selectedEvent && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedEvent(null); }}>
            <div className="modal-box">
              <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 12px", borderRadius: 999, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", fontSize: 11, color: "#A5B4FC", fontFamily: "'Outfit', sans-serif", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>
                    ✨ Event Registration
                  </div>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 19, color: "#E2E8F0", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{selectedEvent.title}</h2>
                </div>
                <button onClick={() => setSelectedEvent(null)} style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  <Icon name="x" size={16} color="#94A3B8" />
                </button>
              </div>

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

              <div style={{ padding: "0 28px 24px", display: "flex", gap: 10 }}>
                <button className="btn-ghost" onClick={() => setSelectedEvent(null)} style={{ padding: "11px 20px" }}>Cancel</button>
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