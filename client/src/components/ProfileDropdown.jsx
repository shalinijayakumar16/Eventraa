import Icon from "./icon";

function ProfileDropdown({ user }) {
  if (!user) return null;

  return (
    <div className="profile-dropdown">
      <div style={{
        padding: "20px 20px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(236,72,153,0.06))",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #6366F1, #EC4899)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="user" size={20} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: "#E2E8F0" }}>{user.name}</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{user.department} · Year {user.year}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 20px 16px" }}>
        {[["Register No", user.registerNo], ["Email", user.email]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ fontSize: 12, color: "#64748B", fontFamily: "'Outfit', sans-serif", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{k}</span>
            <span style={{ fontSize: 13, color: "#CBD5E1" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileDropdown;
