import Icon from "./icon";
import EventCard from "./EventCard";

function EventsGrid({ events, registeredIds, activeTab, onDetails, onRegister, onAddToCalendar, wishlistIds, wishlistLoadingMap, onToggleWishlist, registrationMetaByEventId = {} }) {
  if (events.length === 0) {
    return (
      <div className="events-grid animate-fadeUp" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, animationDelay: "0.2s" }}>
        <div className="empty-state">
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Icon name="calendar" size={28} color="#6366F1" />
          </div>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#64748B", marginBottom: 8 }}>
            {activeTab === "registered" ? "No registrations yet"
              : activeTab === "upcoming"   ? "No upcoming events"
              : activeTab === "completed"  ? "No completed events"
              : "No events found"}
          </h3>
          <p style={{ fontSize: 14 }}>
            {activeTab === "registered" ? "Register for events to see them here" : "Try adjusting your filters"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-grid animate-fadeUp" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, animationDelay: "0.2s" }}>
      {events.map((event, idx) => (
        <EventCard
          key={event._id}
          event={event}
          registrationMeta={registrationMetaByEventId[event._id] || null}
          alreadyRegistered={registeredIds.has(event._id)}
          onDetails={onDetails}
          onRegister={onRegister}
          onAddToCalendar={onAddToCalendar}
          isSaved={wishlistIds.includes(event._id)}
          wishlistLoading={Boolean(wishlistLoadingMap[event._id])}
          onToggleWishlist={onToggleWishlist}
          style={{ animationDelay: `${idx * 0.04}s` }}
        />
      ))}
    </div>
  );
}

export default EventsGrid;
