import Icon from "./icon";
import NotificationBell from "./NotificationBell";
import EventraLogo from "./EventraLogo";

function Topbar({ user, showProfile, onToggleProfile, onLogout, unreadCount, onToggleNotifications }) {
  return (
    <header
      className="topbar"
      style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(7,9,26,0.85)", backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 32px", height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}
    >
      {/* Logo */}
      <EventraLogo subtitle="Student" />

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {user && (
          <div style={{ padding: "6px 14px", borderRadius: 999, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.28)", fontSize: 13, color: "#A5B4FC", fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>
            {user.department}
          </div>
        )}
        <NotificationBell
          unreadCount={unreadCount}
          onToggle={onToggleNotifications}
        />
        <button
          onClick={onToggleProfile}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366F1, #EC4899)",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: showProfile ? "0 0 0 3px rgba(99,102,241,0.4)" : "none",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <Icon name="user" size={17} color="white" />
        </button>
        <button className="btn-logout" onClick={onLogout}>
          <Icon name="logout" size={15} color="#FCA5A5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;
