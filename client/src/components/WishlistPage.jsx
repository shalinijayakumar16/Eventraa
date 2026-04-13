import { useCallback, useEffect, useMemo, useState } from "react";
import EventCard from "./EventCard";
import Icon from "./icon";
import { apiUrl } from "../constants/api";

function WishlistPage({
  active,
  userId,
  allEvents,
  wishlistIds,
  wishlistLoadingMap,
  registeredIds,
  onDetails,
  onRegister,
  onAddToCalendar,
  onToggleWishlist,
}) {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fallbackEvents = useMemo(
    () => allEvents.filter((event) => wishlistIds.includes(event._id)),
    [allEvents, wishlistIds]
  );

  const fetchSavedEvents = useCallback(async () => {
    if (!active) return;

    setLoading(true);

    try {
      // Fetch all saved events for the logged-in user
      const response = await fetch(apiUrl("/api/wishlist"), {
        headers: userId ? { "x-user-id": userId } : {},
      });

      if (!response.ok) {
        throw new Error("Wishlist API unavailable");
      }

      const payload = await response.json();
      const list = Array.isArray(payload) ? payload : payload.events || [];

      const normalized = list
        .map((item) => item.event || item)
        .filter((item) => item && item._id);

      if (normalized.length === 0) {
        setSavedEvents(fallbackEvents);
      } else {
        setSavedEvents(normalized);
      }
    } catch (error) {
      // Fallback to local event cache if backend wishlist API is not ready
      setSavedEvents(fallbackEvents);
    } finally {
      setLoading(false);
    }
  }, [active, fallbackEvents, userId]);

  useEffect(() => {
    fetchSavedEvents();
  }, [fetchSavedEvents]);

  if (!active) return null;

  return (
    <div className="animate-fadeUp" style={{ animationDelay: "0.2s" }}>
      {loading ? (
        <div style={{ color: "#94A3B8", fontSize: 14, padding: "14px 2px" }}>Loading saved events...</div>
      ) : savedEvents.length === 0 ? (
        <div className="empty-state">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Icon name="star" size={28} color="#F59E0B" />
          </div>
          <h3
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: "#64748B",
              marginBottom: 8,
            }}
          >
            No saved events yet
          </h3>
          <p style={{ fontSize: 14 }}>Tap the star icon on any event card to save it.</p>
        </div>
      ) : (
        <div className="events-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {savedEvents.map((event) => (
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
    </div>
  );
}

export default WishlistPage;
