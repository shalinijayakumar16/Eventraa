export const LANDING_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

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
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.2); }
    50%       { box-shadow: 0 0 30px rgba(139,92,246,0.6), 0 0 90px rgba(139,92,246,0.3); }
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

  .glass {
    background: var(--surface);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid var(--border);
  }

  .gradient-text {
    background: linear-gradient(135deg, var(--text) 0%, #A5B4FC 40%, #8B5CF6 70%, #EC4899 100%);
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
    background: var(--gradient-accent);
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
    box-shadow: var(--shadow-soft);
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
  .btn-primary-glow:hover { transform: translateY(-2px); box-shadow: var(--shadow-glow); }
  .btn-primary-glow:hover::before { opacity: 1; }
  .btn-primary-glow:active { transform: translateY(0); }

  .btn-ghost {
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
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
    background: var(--surface-hover);
    border-color: rgba(99,102,241,0.5);
    color: var(--text-strong);
    transform: translateY(-2px);
  }

  .feature-card {
    background: var(--surface);
    border: 1px solid var(--border);
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
    background: var(--surface-hover);
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
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    transition: border-color 0.3s, background 0.3s;
  }
  .step-card:hover {
    border-color: rgba(99,102,241,0.3);
    background: rgba(99,102,241,0.06);
  }

  .ticker-track {
    display: flex;
    gap: 48px;
    animation: marquee 22s linear infinite;
    white-space: nowrap;
  }

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