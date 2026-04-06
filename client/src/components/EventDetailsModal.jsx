import { useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Icon from "./icon";
import CountdownChip from "./CountdownChip";
import { TYPE_STYLE } from "../constants/config";

function EventDetailsModal({ event, alreadyJoined, onClose, onRegister, userId }) {
  const typeStyle = TYPE_STYLE[event.type] || TYPE_STYLE.default;
  const isPast    = new Date(event.date) < new Date();
  const [showQR, setShowQR] = useState(false);

  const qrData = useMemo(() => {
    // Generate QR using userId and eventId
    return JSON.stringify({
      userId: userId || "",
      eventId: event._id,
    });
  }, [event._id, userId]);

  const metaRows = [
    { icon: "filter",   color: "#6366F1", label: "Department", value: event.department },
    { icon: "calendar", color: "#8B5CF6", label: "Event Date",  value: new Date(event.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
    event.applyBy && { icon: "clock", color: "#F59E0B", label: "Apply By", value: new Date(event.applyBy).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
    event.venue   && { icon: "map",   color: "#EC4899", label: "Venue",    value: event.venue },
    event.type    && { icon: "tag",   color: typeStyle.color, label: "Type", value: event.type },
  ].filter(Boolean);

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box-details">
        {/* Poster / Hero */}
        {event.poster ? (
          <div style={{ position: "relative", height: 220, overflow: "hidden", borderRadius: "24px 24px 0 0" }}>
            <img
              src={`http://localhost:5000/${event.poster}`}
              alt="poster"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0D1130 0%, rgba(13,17,48,0.3) 60%, transparent 100%)" }} />
            {isPast && (
              <div style={{ position: "absolute", top: 14, left: 14, padding: "4px 12px", borderRadius: 999, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", fontSize: 11, color: "#94A3B8", fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)" }}>Past Event</div>
            )}
            <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: 9, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="x" size={16} color="#E2E8F0" />
            </button>
          </div>
        ) : (
          <div style={{ position: "relative", height: 140, background: "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(236,72,153,0.10))", borderRadius: "24px 24px 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="calendar" size={40} color="rgba(99,102,241,0.35)" />
            {isPast && (
              <div style={{ position: "absolute", top: 14, left: 14, padding: "4px 12px", borderRadius: 999, background: "rgba(0,0,0,0.3)", fontSize: 11, color: "#64748B", fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "1px solid rgba(255,255,255,0.07)" }}>Past Event</div>
            )}
            <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="x" size={16} color="#94A3B8" />
            </button>
          </div>
        )}

        <div style={{ padding: "22px 28px 28px" }}>
          {/* Title + badge */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, color: "#E2E8F0", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{event.title}</h2>
            <span className="badge-pill" style={{ background: typeStyle.bg, border: `1px solid ${typeStyle.border}`, color: typeStyle.color, marginTop: 3 }}>{event.type}</span>
          </div>

          {/* Countdown */}
          {!isPast && (
            <div style={{ marginBottom: 14 }}>
              <CountdownChip event={event} />
            </div>
          )}

          {/* Description */}
          {event.description ? (
            <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.7, marginBottom: 20 }}>{event.description}</p>
          ) : (
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>No description provided.</p>
          )}

          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 16 }} />

          {/* Meta rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {metaRows.map((row, i) => (
              <div key={i} className="detail-meta-row">
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${row.color}18`, border: `1px solid ${row.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={row.icon} size={14} color={row.color} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <span style={{ fontSize: 10, color: "#475569", fontFamily: "'Outfit', sans-serif", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>{row.label}</span>
                  <span style={{ fontSize: 13, color: "#CBD5E1" }}>{row.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-ghost" onClick={onClose} style={{ padding: "11px 20px" }}>Close</button>
            <button
              className="btn-primary-glow"
              style={{ flex: 1, justifyContent: "center", padding: "11px", animation: alreadyJoined ? "none" : "glowPulse 3s ease infinite" }}
              disabled={alreadyJoined || isPast}
              onClick={() => { onClose(); onRegister(); }}
            >
              {alreadyJoined
                ? <><Icon name="check" size={14} color="#4ade80" /> Registered</>
                : isPast
                  ? <>Event Ended</>
                  : <>Register Now <Icon name="arrowRight" size={14} color="white" /></>
              }
            </button>

            {/* Show QR button only if user is registered */}
            {alreadyJoined && (
              <button
                className="btn-ghost"
                style={{ padding: "11px 18px" }}
                onClick={() => setShowQR(true)}
              >
                <Icon name="check" size={13} color="#6EE7B7" />
                View QR
              </button>
            )}
          </div>

          {/* Display QR for attendance scanning */}
          {showQR && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(7,9,26,0.78)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 240 }}>
              <div style={{ width: "min(92vw, 360px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)", background: "#0D1130", boxShadow: "0 30px 80px rgba(0,0,0,0.5)", padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 17, color: "#E2E8F0" }}>Attendance QR</h3>
                  <button
                    className="btn-ghost"
                    style={{ padding: "6px 10px", fontSize: 12 }}
                    onClick={() => setShowQR(false)}
                  >
                    Close
                  </button>
                </div>

                <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", padding: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <QRCodeCanvas value={qrData} size={210} bgColor="#ffffff" fgColor="#0F172A" includeMargin />
                </div>

                <p style={{ color: "#94A3B8", fontSize: 13, textAlign: "center" }}>Show this QR for attendance</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetailsModal;
