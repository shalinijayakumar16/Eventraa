import { useEffect, useMemo, useState } from "react";
import Icon from "./icon";
import { apiUrl } from "../constants/api";

const truncateText = (value, max = 100) => {
  const text = String(value || "").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}...`;
};

const formatDate = (rawDate) => {
  if (!rawDate) return "Date not available";

  const parsed = new Date(rawDate);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return String(rawDate);
};

function ExternalEvents({ onCountChange }) {
  const [externalEvents, setExternalEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchExternalEvents = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(apiUrl("/api/external-events"));
        if (!response.ok) {
          throw new Error("Unable to load other college events");
        }

        const payload = await response.json();
        const list = Array.isArray(payload) ? payload : [];

        if (!mounted) return;
        setExternalEvents(list);
        onCountChange?.(list.length);
      } catch (err) {
        if (!mounted) return;
        setExternalEvents([]);
        setError(err?.message || "Something went wrong");
        onCountChange?.(0);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchExternalEvents();

    return () => {
      mounted = false;
    };
  }, [onCountChange]);

  const sortedEvents = useMemo(() => {
    return [...externalEvents].sort((a, b) => {
      const first = new Date(a?.date || 0).getTime();
      const second = new Date(b?.date || 0).getTime();
      return Number.isNaN(first) || Number.isNaN(second) ? 0 : first - second;
    });
  }, [externalEvents]);

  if (isLoading) {
    return (
      <section className="animate-fadeUp" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0, color: "#E2E8F0", fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.01em", fontSize: 20 }}>
              Other College Events
            </h2>
            <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: 13 }}>
              Loading external events from Devfolio...
            </p>
          </div>
        </div>
        <div className="events-grid animate-fadeUp" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, animationDelay: "0.2s" }}>
          {[...Array(3)].map((_, index) => (
            <div
              key={`external-skeleton-${index}`}
              className="event-card"
              style={{
                minHeight: 250,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(2,6,23,0.9))",
              }}
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="animate-fadeUp" style={{ marginBottom: 24 }}>
        <div className="events-grid animate-fadeUp" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, animationDelay: "0.2s" }}>
          <div className="empty-state">
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Icon name="info" size={28} color="#FCA5A5" />
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#FCA5A5", marginBottom: 8 }}>
              Could not load other college events
            </h3>
            <p style={{ fontSize: 14, color: "#94A3B8" }}>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (sortedEvents.length === 0) {
    return (
      <section className="animate-fadeUp" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0, color: "#E2E8F0", fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.01em", fontSize: 20 }}>
              Other College Events
            </h2>
            <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: 13 }}>
              Explore hand-picked external opportunities from Devfolio.
            </p>
          </div>
        </div>

        <div className="events-grid animate-fadeUp" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, animationDelay: "0.2s" }}>
          <div className="empty-state">
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Icon name="calendar" size={28} color="#6366F1" />
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#64748B", marginBottom: 8 }}>
              No external events found
            </h3>
            <p style={{ fontSize: 14 }}>
              External events will appear here once available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-fadeUp" style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0, color: "#E2E8F0", fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.01em", fontSize: 20 }}>
            Other College Events
          </h2>
          <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: 13 }}>
            Explore hand-picked external opportunities from Devfolio.
          </p>
        </div>
        <div style={{ color: "#94A3B8", fontSize: 12 }}>{sortedEvents.length} event{sortedEvents.length !== 1 ? "s" : ""}</div>
      </div>

      <div className="events-grid animate-fadeUp" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, animationDelay: "0.2s" }}>
        {sortedEvents.map((event, index) => (
          <div key={event._id || event.link || `${event.title}-${index}`} className="event-card" style={{ animationDelay: `${index * 0.04}s` }}>
            <div style={{ padding: "18px 18px 14px", display: "flex", flexDirection: "column", gap: 10, minHeight: 260 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: "#E2E8F0", letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                  {event.title || "Untitled Event"}
                </h3>
                <span className="badge-pill" style={{ background: "rgba(99,102,241,0.14)", border: "1px solid rgba(99,102,241,0.34)", color: "#A5B4FC" }}>
                  Devfolio
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#94A3B8", fontSize: 13 }}>
                <Icon name="calendar" size={13} color="#8B5CF6" />
                {formatDate(event.date)}
              </div>

              <p style={{ margin: 0, color: "#94A3B8", fontSize: 13, lineHeight: 1.5 }}>
                {truncateText(event.description || "No description available", 100)}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 2 }}>
                {(Array.isArray(event.tags) ? event.tags : []).slice(0, 5).map((tag) => (
                  <span
                    key={`${event.link || event._id || event.title}-${tag}`}
                    className="badge-pill"
                    style={{
                      background: "rgba(110,231,183,0.12)",
                      border: "1px solid rgba(110,231,183,0.3)",
                      color: "#6EE7B7",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", display: "grid", gap: 8 }}>
                <button
                  className="btn-primary-glow"
                  style={{ justifyContent: "center", fontSize: 12, padding: "9px 10px" }}
                  onClick={() => {
                    if (!event.link) return;
                    window.open(event.link, "_blank", "noopener,noreferrer");
                  }}
                  disabled={!event.link}
                >
                  View Event <Icon name="arrowRight" size={13} color="white" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ExternalEvents;
