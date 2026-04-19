/**
 * OtherCollegeEvents Component
 * ──────────────────────────────────────────────────────
 * Displays a section for events from other colleges
 * Features:
 *   - Fetches external events from /api/external-events
 *   - Shows events in a grid layout
 *   - Loading state with skeleton
 *   - Error handling with fallback UI
 *   - Sorted by date (upcoming first)
 */

import { useEffect, useState } from "react";
import { apiUrl } from "../constants/api";
import { useToast } from "../hooks/useToast";
import ExternalEventCard from "./ExternalEventCard";
import Icon from "./icon";

function OtherCollegeEvents() {
  // State management
  const [externalEvents, setExternalEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  /**
   * Fetch external events from API
   * Called on component mount
   */
  const fetchExternalEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch external events from API endpoint
      const response = await fetch(`${apiUrl("/api/external-events")}?limit=12&sort=asc`);

      if (!response.ok) {
        throw new Error("Failed to fetch external events");
      }

      const data = await response.json();

      // Extract events from response
      if (data.success && data.data) {
        setExternalEvents(data.data);
      } else {
        setExternalEvents([]);
      }
    } catch (err) {
      console.error("Error fetching external events:", err);
      setError(err.message);
      // Don't show error toast, just log it silently
    } finally {
      setLoading(false);
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchExternalEvents();
  }, []);

  // Loading state - show skeleton loaders
  if (loading) {
    return (
      <div style={{
        marginTop: 32,
        padding: "20px 0",
        borderTop: "1px solid rgba(99,102,241,0.15)",
        borderBottom: "1px solid rgba(99,102,241,0.15)",
      }}>
        {/* Section title */}
        <div style={{
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <Icon name="globe" size={20} color="#6366F1" />
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: "#E2E8F0",
            letterSpacing: "-0.01em",
          }}>
            Other College Events
          </h2>
        </div>

        {/* Skeleton grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                height: 320,
                background: "rgba(99,102,241,0.1)",
                borderRadius: 14,
                border: "1px solid rgba(99,102,241,0.2)",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  // No events state
  if (!externalEvents || externalEvents.length === 0) {
    return (
      <div style={{
        marginTop: 32,
        padding: "32px 20px",
        borderTop: "1px solid rgba(99,102,241,0.15)",
        borderBottom: "1px solid rgba(99,102,241,0.15)",
        textAlign: "center",
      }}>
        {/* Section title */}
        <div style={{
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}>
          <Icon name="globe" size={20} color="#6366F1" />
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: "#E2E8F0",
            letterSpacing: "-0.01em",
          }}>
            Other College Events
          </h2>
        </div>

        {/* Empty state message */}
        <div style={{
          color: "#94A3B8",
          fontSize: 14,
          lineHeight: 1.6,
        }}>
          <Icon name="inbox" size={32} color="rgba(99,102,241,0.3)" style={{ marginBottom: 12 }} />
          <p>No external events available at the moment.</p>
          <p style={{ fontSize: 12, marginTop: 8, color: "#64748B" }}>
            Check back soon for exciting opportunities!
          </p>
        </div>
      </div>
    );
  }

  // Render section with events
  return (
    <div style={{
      marginTop: 32,
      padding: "20px 0",
      borderTop: "1px solid rgba(99,102,241,0.15)",
      borderBottom: "1px solid rgba(99,102,241,0.15)",
    }}>
      {/* Section header with title and icon */}
      <div style={{
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <Icon name="globe" size={20} color="#6366F1" />
        <h2 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 18,
          fontWeight: 700,
          color: "#E2E8F0",
          letterSpacing: "-0.01em",
        }}>
          Other College Events
        </h2>
        {/* Event count badge */}
        <span style={{
          marginLeft: "auto",
          padding: "4px 12px",
          borderRadius: 20,
          background: "rgba(99,102,241,0.15)",
          fontSize: 12,
          color: "#A5B4FC",
          fontWeight: 600,
          border: "1px solid rgba(99,102,241,0.25)",
        }}>
          {externalEvents.length} event{externalEvents.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Section description */}
      <p style={{
        fontSize: 13,
        color: "#94A3B8",
        marginBottom: 16,
      }}>
        Opportunities from other colleges and institutions. Click "Register" to join!
      </p>

      {/* Events grid - responsive layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16,
      }}>
        {/* Render each external event card */}
        {externalEvents.map((event) => (
          <ExternalEventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
}

export default OtherCollegeEvents;
