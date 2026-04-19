import { useEffect, useState } from "react";
import EventraLogo from "../EventraLogo";
import ThemeToggle from "../ThemeToggle";

function Navbar({ navigate }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 24px", height: 68,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "background 0.4s, border-bottom 0.4s, backdrop-filter 0.4s",
      background: scrolled ? "color-mix(in srgb, var(--bg) 85%, transparent)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
    }}>
      {/* Logo */}
      <EventraLogo textSize={20} />

      {/* Nav links */}
      <div className="nav-links" style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {["Features", "How It Works", "For Departments"].map(link => (
          <a
            key={link}
            href={`#${link.toLowerCase().replace(/ /g, "-")}`}
            style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "var(--text-strong)"}
            onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
          >{link}</a>
        ))}
      </div>

      {/* CTA buttons */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <ThemeToggle />
        <button onClick={() => navigate("/login")} className="btn-ghost" style={{ padding: "9px 20px", fontSize: 14 }}>
          Log In
        </button>
        <button onClick={() => navigate("/register")} className="btn-primary-glow" style={{ padding: "9px 20px", fontSize: 14 }}>
          Sign Up →
        </button>
      </div>
    </nav>
  );
}

export default Navbar;