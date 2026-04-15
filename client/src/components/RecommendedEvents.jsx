import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { apiUrl } from "../constants/api";

function RecommendedEvents({
  userId,
  registeredIds,
  wishlistIds,
  wishlistLoadingMap,
  onToggleWishlist,
  onDetails,
  onRegister,
  onAddToCalendar,
}) {
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId) return;

    const fetchRecommendedEvents = async () => {
      setLoading(true);

      try {
        // Fetch recommendations from participation-history endpoint
        const response = await fetch(apiUrl(`/api/recommendations/${userId}`), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          throw new Error("Recommendation API unavailable");
        }

        const payload = await response.json();

        // Normalize API response fields to EventCard contract.
        const normalized = Array.isArray(payload)
          ? payload.map((event) => ({
              _id: event.eventId || event._id,
              title: event.title,
              department: event.department,
              eventType: event.eventType || event.type,
              type: event.eventType || event.type,
              date: event.date,
              poster: event.poster || "",
              applyBy: event.applyBy || null,
              venue: event.venue || "",
              approvalStatus: "approved",
              eventState: "active",
            }))
          : [];

        setRecommendedEvents(normalized.slice(0, 5));
      } catch (error) {
        setRecommendedEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedEvents();
  }, [userId, token]);

  return (
    <section className="animate-fadeUp" style={{ marginBottom: 26 }}>
      <h2
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
          marginBottom: 14,
          letterSpacing: "-0.02em",
          color: "#E2E8F0",
        }}
      >
        ✨ Recommended for You
      </h2>

      {loading ? (
        <div style={{ color: "#94A3B8", fontSize: 14, padding: "12px 2px" }}>Loading recommendations...</div>
      ) : recommendedEvents.length === 0 ? (
        <div
          style={{
            border: "1px dashed rgba(255,255,255,0.12)",
            borderRadius: 14,
            padding: "14px 16px",
            color: "#64748B",
            background: "rgba(255,255,255,0.02)",
            fontSize: 14,
          }}
        >
          No recommendations available
        </div>
      ) : (
        // Render list of recommended events
        <div className="events-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {recommendedEvents.slice(0, 5).map((event) => (
            <EventCard
              key={event._id}
              event={event}
              alreadyRegistered={registeredIds.has(event._id)}
              onDetails={onDetails}
              onRegister={onRegister}
              onAddToCalendar={onAddToCalendar}
              isSaved={wishlistIds.includes(event._id)}
              wishlistLoading={Boolean(wishlistLoadingMap[event._id])}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default RecommendedEvents;
