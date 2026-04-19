/**
 * ExternalEventCard Component
 * ──────────────────────────────────────────────────────
 * Displays a card for an external event (from other colleges)
 * Features:
 *   - Shows event title, college name, date, description
 *   - "Register" button opens external registration link
 *   - Styled to match the existing EventCard design
 *   - Handles past events gracefully
 */

import Icon from "./icon";

function ExternalEventCard({ event }) {
  // Check if event date has passed
  const isPast = new Date(event.date) < new Date();

  // Format date in Indian format (DD MMM YYYY)
  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  /**
   * Handle registration click
   * Opens the external registration link in a new tab
   */
  const handleRegisterClick = () => {
    if (event.registration_link) {
      window.open(event.registration_link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div style={{
      background: "rgba(15,17,41,0.8)",
      border: "1px solid rgba(99,102,241,0.25)",
      borderRadius: 14,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
      backdropFilter: "blur(8px)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "rgba(99,102,241,0.45)";
      e.currentTarget.style.background = "rgba(20,23,55,0.9)";
      e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
      e.currentTarget.style.background = "rgba(15,17,41,0.8)";
      e.currentTarget.style.boxShadow = "none";
    }}
    >
      {/* Header with gradient background */}
      <div style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))",
        padding: "14px 16px",
        borderBottom: "1px solid rgba(99,102,241,0.15)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 8,
      }}>
        {/* Title */}
        <h3 style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          fontSize: 15,
          color: "#E2E8F0",
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
          flex: 1,
        }}>
          {event.title}
        </h3>

        {/* Past event badge */}
        {isPast && (
          <div style={{
            padding: "3px 10px",
            borderRadius: 999,
            background: "rgba(148,51,209,0.15)",
            fontSize: 11,
            color: "#D8B4FE",
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            border: "1px solid rgba(168,85,247,0.3)",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
            Past
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        flex: 1,
      }}>
        {/* College name with icon */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "#94A3B8",
          fontSize: 13,
        }}>
          <Icon name="filter" size={13} color="#6366F1" />
          <span style={{ fontWeight: 500 }}>
            {event.college_name}
          </span>
        </div>

        {/* Event date with calendar icon */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "#94A3B8",
          fontSize: 13,
        }}>
          <Icon name="calendar" size={13} color="#8B5CF6" />
          <span>{formattedDate}</span>
        </div>

        {/* Event source (LinkedIn, TechCrunch, etc.) */}
        {event.source && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#94A3B8",
            fontSize: 13,
          }}>
            <Icon name="link" size={13} color="#F59E0B" />
            <span>Source: {event.source}</span>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p style={{
            fontSize: 12,
            color: "#CBD5E1",
            lineHeight: 1.5,
            marginTop: 4,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {event.description}
          </p>
        )}
      </div>

      {/* Footer with Register button */}
      <div style={{
        padding: "12px 16px",
        borderTop: "1px solid rgba(99,102,241,0.15)",
        display: "flex",
        gap: 10,
      }}>
        <button
          onClick={handleRegisterClick}
          disabled={isPast}
          style={{
            flex: 1,
            padding: "10px 16px",
            borderRadius: 10,
            border: "none",
            background: isPast 
              ? "rgba(99,102,241,0.1)" 
              : "linear-gradient(135deg, rgba(99,102,241,0.8), rgba(168,85,247,0.8))",
            color: isPast ? "#64748B" : "#F0F4F8",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'Outfit', sans-serif",
            cursor: isPast ? "not-allowed" : "pointer",
            transition: "all 0.22s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            opacity: isPast ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isPast) {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(168,85,247,0.95))";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(99,102,241,0.25)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isPast) {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(99,102,241,0.8), rgba(168,85,247,0.8))";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
        >
          <Icon name="link" size={13} color={isPast ? "#64748B" : "#F0F4F8"} />
          {isPast ? "Closed" : "Register"}
        </button>
      </div>
    </div>
  );
}

export default ExternalEventCard;
