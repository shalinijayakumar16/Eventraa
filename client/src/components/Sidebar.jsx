function Sidebar({ myEvents, registeredCount }) {
  return (
    <aside
      className="sidebar"
      style={{
        width: 260, flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 18px",
        display: "flex", flexDirection: "column", gap: 8,
        minHeight: "calc(100vh - 68px)",
        position: "sticky", top: 68,
        alignSelf: "flex-start",
      }}
    >
      <div style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.1em", textTransform: "uppercase", color: "#475569",
        marginBottom: 10, paddingLeft: 4,
      }}>
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
  );
}

export default Sidebar;
