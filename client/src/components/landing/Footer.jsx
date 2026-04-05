const FOOTER_COLS = [
  { label: "Product", links: ["Features", "How It Works", "For Departments", "Roadmap"] },
  { label: "Support", links: ["Help Center", "Contact Us", "Status", "Privacy Policy"] },
];

function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "48px 24px 36px",
      background: "rgba(0,0,0,0.2)",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 9,
                background: "linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800, color: "#fff",
                fontFamily: "'Outfit', sans-serif",
                boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
              }}>E</div>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, background: "linear-gradient(135deg, #E2E8F0, #A5B4FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Eventra</span>
            </div>
            <p style={{ color: "#475569", fontSize: 14, maxWidth: 220, lineHeight: 1.6 }}>
              Where campus events come alive.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map(col => (
            <div key={col.label}>
              <div style={{ color: "#E2E8F0", fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>
                {col.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {col.links.map(l => (
                  <a
                    key={l} href="#"
                    style={{ color: "#475569", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "#94A3B8"}
                    onMouseLeave={e => e.target.style.color = "#475569"}
                  >{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "#334155", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
            © 2026 Eventra · Built for campus, by campus
          </p>
          <p style={{ color: "#334155", fontSize: 13 }}>Made with ♥ for students</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;