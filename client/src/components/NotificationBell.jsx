import Icon from "./icon";

function NotificationBell({ unreadCount, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        position: "relative",
        width: 38,
        height: 38,
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.04)",
        color: "#CBD5E1",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="Notifications"
    >
      <Icon name="bell" size={17} color="#CBD5E1" />
      {unreadCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: -5,
            right: -5,
            minWidth: 18,
            height: 18,
            borderRadius: 999,
            padding: "0 5px",
            background: "linear-gradient(135deg, #EC4899, #F43F5E)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            fontFamily: "'Outfit', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}

export default NotificationBell;
