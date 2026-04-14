import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { apiUrl } from "../constants/api";

const stepMeta = [
  { key: "registered", label: "Registered" },
  { key: "attended", label: "Attended" },
  { key: "certificateGenerated", label: "Certificate Generated" },
];

function StepItem({ label, done, isLast }) {
  return (
    <>
      <div
        style={{
          minWidth: 0,
          flex: 1,
          borderRadius: 12,
          border: done ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(148,163,184,0.25)",
          background: done ? "rgba(34,197,94,0.12)" : "rgba(148,163,184,0.08)",
          padding: "10px 12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ color: done ? "#86EFAC" : "#94A3B8", fontSize: 13, fontWeight: 600 }}>{label}</span>
          <span style={{ color: done ? "#86EFAC" : "#94A3B8", fontSize: 14 }}>{done ? "✅" : "⏳"}</span>
        </div>
      </div>
      {!isLast && <div style={{ color: "#64748B", fontSize: 14, alignSelf: "center" }}>→</div>}
    </>
  );
}

function EventJourneyTracker({ eventId, userId }) {
  const [journey, setJourney] = useState({
    registered: false,
    attended: false,
    certificateGenerated: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!eventId || !userId) return;

    const fetchJourney = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(apiUrl(`/api/student/event-journey/${eventId}`), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const payload = response.data || {};

        setJourney({
          registered: Boolean(payload.registered),
          attended: Boolean(payload.attended),
          certificateGenerated: Boolean(payload.certificateGenerated),
        });
      } catch (err) {
        setError("Unable to load event journey right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchJourney();
  }, [eventId, userId]);

  const completedCount = useMemo(() => {
    return stepMeta.reduce((count, step) => count + (journey[step.key] ? 1 : 0), 0);
  }, [journey]);

  const statusMessage = completedCount === stepMeta.length
    ? "Your event journey is complete 🎉"
    : "Your journey for this event is in progress 🚀";

  return (
    <section
      style={{
        marginBottom: 16,
        borderRadius: 14,
        border: "1px solid rgba(99,102,241,0.25)",
        background: "rgba(99,102,241,0.08)",
        padding: "12px 14px",
      }}
    >
      <div style={{ color: "#C7D2FE", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Event Journey Tracker</div>

      {loading ? (
        <div style={{ color: "#94A3B8", fontSize: 13 }}>Loading journey status...</div>
      ) : error ? (
        <div style={{ color: "#FCA5A5", fontSize: 13 }}>{error}</div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "stretch", gap: 8, flexWrap: "wrap" }}>
            {stepMeta.map((step, index) => (
              <StepItem
                key={step.key}
                label={step.label}
                done={Boolean(journey[step.key])}
                isLast={index === stepMeta.length - 1}
              />
            ))}
          </div>
          <div style={{ marginTop: 10, color: "#94A3B8", fontSize: 12 }}>{statusMessage}</div>
        </>
      )}
    </section>
  );
}

export default EventJourneyTracker;
