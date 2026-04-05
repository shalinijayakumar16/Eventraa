import Icon from "../icon";

const STEPS = [
  {
    num: "01", icon: "search", title: "Browse Events",
    desc: "Open Eventra and explore all upcoming events from your college. Filter by department, category, or date to find exactly what interests you.",
    color: "#6366F1",
  },
  {
    num: "02", icon: "zap", title: "Register Easily",
    desc: "Found something exciting? Hit register and you're done. Get an instant confirmation and a calendar invite automatically.",
    color: "#8B5CF6",
  },
  {
    num: "03", icon: "star", title: "Attend & Enjoy",
    desc: "Show up, show your QR pass, and dive into the experience. Collect memories, connect with peers, and track your event history.",
    color: "#EC4899",
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" style={{ padding: "100px 24px", position: "relative" }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 65%)",
      }}/>

      <div style={{ maxWidth: 780, margin: "0 auto", position: "relative" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 999, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", color: "#C4B5FD", fontSize: 12, fontFamily: "'Outfit', sans-serif", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
            How It Works
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 2.8rem)", letterSpacing: "-0.03em", marginBottom: 16 }}>
            <span style={{ color: "#E2E8F0" }}>Three steps to your</span>
            <br/><span className="gradient-text-brand">next great experience</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="steps-grid" style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
          {/* Connecting line */}
          <div style={{
            position: "absolute", left: 53, top: 60, bottom: 60, width: 1,
            background: "linear-gradient(to bottom, rgba(99,102,241,0.4), rgba(236,72,153,0.4))",
            zIndex: 0,
          }}/>

          {STEPS.map((s, i) => (
            <div key={i} className="step-card" style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                minWidth: 44, height: 44, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
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
}

export default HowItWorksSection;