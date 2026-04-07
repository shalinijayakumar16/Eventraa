import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../hooks/useToast";

// Styles & constants
import { STYLES } from "../constants/styles";

// Components
import BlobBg            from "../components/BlobBg";
import Topbar            from "../components/Topbar";
import ProfileDropdown   from "../components/ProfileDropdown";
import Sidebar           from "../components/Sidebar";
import StatsRow          from "../components/StatsRow";
import TabBar            from "../components/TabBar";
import SearchFilterBar   from "../components/SearchFilterBar";
import EventsGrid        from "../components/EventsGrid";
import WishlistPage      from "../components/WishlistPage";
import RecommendedEvents from "../components/RecommendedEvents";
import EventDetailsModal from "../components/EventDetailsModal";
import RegistrationModal from "../components/RegistrationModal";
import NotificationPanel from "../components/NotificationPanel";

function StudentDashboard() {
  const { showToast } = useToast();
  const [events, setEvents]           = useState([]);
  const [myEvents, setMyEvents]       = useState([]);
  const [user, setUser]               = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistLoadingMap, setWishlistLoadingMap] = useState({});

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Modals
  const [detailsEvent, setDetailsEvent]   = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formValues, setFormValues]       = useState({});

  // Tabs + filters + search
  const [activeTab, setActiveTab]   = useState("all");

  // Store search input value
  const [searchTerm, setSearchTerm] = useState("");

  // Store selected filter values
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const userId = localStorage.getItem("userId");
  const wishlistStorageKey = `eventra_wishlist_${userId || "guest"}`;

  useEffect(() => { fetchEvents(); }, []);
  useEffect(() => { fetchMyEvents(); fetchUser(); fetchWishlistIds(); fetchNotificationSummary(); }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      fetchNotificationSummary();
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  /* ── API calls ─────────────────────────────────────────────────────────── */
  const fetchEvents = async () => {
    try {
      // Fetch only approved events for student dashboard
      let url = `http://localhost:5000/api/events?`;
      if (userId)     url += `userId=${userId}`;
      const res  = await fetch(url);
      const data = await res.json();

      // Approval system acts as a filter layer
      // Ensure unapproved events are hidden
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        setEvents([...(data.active || []), ...(data.expired || [])]);
      }
    } catch (err) { console.log(err); setEvents([]); }
  };

  const fetchMyEvents = async () => {
    try {
      const res  = await fetch(`http://localhost:5000/api/registrations/my-events/${userId}`);
      const data = await res.json();
      setMyEvents(Array.isArray(data) ? data : []);
    } catch (err) { console.log(err); setMyEvents([]); }
  };

  const fetchUser = async () => {
    try {
      const res  = await fetch(`/api/users/user/${userId}`);
      const data = await res.json();
      setUser(data);
    } catch (err) { console.log(err); }
  };

  const normalizeWishlistIds = useCallback((payload) => {
    const list = Array.isArray(payload) ? payload : payload?.events || [];

    return list
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.event?._id) return item.event._id;
        if (item?.eventId?._id) return item.eventId._id;
        return item?._id || item?.eventId || null;
      })
      .filter(Boolean);
  }, []);

  const fetchWishlistIds = useCallback(async () => {
    try {
      const response = await fetch("/api/wishlist", {
        headers: userId ? { "x-user-id": userId } : {},
      });

      if (!response.ok) {
        throw new Error("Wishlist API unavailable");
      }

      const payload = await response.json();
      const ids = normalizeWishlistIds(payload);

      setWishlistIds(ids);
      localStorage.setItem(wishlistStorageKey, JSON.stringify(ids));
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem(wishlistStorageKey) || "[]");
      setWishlistIds(Array.isArray(fallback) ? fallback : []);
    }
  }, [normalizeWishlistIds, userId, wishlistStorageKey]);

  const fetchNotificationSummary = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications", {
        headers: userId ? { "x-user-id": userId } : {},
      });

      if (!response.ok) {
        throw new Error("Notification API unavailable");
      }

      const payload = await response.json();
      const list = Array.isArray(payload) ? payload : payload.notifications || [];

      const normalized = list.map((item, index) => ({
        _id: item._id || `summary-${index}`,
        message: item.message || "Notification",
        createdAt: item.createdAt || new Date().toISOString(),
        read: Boolean(item.read),
      }));

      setNotifications(normalized);
      setUnreadCount(normalized.filter((item) => !item.read).length);
    } catch (error) {
      // Keep existing state if API is unavailable
    }
  }, [userId]);

  const handleToggleWishlist = useCallback(async (eventId) => {
    if (!eventId) return;

    // Toggle wishlist status for this event
    const willSave = !wishlistIds.includes(eventId);

    setWishlistLoadingMap((prev) => ({ ...prev, [eventId]: true }));
    setWishlistIds((prev) => {
      const updated = willSave ? [...prev, eventId] : prev.filter((id) => id !== eventId);
      localStorage.setItem(wishlistStorageKey, JSON.stringify(updated));
      return updated;
    });

    try {
      const response = await fetch(`/api/wishlist/${eventId}`, {
        method: willSave ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(userId ? { "x-user-id": userId } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Wishlist API unavailable");
      }
    } catch (error) {
      // LocalStorage fallback already applied
    } finally {
      setWishlistLoadingMap((prev) => {
        const next = { ...prev };
        delete next[eventId];
        return next;
      });
    }
  }, [userId, wishlistIds, wishlistStorageKey]);

  const handleNotificationsUpdate = useCallback((list) => {
    setNotifications(list);
    setUnreadCount(list.filter((item) => !item.read).length);
  }, []);

  const handleToggleNotifications = useCallback(() => {
    // Toggle notification panel visibility
    setShowNotifications((previous) => !previous);
    setShowProfile(false);
  }, []);

  /* ── Registration submit ───────────────────────────────────────────────── */
  const handleSubmitForm = async () => {
    for (let field of selectedEvent.formFields || []) {
      if (field.required && !formValues[field.label]) {
        showToast(`${field.label} is required`, "warning");
        return;
      }
    }
    try {
      await fetch("http://localhost:5000/api/registrations/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          eventId: selectedEvent._id,
          answers: Object.entries(formValues).map(([q, a]) => ({ question: q, answer: a })),
        }),
      });
      showToast("Registered successfully 🎉", "success");
      setMyEvents(prev => [...prev, { eventId: selectedEvent._id }]);

      // Add a local success notification for immediate UX feedback
      setNotifications((prev) => {
        const created = {
          _id: `local-${Date.now()}`,
          message: `You successfully registered for ${selectedEvent.title}`,
          createdAt: new Date().toISOString(),
          read: false,
        };
        const updated = [created, ...prev];
        setUnreadCount(updated.filter((item) => !item.read).length);
        return updated;
      });

      setSelectedEvent(null);
      setFormValues({});
      fetchMyEvents();
    } catch (err) { console.log(err); }
  };

  /* ── Logout ────────────────────────────────────────────────────────────── */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  /* ── Derived data ──────────────────────────────────────────────────────── */
  const now = new Date();

  const registeredIds = useMemo(() => new Set(myEvents.map(e => e.eventId?._id || e.eventId)), [myEvents]);

  const departmentOptions = useMemo(() => {
    return [...new Set(events.map((event) => event.department).filter(Boolean))].sort();
  }, [events]);

  // Filter events based on user input
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const isPast    = eventDate < now;

    if (activeTab === "registered" && !registeredIds.has(event._id)) return false;
    if (activeTab === "upcoming"   && isPast)                         return false;
    if (activeTab === "completed"  && !isPast)                        return false;

    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = selectedDepartment
      ? event.department === selectedDepartment
      : true;

    const normalizedType = String(event.type || "").toLowerCase();
    const matchesType = selectedType
      ? (selectedType === "Tech"
          ? (normalizedType === "tech" || normalizedType === "technical")
          : normalizedType === selectedType.toLowerCase())
      : true;

    const eventDateKey = event.date ? new Date(event.date).toISOString().slice(0, 10) : "";
    const matchesDate = selectedDate
      ? eventDateKey === selectedDate
      : true;

    // Return only matching events
    return matchesSearch && matchesDepartment && matchesType && matchesDate;
  });

  /* ── Stats ─────────────────────────────────────────────────────────────── */
  const totalEvents     = events.length;
  const registeredCount = myEvents.length;
  const upcomingCount   = events.filter(e => new Date(e.date) >= now).length;
  const departmentCount = [...new Set(events.map(e => e.department))].filter(Boolean).length;

  const tabCounts = {
    all:        events.length,
    registered: registeredIds.size,
    upcoming:   events.filter(e => new Date(e.date) >= now).length,
    completed:  events.filter(e => new Date(e.date) < now).length,
    wishlist:   wishlistIds.length,
  };

  /* ── Handlers passed down ──────────────────────────────────────────────── */
  const handleOpenRegister = (event) => {
    setSelectedEvent(event);
    setFormValues({});
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("");
    setSelectedType("");
    setSelectedDate("");
  };

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{STYLES}</style>
      <div style={{ background: "#07091A", minHeight: "100vh", color: "#E2E8F0", position: "relative" }}>
        <BlobBg />

        <Topbar
          user={user}
          showProfile={showProfile}
          unreadCount={unreadCount}
          onToggleNotifications={handleToggleNotifications}
          onToggleProfile={() => {
            setShowNotifications(false);
            setShowProfile(p => !p);
          }}
          onLogout={handleLogout}
        />

        <NotificationPanel
          open={showNotifications}
          userId={userId}
          onClose={() => setShowNotifications(false)}
          onNotificationsUpdate={handleNotificationsUpdate}
        />

        {showProfile && (
          <ProfileDropdown user={user} />
        )}

        {/* Page layout */}
        <div
          style={{ display: "flex", position: "relative", zIndex: 1 }}
          onClick={() => {
            if (showProfile) setShowProfile(false);
            if (showNotifications) setShowNotifications(false);
          }}
        >
          <Sidebar myEvents={myEvents} registeredCount={registeredCount} />

          <main
            className="main-content"
            style={{ flex: 1, padding: "40px 36px 60px", maxWidth: "calc(100vw - 260px)" }}
          >
            {/* Heading */}
            <div className="animate-fadeUp" style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 6 }}>
                <span className="gradient-text">Discover</span>{" "}
                <span style={{ color: "#E2E8F0" }}>Campus Events</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: 15 }}>Browse and register for events happening across all departments</p>
              <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 12px", borderRadius: 999, border: "1px solid rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.1)", color: "#6EE7B7", fontSize: 12, fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>
                <span aria-hidden="true">✔</span> Verified Events
              </div>
              <p style={{ color: "#475569", fontSize: 12, marginTop: 8 }}>All events are verified by admin</p>
            </div>

            {/* Maintain compatibility with attendance feature */}
            {/* Approval system does not affect attendance flow */}

            <StatsRow
              totalEvents={totalEvents}
              registeredCount={registeredCount}
              upcomingCount={upcomingCount}
              departmentCount={departmentCount}
            />

            <RecommendedEvents
              userId={userId}
              registeredIds={registeredIds}
              wishlistIds={wishlistIds}
              wishlistLoadingMap={wishlistLoadingMap}
              onToggleWishlist={handleToggleWishlist}
              onDetails={setDetailsEvent}
              onRegister={handleOpenRegister}
            />

            <TabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabCounts={tabCounts}
            />

            {activeTab !== "wishlist" && (
              <SearchFilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedDepartment={selectedDepartment}
                setSelectedDepartment={setSelectedDepartment}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                departmentOptions={departmentOptions}
                filteredCount={filteredEvents.length}
                onClearFilters={handleClearFilters}
              />
            )}

            {activeTab === "wishlist" ? (
              <WishlistPage
                active={activeTab === "wishlist"}
                userId={userId}
                allEvents={events}
                wishlistIds={wishlistIds}
                wishlistLoadingMap={wishlistLoadingMap}
                registeredIds={registeredIds}
                onDetails={setDetailsEvent}
                onRegister={handleOpenRegister}
                onToggleWishlist={handleToggleWishlist}
              />
            ) : (
              <EventsGrid
                events={filteredEvents}
                registeredIds={registeredIds}
                activeTab={activeTab}
                onDetails={setDetailsEvent}
                onRegister={handleOpenRegister}
                wishlistIds={wishlistIds}
                wishlistLoadingMap={wishlistLoadingMap}
                onToggleWishlist={handleToggleWishlist}
              />
            )}
          </main>
        </div>

        {/* Details modal */}
        {detailsEvent && (
          <EventDetailsModal
            event={detailsEvent}
            alreadyJoined={registeredIds.has(detailsEvent._id)}
            userId={userId}
            onClose={() => setDetailsEvent(null)}
            onRegister={() => {
              setSelectedEvent(detailsEvent);
              setFormValues({});
              setDetailsEvent(null);
            }}
          />
        )}

        {/* Registration modal */}
        {selectedEvent && (
          <RegistrationModal
            event={selectedEvent}
            formValues={formValues}
            onFormChange={setFormValues}
            onSubmit={handleSubmitForm}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </>
  );
}

export default StudentDashboard;