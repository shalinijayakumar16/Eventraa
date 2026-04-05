import Icon from "../icon";

const STATS = [
  { val: "2,400+", label: "Active Students", icon: "users"    },
  { val: "180+",   label: "Events Hosted",   icon: "calendar" },
  { val: "18",     label: "Departments",     icon: "filter"   },
];

function StatsSection() {
  return (
    <section style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2, borderRadius: 20, overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.02)",
        }}>
          {STATS.map((s, i) => (
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
}

export default StatsSection;