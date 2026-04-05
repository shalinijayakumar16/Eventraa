export const STYLES = `
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