import Icon from "./icon";

function StatsRow({ totalEvents, registeredCount, upcomingCount, departmentCount }) {
  const stats = [
    { label: "Total Events", val: totalEvents,     icon: "calendar", color: "#6366F1" },
    { label: "Registered",   val: registeredCount, icon: "check",    color: "#EC4899" },
    { label: "Upcoming",     val: upcomingCount,   icon: "trending", color: "#8B5CF6" },
    { label: "Departments",  val: departmentCount, icon: "filter",   color: "#06B6D4" },
  ];

  return (
    <div className="stats-row animate-fadeUp" style={{ display: "flex", gap: 12, marginBottom: 28, animationDelay: "0.08s" }}>
      {stats.map((s, i) => (
        <div key={i} className="stat-pill">
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `${s.color}22`, border: `1px solid ${s.color}44`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon name={s.icon} size={16} color={s.color} />
          </div>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: "#E2E8F0", lineHeight: 1 }}>{s.val}</div>
            <div style={{ color: "#64748B", fontSize: 12, marginTop: 2 }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsRow;
