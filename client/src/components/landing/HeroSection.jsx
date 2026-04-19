import Icon from "../icon";
import LandingBlobBg from "./LandingBlogBg";

const FLOAT_DOTS = [
  { size: 8,  top: "22%", left: "12%",  delay: "0s",    dur: "4s",   color: "#6366F1" },
  { size: 5,  top: "55%", left: "8%",   delay: "1s",    dur: "5s",   color: "#8B5CF6" },
  { size: 6,  top: "35%", right: "10%", delay: "2s",    dur: "6s",   color: "#EC4899" },
  { size: 4,  top: "70%", right: "15%", delay: "0.5s",  dur: "4.5s", color: "#6366F1" },
  { size: 10, top: "15%", right: "25%", delay: "1.5s",  dur: "7s",   color: "#A5B4FC" },
];

function HeroSection({ navigate }) {
  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "120px 24px 80px", position: "relative", textAlign: "center",
    }}>
      <LandingBlobBg />

      {/* Floating dots */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {FLOAT_DOTS.map((dot, i) => (
          <div key={i} className="animate-float" style={{
            position: "absolute", width: dot.size, height: dot.size,
            borderRadius: "50%", background: dot.color,
            top: dot.top, left: dot.left, right: dot.right,
            animationDelay: dot.delay, animationDuration: dot.dur,
            boxShadow: `0 0 ${dot.size * 3}px ${dot.color}`,
            opacity: 0.7,
          }}/>
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto" }}>
        {/* Badge */}
        <div className="animate-fadeUp" style={{ animationDelay: "0.1s", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 16px", borderRadius: 999,
            background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
            fontSize: 13, color: "#A5B4FC", fontFamily: "'DM Sans', sans-serif",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6EE7B7", display: "inline-block", boxShadow: "0 0 8px #6EE7B7" }}/>
            Now live at your campus · Join 2,400+ students
          </div>
        </div>

        {/* Heading */}
        <h1 className="hero-heading animate-fadeUp" style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "clamp(3.6rem, 8vw, 5.5rem)",
          fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em",
          marginBottom: 24, animationDelay: "0.2s",
        }}>
          <span className="gradient-text">Where Campus</span>
          <br/>
          <span style={{ color: "var(--text)" }}>Events Come</span>{" "}
          <span className="gradient-text-brand">Alive</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fadeUp" style={{
          fontSize: "clamp(1rem, 2.5vw, 1.2rem)", color: "var(--text-muted)",
          lineHeight: 1.7, maxWidth: 540, margin: "0 auto 44px",
          fontFamily: "'DM Sans', sans-serif", animationDelay: "0.35s",
        }}>
          Discover, register, and stay updated with all campus events in one elegant platform built for modern students.
        </p>

        {/* CTA buttons */}
        <div className="hero-ctas animate-fadeUp" style={{ display: "flex", gap: 14, justifyContent: "center", animationDelay: "0.5s" }}>
          <button onClick={() => navigate("/register")} className="btn-primary-glow" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, padding: "15px 36px" }}>
            Get Started
            <Icon name="arrowRight" size={18} color="white" />
          </button>
          <button className="btn-ghost" style={{ fontSize: 16, padding: "15px 36px", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="compass" size={18} color="#94A3B8" />
            Explore Events
          </button>
        </div>

        {/* Social proof */}
        <div className="animate-fadeIn" style={{ animationDelay: "0.7s", marginTop: 56, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex" }}>
            {["#6366F1","#8B5CF6","#EC4899","#6EE7B7","#F59E0B"].map((c, i) => (
              <div key={i} style={{
                width: 32, height: 32, borderRadius: "50%",
                background: `linear-gradient(135deg, ${c}, ${c}cc)`,
                border: "2px solid var(--bg)",
                marginLeft: i === 0 ? 0 : -10,
                boxShadow: `0 2px 8px ${c}66`,
              }}/>
            ))}
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
            Trusted by <strong style={{ color: "var(--text-soft)" }}>2,400+</strong> students across 18 departments
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 120,
        background: "linear-gradient(to top, var(--bg), transparent)", pointerEvents: "none",
      }}/>
    </section>
  );
}

export default HeroSection;