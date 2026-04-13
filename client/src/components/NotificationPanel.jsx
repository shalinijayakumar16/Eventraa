import { useCallback, useEffect, useState } from "react";
import Icon from "./icon";
import { apiUrl } from "../constants/api";

const makeDummyNotifications = () => {
  const now = Date.now();

  return [
    {
      _id: "local-1",
      message: "You successfully registered for Hackathon 2026",
      createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      _id: "local-2",
      message: "Reminder: Event starts tomorrow",
      createdAt: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      _id: "local-3",
      message: "Last date to register is today",
      createdAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ];
};

const toRelativeTime = (dateString) => {
  const value = new Date(dateString).getTime();
  if (Number.isNaN(value)) return "Just now";

  const diffMs = Date.now() - value;
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

function NotificationPanel({ open, userId, onClose, onNotificationsUpdate }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const syncToParent = useCallback(
    (items) => {
      if (onNotificationsUpdate) {
        onNotificationsUpdate(items);
      }
    },
    [onNotificationsUpdate]
  );

  const fetchNotifications = useCallback(async () => {
    if (!open) return;

    setLoading(true);

    try {
      const response = await fetch(apiUrl("/api/notifications"), {
        headers: userId ? { "x-user-id": userId } : {},
      });

      if (!response.ok) {
        throw new Error("Notification API unavailable");
      }

      const payload = await response.json();
      const list = Array.isArray(payload) ? payload : payload.notifications || [];

      const normalized = list.map((item, index) => ({
        _id: item._id || `api-${index}`,
        message: item.message || "Notification",
        createdAt: item.createdAt || new Date().toISOString(),
        read: Boolean(item.read),
      }));

      setNotifications(normalized);
      syncToParent(normalized);
    } catch (error) {
      const fallback = makeDummyNotifications();
      setNotifications(fallback);
      syncToParent(fallback);
    } finally {
      setLoading(false);
    }
  }, [open, syncToParent, userId]);

  const markAsRead = useCallback(async () => {
    if (!open) return;

    // Mark notifications as read after opening
    try {
      await fetch(apiUrl("/api/notifications/read"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(userId ? { "x-user-id": userId } : {}),
        },
      });
    } catch (error) {
      // Ignore API failure and still update local read state
    }

    setNotifications((prev) => {
      const updated = prev.map((item) => ({ ...item, read: true }));
      syncToParent(updated);
      return updated;
    });
  }, [open, syncToParent, userId]);

  useEffect(() => {
    if (!open) return;
    fetchNotifications();
  }, [open, fetchNotifications]);

  useEffect(() => {
    if (!open) return;

    markAsRead();

    const timer = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(timer);
  }, [open, fetchNotifications, markAsRead]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 74,
        right: 84,
        width: 340,
        maxWidth: "calc(100vw - 32px)",
        background: "#0D1130",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 16,
        zIndex: 120,
        boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="bell" size={14} color="#A5B4FC" />
          <strong style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "#E2E8F0" }}>Notifications</strong>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            color: "#64748B",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Close notifications"
        >
          <Icon name="x" size={14} color="#64748B" />
        </button>
      </div>

      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        {loading ? (
          <div style={{ padding: 16, color: "#94A3B8", fontSize: 13 }}>Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: 16, color: "#64748B", fontSize: 13 }}>No notifications yet</div>
        ) : (
          notifications.map((item) => (
            <div
              key={item._id}
              style={{
                padding: "12px 14px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                background: item.read ? "transparent" : "rgba(99,102,241,0.08)",
              }}
            >
              <div style={{ color: "#CBD5E1", fontSize: 13, lineHeight: 1.5 }}>{item.message}</div>
              <div style={{ marginTop: 6, color: "#64748B", fontSize: 11 }}>{toRelativeTime(item.createdAt)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationPanel;
