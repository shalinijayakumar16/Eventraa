import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { apiUrl } from "../constants/api";

function ParticipationHistory({ userId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("recent");

  useEffect(() => {
    if (!userId) {
      setHistory([]);
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      try {
        // Load attended events for logged-in student
        const response = await fetch(`/api/registrations/history/${userId}`);
        const payload = await response.json();
        setHistory(Array.isArray(payload) ? payload : []);
      } catch (error) {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  const sortedHistory = useMemo(() => {
    const list = [...history];
    return list.sort((a, b) => {
      const dateA = new Date(a?.eventId?.date || a?.createdAt || 0).getTime();
      const dateB = new Date(b?.eventId?.date || b?.createdAt || 0).getTime();
      return filter === "recent" ? dateB - dateA : dateA - dateB;
    });
  }, [history, filter]);

  const certificateCount = useMemo(() => {
    return history.filter((item) => {
      const event = item?.eventId || {};
      return Boolean(item?.certificateUrl || event?.certificateUrl || item?.certificateIssued);
    }).length;
  }, [history]);

  return (
    <section
      className="animate-fadeUp"
      style={{
        marginTop: 20,
        marginBottom: 24,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 18,
        padding: "18px 18px 14px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              color: "#E2E8F0",
              fontSize: 18,
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            Participation History
          </h3>
          <p style={{ margin: "6px 0 0", color: "#94A3B8", fontSize: 13 }}>
            Events attended: {history.length} • Certificates earned: {certificateCount}
          </p>
        </div>

        <div style={{ display: "inline-flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setFilter("recent")}
            style={{
              borderRadius: 999,
              border: "1px solid rgba(99,102,241,0.35)",
              background: filter === "recent" ? "rgba(99,102,241,0.22)" : "rgba(255,255,255,0.03)",
              color: "#C7D2FE",
              padding: "6px 12px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Recent
          </button>
          <button
            type="button"
            onClick={() => setFilter("old")}
            style={{
              borderRadius: 999,
              border: "1px solid rgba(99,102,241,0.35)",
              background: filter === "old" ? "rgba(99,102,241,0.22)" : "rgba(255,255,255,0.03)",
              color: "#C7D2FE",
              padding: "6px 12px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Old
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#94A3B8", fontSize: 14, margin: "8px 0" }}>Loading participation history...</p>
      ) : sortedHistory.length === 0 ? (
        <p style={{ color: "#64748B", fontSize: 14, margin: "8px 0" }}>No events attended yet</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {sortedHistory.map((item) => {
            const event = item.eventId || {};
            const eventDate = event.date ? new Date(event.date).toLocaleDateString() : "Date not available";
            const certificateUrl = item.certificateUrl || event.certificateUrl;

            const handleDownloadCertificate = async () => {
              try {
                const response = await axios.get(apiUrl(`/api/certificates/download/${event._id}/${userId}`), {
                  responseType: "blob",
                });

                const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
                const link = document.createElement("a");
                link.href = blobUrl;
                link.setAttribute("download", `${(event.title || "certificate").replace(/\s+/g, "_")}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(blobUrl);
              } catch (downloadError) {
                const message = downloadError?.response?.data?.message || "Unable to download certificate right now.";
                window.alert(message);
              }
            };

            return (
              <article
                key={item._id}
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 14,
                  padding: "12px 14px",
                  background: "rgba(2,6,23,0.45)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: "#E2E8F0", fontWeight: 700, fontSize: 15 }}>
                      {event.title || "Untitled event"}
                    </div>
                    <div style={{ color: "#94A3B8", fontSize: 13, marginTop: 4 }}>
                      {eventDate} • {event.department || "Department not available"}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "4px 10px",
                        background: "rgba(16,185,129,0.12)",
                        border: "1px solid rgba(16,185,129,0.28)",
                        color: "#6EE7B7",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {certificateUrl ? "Certificate Ready" : "Certificate Pending"}
                    </span>
                    <button
                      type="button"
                      style={{
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: certificateUrl ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.03)",
                        color: certificateUrl ? "#E2E8F0" : "#94A3B8",
                        padding: "8px 12px",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                      onClick={handleDownloadCertificate}
                    >
                      Download Certificate
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ParticipationHistory;
