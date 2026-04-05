const TICKER_ITEMS = [
  "Tech Fest 2026", "Cultural Week", "Hackathon", "Sports Day",
  "Alumni Meet", "Science Expo", "Drama Night", "Career Fair",
];

function TickerSection() {
  return (
    <div style={{
      overflow: "hidden", padding: "20px 0",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      position: "relative",
    }}>
      {/* Left fade */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 100,
        background: "linear-gradient(to right, #07091A, transparent)", zIndex: 1,
      }}/>
      {/* Right fade */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 100,
        background: "linear-gradient(to left, #07091A, transparent)", zIndex: 1,
      }}/>

      <div className="ticker-track">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: 16,
            color: "#475569", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
          }}>
            <span style={{ color: "#6366F1", fontSize: 8 }}>◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TickerSection;