import Icon from "../icon";

const FEATURES = [
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

function FeaturesSection() {
  return (
    <section id="features" style={{ padding: "100px 24px", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 999, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#A5B4FC", fontSize: 12, fontFamily: "'Outfit', sans-serif", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
            Platform Features
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 2.8rem)", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 16 }}>
            <span className="gradient-text">Everything you need,</span>
            <br/><span style={{ color: "var(--text)" }}>nothing you don't</span>
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 16, maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>
            Built for students who want to experience more of campus life without the chaos.
          </p>
        </div>

        {/* Cards grid */}
        <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="icon-box" style={{ background: f.gradient, boxShadow: `0 8px 24px ${f.glow}` }}>
                <Icon name={f.icon} size={22} color={f.iconColor} />
              </div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 17, color: "var(--text)", marginBottom: 10, letterSpacing: "-0.01em" }}>{f.label}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturesSection;