import { useEffect, useRef, useState } from "react";
import Icon from "./icon";
import CountdownChip from "./CountdownChip";
import { TYPE_STYLE } from "../constants/config";
import { assetUrl } from "../constants/api";

function EventCard({
  event,
  registrationMeta,
  alreadyRegistered,
  onDetails,
  onRegister,
  onAddToCalendar,
  isSaved,
  wishlistLoading,
  onToggleWishlist,
}) {
  const [calendarAdded, setCalendarAdded] = useState(false);
  const calendarTimerRef = useRef(null);
  const displayEventType = event.eventType || event.type || "Other";

  useEffect(() => {
    return () => {
      if (calendarTimerRef.current) {
        clearTimeout(calendarTimerRef.current);
      }
    };
  }, []);

  // Hide unapproved events
  if (event.approvalStatus && event.approvalStatus !== "approved") return null;

  const typeStyle = TYPE_STYLE[displayEventType] || TYPE_STYLE.default;
  const isPast    = new Date(event.date) < new Date();
  const isCompleted = event.eventState === "completed";
  const isUnavailable = isPast || isCompleted;
  const attendanceStatus = registrationMeta?.attendance || (registrationMeta?.attended ? "present" : "registered");
  const canDownloadCertificate =
    Boolean(registrationMeta?.certificateGenerated) &&
    attendanceStatus === "present" &&
    Boolean(registrationMeta?.certificateUrl);

  return (
    <div className="event-card">
      {/* Poster / placeholder */}
      {event.poster ? (
        <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
          <img
            src={assetUrl(event.poster)}
            alt="poster"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(7,9,26,0.7), transparent)" }} />
          {isPast && (
            <div style={{ position: "absolute", top: 10, right: 10, padding: "3px 10px", borderRadius: 999, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", fontSize: 11, color: "#94A3B8", fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)" }}>Past</div>
          )}
          {isCompleted && !isPast && (
            <div style={{ position: "absolute", top: 10, right: 10, padding: "3px 10px", borderRadius: 999, background: "rgba(34,197,94,0.16)", backdropFilter: "blur(8px)", fontSize: 11, color: "#86EFAC", fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "1px solid rgba(34,197,94,0.25)" }}>Completed 🎉</div>
          )}
          {alreadyRegistered && (
            <div style={{ position: "absolute", top: 10, left: 10, padding: "3px 10px", borderRadius: 999, background: "rgba(74,222,128,0.15)", backdropFilter: "blur(8px)", fontSize: 11, color: "#4ade80", fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "1px solid rgba(74,222,128,0.3)", display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="check" size={10} color="#4ade80" /> Registered
            </div>
          )}
        </div>
      ) : (
        <div style={{ height: 120, background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(236,72,153,0.08))", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <Icon name="calendar" size={32} color="rgba(99,102,241,0.3)" />
          {isPast && (
            <div style={{ position: "absolute", top: 10, right: 10, padding: "3px 10px", borderRadius: 999, background: "rgba(0,0,0,0.3)", fontSize: 11, color: "#64748B", fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "1px solid rgba(255,255,255,0.07)" }}>Past</div>
          )}
          {isCompleted && !isPast && (
            <div style={{ position: "absolute", top: 10, right: 10, padding: "3px 10px", borderRadius: 999, background: "rgba(34,197,94,0.14)", fontSize: 11, color: "#86EFAC", fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "1px solid rgba(34,197,94,0.22)" }}>Completed 🎉</div>
          )}
          {alreadyRegistered && (
            <div style={{ position: "absolute", top: 10, left: 10, padding: "3px 10px", borderRadius: 999, background: "rgba(74,222,128,0.12)", fontSize: 11, color: "#4ade80", fontFamily: "'Outfit', sans-serif", fontWeight: 600, border: "1px solid rgba(74,222,128,0.25)", display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="check" size={10} color="#4ade80" /> Registered
            </div>
          )}
        </div>
      )}

      {/* Card body */}
      <div style={{ padding: "18px 18px 14px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {/* Title + badge */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: "#E2E8F0", letterSpacing: "-0.01em", lineHeight: 1.3 }}>
            {event.title}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {/* Indicate event is verified by admin */}
            <span className="badge-pill" style={{ background: "rgba(16,185,129,0.14)", border: "1px solid rgba(16,185,129,0.34)", color: "#6EE7B7" }}>
              <Icon name="check" size={10} color="#6EE7B7" /> Approved
            </span>
            <span className="badge-pill" style={{ background: typeStyle.bg, border: `1px solid ${typeStyle.border}`, color: typeStyle.color }}>
              {displayEventType}
            </span>

            {/* Toggle wishlist status for this event */}
            <button
              type="button"
              onClick={() => onToggleWishlist(event._id)}
              disabled={wishlistLoading}
              title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                border: isSaved ? "1px solid rgba(245,158,11,0.5)" : "1px solid rgba(255,255,255,0.1)",
                background: isSaved ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)",
                cursor: wishlistLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: wishlistLoading ? 0.7 : 1,
              }}
            >
              <Icon name={isSaved ? "starFilled" : "star"} size={14} color={isSaved ? "#F59E0B" : "#94A3B8"} />
            </button>
          </div>
        </div>

        {/* Meta */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#94A3B8", fontSize: 13 }}>
            <Icon name="filter" size={13} color="#6366F1" />
            {event.department}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#94A3B8", fontSize: 13 }}>
            <Icon name="calendar" size={13} color="#8B5CF6" />
            {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </div>
          {event.applyBy && (
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#94A3B8", fontSize: 13 }}>
              <Icon name="clock" size={13} color="#F59E0B" />
              Apply by {new Date(event.applyBy).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          )}
          {event.venue && (
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#94A3B8", fontSize: 13 }}>
              <Icon name="map" size={13} color="#EC4899" />
              {event.venue}
            </div>
          )}
        </div>

        {/* Countdown chips */}
        {!isPast && (
          <div style={{ marginTop: 2 }}>
            <CountdownChip event={event} />
          </div>
        )}

        {/* Buttons */}
        <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", display: "grid", gap: 8 }}>
          {canDownloadCertificate && (
            <button
              className="btn-ghost"
              style={{
                justifyContent: "center",
                fontSize: 12,
                padding: "9px 10px",
                border: "1px solid rgba(16,185,129,0.42)",
                background: "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(45,212,191,0.12))",
                color: "#99F6E4",
              }}
              onClick={() => {
                const certificateLink = registrationMeta?.certificateUrl;
                if (!certificateLink) return;
                window.open(assetUrl(certificateLink), "_blank", "noopener,noreferrer");
              }}
              title="Download your certificate"
            >
              <Icon name="download" size={13} color="#6EE7B7" />
              Download Certificate
            </button>
          )}
          <button
            className="btn-ghost"
            style={{
              justifyContent: "center",
              fontSize: 12,
              padding: "9px 10px",
              border: calendarAdded ? "1px solid rgba(74,222,128,0.45)" : "1px solid rgba(45,212,191,0.35)",
              background: calendarAdded
                ? "linear-gradient(135deg, rgba(74,222,128,0.2), rgba(16,185,129,0.14))"
                : "linear-gradient(135deg, rgba(45,212,191,0.16), rgba(59,130,246,0.12))",
              color: calendarAdded ? "#86EFAC" : "#99F6E4",
            }}
            onClick={() => {
              onAddToCalendar?.(event);
              setCalendarAdded(true);

              if (calendarTimerRef.current) {
                clearTimeout(calendarTimerRef.current);
              }

              calendarTimerRef.current = setTimeout(() => {
                setCalendarAdded(false);
                calendarTimerRef.current = null;
              }, 2000);
            }}
            title="Add this event to Google Calendar"
          >
            <Icon name={calendarAdded ? "check" : "calendar"} size={13} color={calendarAdded ? "#86EFAC" : "#5EEAD4"} />
            {calendarAdded ? "Added to Calendar" : "📅 Add to Calendar"}
          </button>
          <button
            className="btn-ghost"
            style={{ flex: 1, justifyContent: "center", fontSize: 12, padding: "9px 10px" }}
            onClick={() => onDetails(event)}
          >
            <Icon name="info" size={13} color="#94A3B8" />
            Details
          </button>
          <button
            className="btn-primary-glow"
            style={{ flex: 1, justifyContent: "center", fontSize: 12, padding: "9px 10px" }}
            disabled={isUnavailable}
            onClick={() => {
              // Show QR only for registered users
              if (alreadyRegistered) {
                onDetails(event);
                return;
              }

              onRegister(event);
            }}
          >
            {alreadyRegistered ? (
              <><Icon name="check" size={13} color="#4ade80" /> View QR</>
            ) : isCompleted ? (
              <>Completed 🎉</>
            ) : isPast ? (
              <>Ended</>
            ) : (
              <>Register <Icon name="arrowRight" size={13} color="white" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
