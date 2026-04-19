function EventraLogo({ size = 34, showText = true, subtitle = "", gap = 10, textSize = 19, variant = "full" }) {
  const iconWidth = size;
  const iconHeight = size;

  // Instagram/Square variant - Perfect for profile pictures
  if (variant === "instagram") {
    return (
      <div
        style={{
          width: iconWidth,
          height: iconHeight,
          borderRadius: "20%",
          background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 50%, var(--pink) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-glow)",
          color: "#fff",
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 900,
          fontSize: Math.max(14, Math.round(size * 0.45)),
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}
        aria-hidden="true"
      >
        {/* Animated background gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)`,
            pointerEvents: "none",
          }}
        />
        <span style={{ position: "relative", zIndex: 1 }}>E</span>
      </div>
    );
  }

  // Compact icon variant - Small spaces
  if (variant === "icon") {
    return (
      <div
        style={{
          width: iconWidth,
          height: iconHeight,
          borderRadius: Math.round(size * 0.25),
          background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 50%, var(--pink) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-soft)",
          color: "#fff",
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 800,
          fontSize: Math.max(12, Math.round(size * 0.4)),
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        E
      </div>
    );
  }

  // Default full logo with text (landing page & navbar)
  return (
    <div style={{ display: "flex", alignItems: "center", gap }}>
      <div
        style={{
          width: iconWidth,
          height: iconHeight,
          borderRadius: Math.round(size * 0.3),
          background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 50%, var(--pink) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-soft)",
          color: "#fff",
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 800,
          fontSize: Math.max(12, Math.round(size * 0.42)),
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        E
      </div>

      {showText && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: textSize,
              background: "linear-gradient(135deg, var(--text-strong) 0%, #A5B4FC 40%, var(--accent) 70%, var(--pink) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            Eventra
          </span>
          {subtitle ? (
            <span
              style={{
                color: "var(--text-muted)",
                fontSize: Math.max(12, textSize - 6),
                marginLeft: 8,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              / {subtitle}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default EventraLogo;
