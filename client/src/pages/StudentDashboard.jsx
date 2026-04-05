import { useCallback, useEffect, useMemo, useState } from "react";

// Styles & constants
import { STYLES } from "../constants/styles";

// Components
import BlobBg            from "../components/BlobBg";
import Topbar            from "../components/Topbar";
import ProfileDropdown   from "../components/ProfileDropdown";
import Sidebar           from "../components/Sidebar";
import StatsRow          from "../components/StatsRow";
import TabBar            from "../components/TabBar";
import FiltersRow        from "../components/FiltersRow";
import EventsGrid        from "../components/EventsGrid";
import WishlistPage      from "../components/WishlistPage";
import EventDetailsModal from "../components/EventDetailsModal";
import RegistrationModal from "../components/RegistrationModal";
import NotificationPanel from "../components/NotificationPanel";

function StudentDashboard() {
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
  const [search, setSearch]         = useState("");
  const [department, setDepartment] = useState("");
  const [type, setType]             = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const userId = localStorage.getItem("userId");
  const wishlistStorageKey = `eventra_wishlist_${userId || "guest"}`;

  useEffect(() => { fetchEvents(); }, [department, type]);
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
      let url = `http://localhost:5000/api/events?`;
      if (department) url += `department=${department}&`;
      if (type)       url += `type=${type}&`;
      if (userId)     url += `userId=${userId}`;
      const res  = await fetch(url);
      const data = await res.json();
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
        alert(`${field.label} is required`);
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
      alert("Registered successfully 🎉");
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

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const isPast    = eventDate < now;

    if (activeTab === "registered" && !registeredIds.has(event._id)) return false;
    if (activeTab === "upcoming"   && isPast)                         return false;
    if (activeTab === "completed"  && !isPast)                        return false;

    if (search && !event.title?.toLowerCase().includes(search.toLowerCase())) return false;

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filterDate.setHours(0, 0, 0, 0);
      const eventDay = new Date(eventDate);
      eventDay.setHours(0, 0, 0, 0);
      if (eventDay < filterDate) return false;
    }

    return true;
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
    setSearch("");
    setDepartment("");
    setType("");
    setDateFilter("");
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
            </div>

            <StatsRow
              totalEvents={totalEvents}
              registeredCount={registeredCount}
              upcomingCount={upcomingCount}
              departmentCount={departmentCount}
            />

            <TabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabCounts={tabCounts}
            />

            {activeTab !== "wishlist" && (
              <FiltersRow
                search={search}
                department={department}
                type={type}
                dateFilter={dateFilter}
                filteredCount={filteredEvents.length}
                onSearchChange={setSearch}
                onDepartmentChange={setDepartment}
                onTypeChange={setType}
                onDateChange={setDateFilter}
                onClear={handleClearFilters}
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