import { useEffect, useState } from "react";
import Icon from "./icon";
import { apiUrl } from "../constants/api";

function EventApproval() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingMap, setActionLoadingMap] = useState({});

  const fetchPendingEvents = async () => {
    setLoading(true);
    try {
      // Load events awaiting admin approval
      const response = await fetch(apiUrl("/api/events/pending"));
      if (!response.ok) {
        throw new Error("Failed to load pending events");
      }

      const payload = await response.json();
      setPendingEvents(Array.isArray(payload) ? payload : []);
    } catch (error) {
      setPendingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const handleApprove = async (eventId) => {
    if (!eventId) return;

    setActionLoadingMap((previous) => ({ ...previous, [eventId]: true }));
    try {
      const response = await fetch(apiUrl(`/api/events/approve/${eventId}`), {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Unable to approve event");
      }

      // Update UI after admin action
      setPendingEvents((previous) => previous.filter((item) => item._id !== eventId));
    } catch (error) {
      // Keep list unchanged on failure
    } finally {
      setActionLoadingMap((previous) => {
        const next = { ...previous };
        delete next[eventId];
        return next;
      });
    }
  };

  const handleReject = async (eventId, title) => {
    if (!eventId) return;

    const confirmed = window.confirm(`Reject and remove "${title || "this event"}"?`);
    if (!confirmed) return;

    setActionLoadingMap((previous) => ({ ...previous, [eventId]: true }));
    try {
      const response = await fetch(apiUrl(`/api/events/reject/${eventId}`), {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to reject event");
      }

      // Update UI after admin action
      setPendingEvents((previous) => previous.filter((item) => item._id !== eventId));
    } catch (error) {
      // Keep list unchanged on failure
    } finally {
      setActionLoadingMap((previous) => {
        const next = { ...previous };
        delete next[eventId];
        return next;
      });
    }
  };

  return (
    <section
      className="animate-fadeUp"
      style={{
        animationDelay: "0.12s",
        background: "rgba(255,255,255,0.035)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 22,
        boxShadow: "0 18px 48px rgba(0,0,0,0.25)",
        padding: 22,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: 20,
              color: "#E2E8F0",
              marginBottom: 4,
            }}
          >
            Event Approvals
          </h2>
          <p style={{ color: "#64748B", fontSize: 13 }}>
            Review newly created events and decide which ones should go live for students.
          </p>
        </div>

        <div style={{ color: "#475569", fontSize: 13 }}>
          {pendingEvents.length} pending event{pendingEvents.length !== 1 ? "s" : ""}
        </div>
      </div>

      {loading && <div style={{ color: "#64748B", fontSize: 14 }}>Loading pending events...</div>}

      {!loading && pendingEvents.length === 0 && (
        <div
          className="event-card"
          style={{ padding: 18, color: "#94A3B8", fontSize: 14 }}
        >
          No pending events right now.
        </div>
      )}

      {!loading && pendingEvents.length > 0 && (
        <div style={{ display: "grid", gap: 14, maxHeight: "62vh", overflowY: "auto", paddingRight: 2 }}>
          {pendingEvents.map((event) => {
            const busy = Boolean(actionLoadingMap[event._id]);

            return (
              <article key={event._id} className="event-card" style={{ padding: 18, display: "grid", gap: 12 }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "3px 10px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 600,
                      background: "rgba(139,92,246,0.15)",
                      border: "1px solid rgba(139,92,246,0.3)",
                      color: "#C4B5FD",
                    }}
                  >
                    {event.department || "General"}
                  </div>
                  <div style={{ color: "#64748B", fontSize: 12 }}>
                    {event.date ? new Date(event.date).toLocaleDateString() : "Date not set"}
                  </div>
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 700,
                      fontSize: 17,
                      color: "#E2E8F0",
                      marginBottom: 6,
                    }}
                  >
                    {event.title || "Untitled Event"}
                  </h3>
                  <p style={{ color: "#94A3B8", fontSize: 14, lineHeight: 1.55 }}>
                    {event.description || "No description provided."}
                  </p>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <button
                    className="btn-primary-glow"
                    style={{ padding: "8px 14px", fontSize: 12 }}
                    onClick={() => handleApprove(event._id)}
                    disabled={busy}
                  >
                    <Icon name="check" size={12} color="#fff" />
                    Approve
                  </button>

                  <button
                    className="btn-logout"
                    style={{ padding: "8px 14px", fontSize: 12 }}
                    onClick={() => handleReject(event._id, event.title)}
                    disabled={busy}
                  >
                    <Icon name="x" size={12} color="#FCA5A5" />
                    Reject
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default EventApproval;
