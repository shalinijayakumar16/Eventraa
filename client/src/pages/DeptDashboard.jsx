import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Styles matching Landing page ──────────────────────────────────────── */
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
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.15); }
    50%       { box-shadow: 0 0 30px rgba(139,92,246,0.6), 0 0 80px rgba(139,92,246,0.25); }
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

  .btn-primary {
    background: linear-gradient(135deg, #6366F1, #8B5CF6);
    color: #fff;
    border: none;
    padding: 12px 28px;
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(99,102,241,0.35);
    letter-spacing: 0.01em;
    white-space: nowrap;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(99,102,241,0.55);
  }
  .btn-primary:active { transform: translateY(0); }

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

  .btn-danger {
    background: rgba(239,68,68,0.1);
    color: #FCA5A5;
    border: 1px solid rgba(239,68,68,0.25);
    padding: 8px 16px;
    border-radius: 9px;
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
  .btn-danger:hover {
    background: rgba(239,68,68,0.2);
    border-color: rgba(239,68,68,0.45);
    transform: translateY(-1px);
  }

  /* View Registrations button */
  .btn-regs {
    background: rgba(236,72,153,0.08);
    color: #F9A8D4;
    border: 1px solid rgba(236,72,153,0.22);
    padding: 8px 14px;
    border-radius: 9px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    white-space: nowrap;
  }
  .btn-regs:hover {
    background: rgba(236,72,153,0.16);
    border-color: rgba(236,72,153,0.42);
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(236,72,153,0.18);
  }
  .btn-regs:active { transform: translateY(0); }

  /* Logout button */
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
    letter-spacing: 0.01em;
  }
  .btn-logout:hover {
    background: rgba(239,68,68,0.18);
    border-color: rgba(239,68,68,0.45);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(239,68,68,0.2);
  }
  .btn-logout:active { transform: translateY(0); }

  /* Export Excel button */
  .btn-export {
    background: linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.1));
    color: #6EE7B7;
    border: 1px solid rgba(34,197,94,0.3);
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
  .btn-export:hover {
    background: linear-gradient(135deg, rgba(34,197,94,0.25), rgba(16,185,129,0.18));
    border-color: rgba(34,197,94,0.5);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(34,197,94,0.2);
  }
  .btn-export:active { transform: translateY(0); }
  .btn-export:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .event-card {
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
    position: relative;
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
  .form-input[type="file"] { cursor: pointer; padding: 9px 14px; }
  .form-input[type="file"]::-webkit-file-upload-button {
    background: linear-gradient(135deg, #6366F1, #8B5CF6);
    color: white;
    border: none;
    border-radius: 7px;
    padding: 5px 12px;
    font-size: 12px;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    cursor: pointer;
    margin-right: 10px;
  }

  .form-label {
    display: block;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #94A3B8;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  /* View toggle tabs */
  .view-tabs {
    display: flex;
    gap: 6px;
    padding: 5px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    width: fit-content;
    margin-bottom: 28px;
  }
  .view-tab {
    padding: 8px 20px;
    border-radius: 10px;
    border: none;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }
  .view-tab.active {
    background: linear-gradient(135deg, #6366F1, #8B5CF6);
    color: #fff;
    box-shadow: 0 4px 14px rgba(99,102,241,0.4);
  }
  .view-tab.inactive {
    background: transparent;
    color: #64748B;
  }
  .view-tab.inactive:hover {
    background: rgba(255,255,255,0.06);
    color: #94A3B8;
  }

  /* Overlay + modal animation */
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
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    animation: modalSlideIn 0.3s ease;
    box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.12);
  }
  .modal-box::-webkit-scrollbar { width: 3px; }
  .modal-box::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 999px; }

  /* Wider modal for registrations */
  .modal-box-wide {
    background: #0D1130;
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px;
    width: 100%;
    max-width: 680px;
    max-height: 90vh;
    overflow-y: auto;
    animation: modalSlideIn 0.3s ease;
    box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(236,72,153,0.1);
  }
  .modal-box-wide::-webkit-scrollbar { width: 3px; }
  .modal-box-wide::-webkit-scrollbar-thumb { background: rgba(236,72,153,0.4); border-radius: 999px; }

  /* Registration entry card */
  .reg-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 16px 18px;
    transition: border-color 0.2s;
  }
  .reg-card:hover {
    border-color: rgba(236,72,153,0.2);
  }

  /* Profile field grid inside reg card */
  .profile-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .profile-field {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 10px;
    padding: 10px 14px;
  }
  .profile-field-key {
    font-size: 10px;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 4px;
  }
  .profile-field-val {
    font-size: 14px;
    color: #E2E8F0;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
  }

  /* Collapsible answers summary */
  .answers-summary {
    cursor: pointer;
    font-size: 12px;
    color: #64748B;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    padding: 5px 10px;
    border-radius: 7px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    list-style: none;
    user-select: none;
    transition: background 0.2s, color 0.2s;
  }
  .answers-summary:hover { background: rgba(255,255,255,0.06); color: #94A3B8; }
  .answers-summary::-webkit-details-marker { display: none; }

  /* Answer pill row */
  .answer-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 7px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .answer-row:last-child { border-bottom: none; padding-bottom: 0; }

  .stat-pill {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .stat-pill:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(99,102,241,0.3);
  }
  .stat-pill.active {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.07);
    box-shadow: 0 0 0 1px rgba(99,102,241,0.2);
  }

  .empty-state {
    text-align: center;
    padding: 80px 24px;
    color: #475569;
  }

  /* Dept badge on "All Events" cards */
  .dept-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    background: rgba(139,92,246,0.15);
    border: 1px solid rgba(139,92,246,0.3);
    color: #C4B5FD;
    margin-bottom: 6px;
  }

  /* Form field row inside modal */
  .field-row {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    gap: 8px;
    align-items: center;
  }
  .field-select {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 11px 10px;
    color: #E2E8F0;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .field-select:focus {
    border-color: rgba(99,102,241,0.6);
    background: rgba(99,102,241,0.06);
  }
  .field-select option { background: #0D1130; }

  .req-toggle {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 10px;
    border-radius: 9px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    white-space: nowrap;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #64748B;
    user-select: none;
  }
  .req-toggle.active {
    background: rgba(99,102,241,0.12);
    border-color: rgba(99,102,241,0.35);
    color: #A5B4FC;
  }
  .req-toggle:hover { background: rgba(255,255,255,0.06); }

  .btn-remove-field {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    flex-shrink: 0;
    padding: 0;
  }
  .btn-remove-field:hover {
    background: rgba(239,68,68,0.18);
    border-color: rgba(239,68,68,0.4);
  }

  @media (max-width: 768px) {
    .events-grid { grid-template-columns: 1fr !important; }
    .stats-row { flex-direction: column !important; }
    .dash-header { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
    .topbar-right { gap: 8px !important; }
    .btn-logout span { display: none; }
    .field-row { grid-template-columns: 1fr; }
    .card-actions { flex-wrap: wrap !important; }
    .profile-grid { grid-template-columns: 1fr !important; }
    .regs-header-right { flex-wrap: wrap !important; }
  }
  @media (max-width: 1024px) {
    .events-grid { grid-template-columns: 1fr 1fr !important; }
  }
`;

/* ─── Icons ─────────────────────────────────────────────────────────────── */
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    plus: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
    edit: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
    trash: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/><path d="M10,11v6"/><path d="M14,11v6"/><path d="M9,6V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V6"/></svg>),
    calendar: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
    map: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21,10c0,7-9,13-9,13S3,17,3,10a9,9,0,0,1,18,0z"/><circle cx="12" cy="10" r="3"/></svg>),
    x: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
    image: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>),
    zap: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>),
    check: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>),
    globe: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>),
    user: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
    logout: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>),
    list: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>),
    users: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
    inbox: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>),
    clock: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>),
    download: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>),
  };
  return icons[name] || null;
};

/* ─── Blob Background ─────────────────────────────────────────────────────── */
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

/* ─── Main Component ─────────────────────────────────────────────────────── */
function DeptDashboard() {
  const navigate = useNavigate();

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [view, setView] = useState("my");
  const [exportLoading, setExportLoading] = useState(false);

  const [form, setForm] = useState({ title: "", description: "", date: "", venue: "", applyBy: "" });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [formFields, setFormFields] = useState([]);

  const [registrations, setRegistrations] = useState([]);
  const [showRegs, setShowRegs] = useState(false);
  const [regsLoading, setRegsLoading] = useState(false);
  const [regsEventTitle, setRegsEventTitle] = useState("");

  const [eventFilter, setEventFilter] = useState("all");

  const dept = localStorage.getItem("deptId");

  /* ── Form field helpers ──────────────────────────────────────────────────── */
  const addFormField = () =>
    setFormFields(prev => [...prev, { label: "", type: "text", required: false }]);

  const updateFormField = (index, key, value) => {
    setFormFields(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const removeFormField = (index) =>
    setFormFields(prev => prev.filter((_, i) => i !== index));

  /* ── Logout ──────────────────────────────────────────────────────────────── */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("deptId");
    navigate("/dept-login");
  };

  const fetchEvents = async () => {
    try {
      const url = view === "my"
        ? `http://localhost:5000/api/events/dept/${dept}`
        : `http://localhost:5000/api/events`;
      const res = await fetch(url);
      const data = await res.json();
      setUpcomingEvents(Array.isArray(data.active) ? data.active : []);
      setPastEvents(Array.isArray(data.expired) ? data.expired : []);
    } catch (err) {
      console.log(err);
      setUpcomingEvents([]);
      setPastEvents([]);
    }
  };

  useEffect(() => { fetchEvents(); }, [view]);
  useEffect(() => { setEventFilter("all"); }, [view]);

  const deleteEvent = async (id) => {
    await fetch(`http://localhost:5000/api/events/${id}`, { method: "DELETE" });
    fetchEvents();
  };

  /* ── Registrations ───────────────────────────────────────────────────────── */
  const viewRegistrations = async (eventId, eventTitle) => {
    setRegsLoading(true);
    setRegsEventTitle(eventTitle || "Event");
    setShowRegs(true);
    try {
      const res = await fetch(`http://localhost:5000/api/event-registrations/${eventId}`);
      const data = await res.json();
      setRegistrations(data);
    } catch (err) {
      setRegistrations([]);
    } finally {
      setRegsLoading(false);
    }
  };

  const closeRegs = () => {
    setShowRegs(false);
    setRegistrations([]);
    setRegsEventTitle("");
  };

  /* ── Export to Excel ─────────────────────────────────────────────────────── */
  const exportRegistrations = async () => {
    if (!registrations.length || exportLoading) return;
    setExportLoading(true);
    try {
      // Collect all unique answer question keys across all registrants
      const allQuestions = [
        ...new Set(
          registrations.flatMap(r => (r.answers || []).map(a => a.question))
        ),
      ];

      // Build flat row objects: core fields first, then dynamic answer columns
      const rows = registrations.map((r, i) => {
        const row = {
          "#": i + 1,
          "Name": r.name || "",
          "Register No": r.registerNo || "",
          "Department": r.department || "",
          "Year": r.year || "",
          "Submitted At": r.submittedAt
            ? new Date(r.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
            : "",
        };
        allQuestions.forEach(q => {
          const found = (r.answers || []).find(a => a.question === q);
          row[q] = found ? (found.answer || "") : "";
        });
        return row;
      });

      // Dynamically import SheetJS (no install needed)
      const XLSX = await import("https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs");
      const ws = XLSX.utils.json_to_sheet(rows);

      // Auto-width columns
      const colWidths = Object.keys(rows[0] || {}).map(key => ({
        wch: Math.max(key.length, ...rows.map(r => String(r[key] || "").length)) + 2,
      }));
      ws["!cols"] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Registrations");
      XLSX.writeFile(wb, `${regsEventTitle.replace(/\s+/g, "_")}_registrations.xlsx`);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  /* ── Submit (create / edit) ──────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.applyBy && form.date && new Date(form.applyBy) > new Date(form.date)) {
      alert("Apply By date cannot be after Event Date");
      return;
    }

    setSaveLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("date", form.date);
      formData.append("venue", form.venue);
      formData.append("applyBy", form.applyBy);
      formData.append("department", dept);
      if (file) formData.append("poster", file);
      formData.append("formFields", JSON.stringify(formFields));

      if (editingEvent) {
        await fetch(`http://localhost:5000/api/events/${editingEvent._id}`, { method: "PUT", body: formData });
      } else {
        await fetch("http://localhost:5000/api/events", { method: "POST", body: formData });
      }

      setShowForm(false);
      setEditingEvent(null);
      setForm({ title: "", description: "", date: "", venue: "", applyBy: "" });
      setFile(null);
      setFileName("");
      setFormFields([]);
      fetchEvents();
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
      venue: event.venue,
      applyBy: event.applyBy ? event.applyBy.split("T")[0] : "",
    });
    setFile(null);
    setFileName("");
    setFormFields(event.formFields || []);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditingEvent(null);
    setForm({ title: "", description: "", date: "", venue: "", applyBy: "" });
    setFile(null);
    setFileName("");
    setFormFields([]);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setFormFields([]);
  };

  /* ── Derive display list from filter ────────────────────────────────────── */
  let displayEvents = [];
  if (eventFilter === "upcoming") displayEvents = upcomingEvents;
  else if (eventFilter === "past")  displayEvents = pastEvents;
  else                              displayEvents = [...upcomingEvents, ...pastEvents];

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ background: "#07091A", minHeight: "100vh", color: "#E2E8F0", position: "relative" }}>
        <BlobBg />

        {/* ── Topbar ── */}
        <header style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(7,9,26,0.85)", backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "0 32px", height: 68,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 800, color: "#fff",
              fontFamily: "'Outfit', sans-serif",
              boxShadow: "0 4px 16px rgba(99,102,241,0.45)",
              flexShrink: 0,
            }}>E</div>
            <div>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 19, background: "linear-gradient(135deg, #E2E8F0, #A5B4FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em" }}>Eventra</span>
              <span style={{ color: "#475569", fontSize: 13, marginLeft: 8, fontFamily: "'DM Sans', sans-serif" }}>/ Dashboard</span>
            </div>
          </div>

          <div className="topbar-right" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              padding: "6px 14px", borderRadius: 999,
              background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.28)",
              fontSize: 13, color: "#A5B4FC", fontFamily: "'Outfit', sans-serif", fontWeight: 600,
            }}>
              {dept}
            </div>

            {view === "my" && (
              <button className="btn-primary" onClick={openCreate} style={{ padding: "9px 20px", fontSize: 13 }}>
                <Icon name="plus" size={15} color="white" />
                New Event
              </button>
            )}

            <button className="btn-logout" onClick={handleLogout}>
              <Icon name="logout" size={15} color="#FCA5A5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* ── Page body ── */}
        <main style={{ position: "relative", zIndex: 1, padding: "40px 32px 60px", maxWidth: 1200, margin: "0 auto" }}>

          <div className="dash-header animate-fadeUp" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
            <div>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.5rem)", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 6 }}>
                {view === "my" ? (
                  <>
                    <span className="gradient-text">{dept}</span>{" "}
                    <span style={{ color: "#E2E8F0" }}>Events</span>
                  </>
                ) : (
                  <span className="gradient-text">All Department Events</span>
                )}
              </h1>
              <p style={{ color: "#64748B", fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>
                {view === "my"
                  ? "Manage and publish events for your department"
                  : "Browse events across all departments"}
              </p>
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="stats-row animate-fadeUp" style={{ display: "flex", gap: 14, marginBottom: 32, animationDelay: "0.1s", flexWrap: "wrap" }}>
            {[
              { label: "Total Events", val: upcomingEvents.length + pastEvents.length, filter: "all",      icon: "calendar", color: "#6366F1" },
              { label: "Upcoming",     val: upcomingEvents.length,                      filter: "upcoming", icon: "zap",      color: "#8B5CF6" },
              { label: "Past Events",  val: pastEvents.length,                          filter: "past",     icon: "clock",    color: "#EC4899" },
            ].map((s, i) => (
              <div
                key={i}
                className={`stat-pill${eventFilter === s.filter ? " active" : ""}`}
                onClick={() => setEventFilter(s.filter)}
                style={{ flex: 1, minWidth: 160, animationDelay: `${i * 0.07}s` }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: `rgba(99,102,241,0.15)`, border: `1px solid rgba(99,102,241,0.3)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={s.icon} size={17} color={s.color} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, color: "#E2E8F0", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ color: "#64748B", fontSize: 12, marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* View toggle tabs */}
          <div className="view-tabs animate-fadeUp" style={{ animationDelay: "0.15s" }}>
            <button
              className={`view-tab ${view === "my" ? "active" : "inactive"}`}
              onClick={() => setView("my")}
            >
              <Icon name="user" size={14} color={view === "my" ? "#fff" : "#64748B"} />
              My Events
            </button>
            <button
              className={`view-tab ${view === "all" ? "active" : "inactive"}`}
              onClick={() => setView("all")}
            >
              <Icon name="globe" size={14} color={view === "all" ? "#fff" : "#64748B"} />
              All Events
            </button>
          </div>

          {/* ── Events grid ── */}
          {loading ? (
            <div style={{ textAlign: "center", padding: 80, color: "#475569" }}>
              <div style={{ width: 40, height: 40, border: "2px solid rgba(99,102,241,0.3)", borderTopColor: "#6366F1", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
              Loading events...
            </div>
          ) : displayEvents.length === 0 ? (
            <div className="empty-state animate-fadeIn">
              <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Icon name="calendar" size={28} color="#6366F1" />
              </div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 20, color: "#94A3B8", marginBottom: 8 }}>
                {eventFilter === "upcoming" ? "No upcoming events" : eventFilter === "past" ? "No past events" : view === "my" ? "No events yet" : "No events found"}
              </h3>
              <p style={{ marginBottom: 24, fontSize: 14 }}>
                {eventFilter !== "all"
                  ? <button className="btn-ghost" onClick={() => setEventFilter("all")} style={{ margin: "0 auto" }}>Show all events</button>
                  : view === "my" ? "Create your first event to get started" : "No departments have posted events yet"
                }
              </p>
              {view === "my" && eventFilter === "all" && (
                <button className="btn-primary" onClick={openCreate}>
                  <Icon name="plus" size={16} color="white" />
                  Create Event
                </button>
              )}
            </div>
          ) : (
            <div className="events-grid animate-fadeUp" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, animationDelay: "0.2s" }}>
              {displayEvents.map((ev, idx) => {
                const isPast = new Date(ev.date) < new Date();
                return (
                  <div key={ev._id} className="event-card" style={{ animationDelay: `${idx * 0.06}s` }}>
                    {/* Poster */}
                    {ev.poster ? (
                      <div style={{ position: "relative", overflow: "hidden", height: 180 }}>
                        <img
                          src={`http://localhost:5000/${ev.poster}`}
                          alt="poster"
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(7,9,26,0.7), transparent)" }} />
                        {isPast && (
                          <div style={{ position: "absolute", top: 12, right: 12, padding: "3px 10px", borderRadius: 999, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", fontSize: 11, color: "#94A3B8", fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)" }}>Past</div>
                        )}
                      </div>
                    ) : (
                      <div style={{ height: 140, background: `linear-gradient(135deg, rgba(99,102,241,0.15), rgba(236,72,153,0.08))`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <Icon name="image" size={36} color="rgba(99,102,241,0.3)" />
                        {isPast && (
                          <div style={{ position: "absolute", top: 12, right: 12, padding: "3px 10px", borderRadius: 999, background: "rgba(0,0,0,0.3)", fontSize: 11, color: "#64748B", fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "1px solid rgba(255,255,255,0.07)" }}>Past</div>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div style={{ padding: "20px 20px 16px" }}>
                      {view === "all" && ev.department && (
                        <div className="dept-badge">{ev.department}</div>
                      )}
                      <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 17, color: "#E2E8F0", marginBottom: 8, letterSpacing: "-0.01em", lineHeight: 1.3 }}>{ev.title}</h3>
                      <p style={{ color: "#64748B", fontSize: 13, lineHeight: 1.6, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{ev.description}</p>

                      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 18 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", fontSize: 13 }}>
                          <Icon name="calendar" size={14} color="#6366F1" />
                          {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                        {ev.applyBy && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", fontSize: 13 }}>
                            <Icon name="clock" size={14} color="#F59E0B" />
                            Apply by {new Date(ev.applyBy).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                        )}
                        {ev.venue && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", fontSize: 13 }}>
                            <Icon name="map" size={14} color="#8B5CF6" />
                            {ev.venue}
                          </div>
                        )}
                        {ev.formFields && ev.formFields.length > 0 && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", fontSize: 13 }}>
                            <Icon name="list" size={14} color="#EC4899" />
                            {ev.formFields.length} registration field{ev.formFields.length !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>

                      {view === "my" && (
                        <div className="card-actions" style={{ display: "flex", gap: 8, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" }}>
                          <button className="btn-ghost" onClick={() => handleEdit(ev)} style={{ flex: 1, justifyContent: "center", minWidth: 0 }}>
                            <Icon name="edit" size={14} color="#94A3B8" />
                            Edit
                          </button>
                          <button className="btn-danger" onClick={() => deleteEvent(ev._id)} style={{ flex: 1, justifyContent: "center", minWidth: 0 }}>
                            <Icon name="trash" size={14} color="#FCA5A5" />
                            Delete
                          </button>
                          <button
                            className="btn-regs"
                            onClick={() => viewRegistrations(ev._id, ev.title)}
                            style={{ flex: "0 0 100%", justifyContent: "center" }}
                          >
                            <Icon name="users" size={14} color="#F9A8D4" />
                            View Registrations
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* ── Create / Edit Modal ── */}
        {showForm && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeForm(); }}>
            <div className="modal-box">
              <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", borderRadius: 999, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", fontSize: 11, color: "#A5B4FC", fontFamily: "'Outfit', sans-serif", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>
                    {editingEvent ? "✏️ Edit Event" : "✨ New Event"}
                  </div>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: "#E2E8F0", letterSpacing: "-0.02em" }}>
                    {editingEvent ? "Update Event" : "Create Event"}
                  </h2>
                </div>
                <button onClick={closeForm} style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                >
                  <Icon name="x" size={16} color="#94A3B8" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <label className="form-label">Event Title</label>
                    <input className="form-input" placeholder="e.g. Annual Tech Hackathon 2026" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea className="form-input" placeholder="Tell students what this event is about..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ resize: "vertical", minHeight: 80 }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label className="form-label">Event Date</label>
                      <input className="form-input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required style={{ colorScheme: "dark" }} />
                    </div>
                    <div>
                      <label className="form-label">Apply By Date</label>
                      <input
                        className="form-input"
                        type="date"
                        value={form.applyBy}
                        onChange={e => setForm({ ...form, applyBy: e.target.value })}
                        style={{ colorScheme: "dark" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Venue</label>
                    <input className="form-input" placeholder="e.g. Main Auditorium" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} />
                  </div>

                  <div>
                    <label className="form-label">Event Poster</label>
                    <div style={{ position: "relative" }}>
                      <input className="form-input" type="file" accept="image/*" onChange={e => { setFile(e.target.files[0]); setFileName(e.target.files[0]?.name || ""); }} style={{ opacity: 0, position: "absolute", inset: 0, cursor: "pointer", zIndex: 2 }} />
                      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(99,102,241,0.35)", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon name="image" size={18} color="#818CF8" />
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, color: "#94A3B8" }}>
                            {fileName || (editingEvent?.poster ? "Replace poster (optional)" : "Upload event poster")}
                          </div>
                          <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>PNG, JPG, WEBP up to 10MB</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Registration Form Fields */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon name="list" size={13} color="#F472B6" />
                        </div>
                        <label className="form-label" style={{ marginBottom: 0 }}>Registration Fields</label>
                        {formFields.length > 0 && (
                          <span style={{ padding: "1px 8px", borderRadius: 999, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", fontSize: 11, color: "#A5B4FC", fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
                            {formFields.length}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={addFormField}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "6px 12px", borderRadius: 8,
                          background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.28)",
                          color: "#A5B4FC", fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600,
                          cursor: "pointer", transition: "background 0.2s, border-color 0.2s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.18)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.28)"; }}
                      >
                        <Icon name="plus" size={12} color="#A5B4FC" />
                        Add Field
                      </button>
                    </div>

                    {formFields.length === 0 ? (
                      <div style={{ padding: "14px 16px", borderRadius: 10, border: "1px dashed rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", textAlign: "center", color: "#475569", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
                        No registration fields yet — click <strong style={{ color: "#64748B" }}>Add Field</strong> to collect info from attendees
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {formFields.map((field, index) => (
                          <div key={index} className="field-row">
                            <input
                              className="form-input"
                              placeholder={`Field name (e.g. GitHub, Year, Phone)`}
                              value={field.label}
                              onChange={e => updateFormField(index, "label", e.target.value)}
                              style={{ fontSize: 13 }}
                            />
                            <select
                              className="field-select"
                              value={field.type}
                              onChange={e => updateFormField(index, "type", e.target.value)}
                            >
                              <option value="text">Text</option>
                              <option value="email">Email</option>
                              <option value="number">Number</option>
                              <option value="url">URL</option>
                              <option value="tel">Phone</option>
                            </select>
                            <button
                              type="button"
                              className={`req-toggle ${field.required ? "active" : ""}`}
                              onClick={() => updateFormField(index, "required", !field.required)}
                              title="Toggle required"
                            >
                              <Icon name="check" size={11} color={field.required ? "#A5B4FC" : "#475569"} />
                              Req
                            </button>
                            <button
                              type="button"
                              className="btn-remove-field"
                              onClick={() => removeFormField(index)}
                              title="Remove field"
                            >
                              <Icon name="x" size={13} color="#FCA5A5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ padding: "16px 28px 24px", display: "flex", gap: 10, justifyContent: "flex-end", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <button type="button" className="btn-ghost" onClick={closeForm} style={{ padding: "11px 24px" }}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saveLoading} style={{ padding: "11px 28px", opacity: saveLoading ? 0.7 : 1 }}>
                    {saveLoading ? (
                      <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Saving...</>
                    ) : (
                      <><Icon name="check" size={16} color="white" />{editingEvent ? "Update Event" : "Create Event"}</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Registrations Modal ── */}
        {showRegs && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeRegs(); }}>
            <div className="modal-box-wide">

              {/* Header */}
              <div style={{
                padding: "24px 28px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
              }}>
                <div>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "4px 12px", borderRadius: 999,
                    background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.25)",
                    fontSize: 11, color: "#F9A8D4",
                    fontFamily: "'Outfit', sans-serif", fontWeight: 600,
                    letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10,
                  }}>
                    <Icon name="inbox" size={11} color="#F9A8D4" />
                    Registrations
                  </div>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: "#E2E8F0", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                    {regsEventTitle}
                  </h2>
                  {!regsLoading && (
                    <p style={{ color: "#64748B", fontSize: 13, marginTop: 5, fontFamily: "'DM Sans', sans-serif" }}>
                      {registrations.length === 0
                        ? "No registrations yet"
                        : `${registrations.length} registrant${registrations.length !== 1 ? "s" : ""}`}
                    </p>
                  )}
                </div>

                {/* Right actions: Export + count badge + close */}
                <div className="regs-header-right" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  {!regsLoading && registrations.length > 0 && (
                    <>
                      <button
                        className="btn-export"
                        onClick={exportRegistrations}
                        disabled={exportLoading}
                      >
                        {exportLoading ? (
                          <>
                            <div style={{ width: 13, height: 13, border: "2px solid rgba(110,231,183,0.3)", borderTopColor: "#6EE7B7", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                            Exporting...
                          </>
                        ) : (
                          <>
                            <Icon name="download" size={14} color="#6EE7B7" />
                            Export Excel
                          </>
                        )}
                      </button>

                      <div style={{
                        display: "flex", alignItems: "center", gap: 7,
                        padding: "6px 14px", borderRadius: 10,
                        background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.22)",
                      }}>
                        <Icon name="users" size={14} color="#F9A8D4" />
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: "#F9A8D4" }}>{registrations.length}</span>
                      </div>
                    </>
                  )}
                  <button
                    onClick={closeRegs}
                    style={{
                      width: 34, height: 34, borderRadius: 9,
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "background 0.2s", flexShrink: 0,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  >
                    <Icon name="x" size={16} color="#94A3B8" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "20px 28px 28px" }}>
                {regsLoading ? (
                  <div style={{ textAlign: "center", padding: "52px 0", color: "#475569" }}>
                    <div style={{
                      width: 36, height: 36,
                      border: "2px solid rgba(236,72,153,0.25)", borderTopColor: "#EC4899",
                      borderRadius: "50%", animation: "spin 0.8s linear infinite",
                      margin: "0 auto 14px",
                    }} />
                    <div style={{ fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Fetching registrations…</div>
                  </div>
                ) : registrations.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "52px 0" }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 16,
                      background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.18)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 16px",
                    }}>
                      <Icon name="inbox" size={24} color="#F472B6" />
                    </div>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 17, color: "#64748B", marginBottom: 6 }}>No registrations yet</h3>
                    <p style={{ color: "#475569", fontSize: 13 }}>Students haven't registered for this event yet</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {registrations.map((r, i) => (
                      <div key={i} className="reg-card">

                        {/* Card header: number + date */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                          <div style={{
                            width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                            background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(236,72,153,0.2))",
                            border: "1px solid rgba(99,102,241,0.3)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 11, color: "#A5B4FC",
                          }}>
                            {i + 1}
                          </div>
                          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 13, color: "#94A3B8" }}>
                            Registrant #{i + 1}
                          </span>
                          {r.submittedAt && (
                            <span style={{ marginLeft: "auto", fontSize: 11, color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
                              {new Date(r.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          )}
                        </div>

                        {/* ── Core profile fields: 2×2 grid ── */}
                        <div
                          className="profile-grid"
                          style={{ marginBottom: r.answers && r.answers.length > 0 ? 14 : 0 }}
                        >
                          {[
                            { label: "Name",        val: r.name },
                            { label: "Register No", val: r.registerNo },
                            { label: "Department",  val: r.department },
                            { label: "Year",        val: r.year },
                          ].map(({ label, val }) => (
                            <div key={label} className="profile-field">
                              <div className="profile-field-key">{label}</div>
                              <div className="profile-field-val" style={{ color: val ? "#E2E8F0" : "#334155", fontStyle: val ? "normal" : "italic" }}>
                                {val || "—"}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* ── Collapsible extra answers ── */}
                        {r.answers && r.answers.length > 0 && (
                          <details>
                            <summary className="answers-summary">
                              <Icon name="list" size={12} color="#64748B" />
                              {r.answers.length} additional answer{r.answers.length !== 1 ? "s" : ""}
                            </summary>
                            <div style={{ marginTop: 10 }}>
                              {r.answers.map((a, idx) => (
                                <div key={idx} className="answer-row">
                                  <div style={{ minWidth: 110, fontSize: 11, fontFamily: "'Outfit', sans-serif", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.04em", paddingTop: 1, flexShrink: 0 }}>
                                    {a.question}
                                  </div>
                                  <div style={{ fontSize: 13, color: "#CBD5E1", fontFamily: "'DM Sans', sans-serif", wordBreak: "break-word" }}>
                                    {a.answer || <span style={{ color: "#334155", fontStyle: "italic" }}>—</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </details>
                        )}

                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{ padding: "0 28px 24px", display: "flex", justifyContent: "flex-end" }}>
                <button className="btn-ghost" onClick={closeRegs} style={{ padding: "10px 24px" }}>
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
}

export default DeptDashboard;