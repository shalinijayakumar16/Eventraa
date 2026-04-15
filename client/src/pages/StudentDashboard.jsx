import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
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
import ParticipationHistory from "../components/ParticipationHistory";
import ChatbotWidget from "../components/ChatbotWidget";
import { openGoogleCalendar } from "../utils/googleCalendar";
import { apiUrl } from "../constants/api";

function StudentDashboard() {
  const { showToast } = useToast();
  const [events, setEvents]           = useState([]);
  const [activeEvents, setActiveEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
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
  const [isConfirmingRegistration, setIsConfirmingRegistration] = useState(false);
  const [detailsConflictingEvents, setDetailsConflictingEvents] = useState([]);
  const [clashDialog, setClashDialog] = useState({
    open: false,
    event: null,
    conflictingEvents: [],
  });

  // Tabs + filters + search
  const [activeTab, setActiveTab]   = useState("all");

  // Store search input value
  const [searchTerm, setSearchTerm] = useState("");

  // Store selected filter values
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const wishlistStorageKey = `eventra_wishlist_${userId || "guest"}`;

  const getAuthHeaders = useCallback(
    (extraHeaders = {}) => ({
      ...extraHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  useEffect(() => { fetchEvents(); }, [userId]);
  useEffect(() => { fetchMyEvents(); fetchUser(); fetchWishlistIds(); fetchNotificationSummary(); }, [userId, token]);

  useEffect(() => {
    const timer = setInterval(() => {
      fetchNotificationSummary();
    }, 30000);

    return () => clearInterval(timer);
  }, [userId, token]);

  /* ── API calls ─────────────────────────────────────────────────────────── */
  const fetchEvents = async () => {
    try {
      // Fetch only approved events for student dashboard
      let url = `${apiUrl("/api/events")}?`;
      if (userId)     url += `userId=${userId}`;
      const res  = await fetch(url);
      if (!res.ok) throw new Error("Unable to fetch events");
      const data = await res.json();

      // Approval system acts as a filter layer
      // Ensure unapproved events are hidden
      if (Array.isArray(data)) {
        setEvents(data);
        setActiveEvents(data);
        setCompletedEvents([]);
      } else {
        const activeList = data.active || [];
        const completedList = data.completed || data.expired || [];
        setActiveEvents(activeList);
        setCompletedEvents(completedList);
        setEvents([...activeList, ...completedList]);
      }
    } catch (err) { console.log(err); setEvents([]); setActiveEvents([]); setCompletedEvents([]); }
  };

  const fetchMyEvents = async () => {
    try {
      setMyEvents([]);
      console.log("[StudentDashboard] fetchMyEvents userId:", userId);
      console.log("[StudentDashboard] fetchMyEvents hasToken:", Boolean(token));
      const res  = await fetch(apiUrl("/api/registrations/my-events"), {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Unable to fetch registrations");
      const data = await res.json();
      console.log("[StudentDashboard] my-events API response:", data);
      setMyEvents(Array.isArray(data) ? data : []);
    } catch (err) { console.log(err); setMyEvents([]); }
  };

  const fetchUser = async () => {
    try {
      const res  = await fetch(apiUrl(`/api/users/user/${userId}`));
      if (!res.ok) throw new Error("Unable to fetch user");
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
      const response = await fetch(apiUrl("/api/wishlist"), {
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
      const response = await fetch(apiUrl("/api/notifications"), {
        headers: {
          ...(userId ? { "x-user-id": userId } : {}),
          ...getAuthHeaders(),
        },
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
  }, [userId, getAuthHeaders]);

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
      const response = await fetch(apiUrl(`/api/wishlist/${eventId}`), {
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

  const checkEventClash = useCallback(async (eventId) => {
    if (!eventId || !userId) {
      return { clash: false, conflictingEvents: [] };
    }

    try {
      const response = await fetch(apiUrl("/api/events/check-clash"), {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ userId, eventId }),
      });

      if (!response.ok) {
        return { clash: false, conflictingEvents: [] };
      }

      const payload = await response.json();

      return {
        clash: Boolean(payload?.clash),
        conflictingEvents: Array.isArray(payload?.conflictingEvents)
          ? payload.conflictingEvents
          : [],
      };
    } catch (error) {
      return { clash: false, conflictingEvents: [] };
    }
  }, [userId, getAuthHeaders]);

  const openRegistrationForm = useCallback((event) => {
    if (!event) return;

    const normalizedEventId = event._id || event.id;
    if (!normalizedEventId) {
      showToast("Invalid event. Please refresh and try again.", "error");
      return;
    }

    setSelectedEvent({ ...event, id: normalizedEventId });
    setFormValues({});
  }, [showToast]);

  /* ── Registration submit ───────────────────────────────────────────────── */
  const handleConfirmRegistration = async () => {
    if (!selectedEvent) {
      showToast("No event selected.", "error");
      return;
    }

    if (!userId) {
      showToast("Please log in to register.", "error");
      return;
    }

    const eventId = selectedEvent.id || selectedEvent._id;
    if (!eventId) {
      showToast("Invalid event ID.", "error");
      return;
    }

    for (let field of selectedEvent.formFields || []) {
      if (field.required && !formValues[field.label]) {
        showToast(`${field.label} is required`, "warning");
        return;
      }
    }

    const feedback =
      formValues.feedback ||
      formValues.ratingValue ||
      formValues.rating ||
      "";

    const rating = Number(feedback);

    const answers = Object.entries(formValues).map(([q, a]) => ({ question: q, answer: a }));

    setIsConfirmingRegistration(true);

    console.log("User:", userId);
    console.log("Event:", eventId);

    try {
      console.log("Sending request...");
      const response = await axios.post(
        apiUrl("/api/registrations"),
        {
          eventId: selectedEvent._id || selectedEvent.id,
          interestLevel: Number.isFinite(rating) ? rating : null,
          feedback,
          answers,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          timeout: 15000,
        }
      );
      console.log("Response:", response);

      showToast("Registered successfully 🎉", "success");
      setMyEvents(prev => [...prev, { eventId }]);

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
      await fetchMyEvents().catch(() => {});
      setIsConfirmingRegistration(false);
    } catch (error) {
      console.error("Registration failed:", error?.response?.data || error?.message || error);
      console.error("Registration error:", error);
      setIsConfirmingRegistration(false);
      showToast(error?.response?.data?.message || error?.message || "Registration failed", "error");
    }
  };

  /* ── Logout ────────────────────────────────────────────────────────────── */
  const handleLogout = () => {
    setEvents([]);
    setActiveEvents([]);
    setCompletedEvents([]);
    setMyEvents([]);
    setUser(null);
    setWishlistIds([]);
    setNotifications([]);
    setUnreadCount(0);
    setDetailsEvent(null);
    setSelectedEvent(null);
    setFormValues({});

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("student");
    sessionStorage.clear();

    window.location.href = "/";
  };

  /* ── Derived data ──────────────────────────────────────────────────────── */
  const now = new Date();

  const registeredIds = useMemo(() => new Set(myEvents.map(e => e.eventId?._id || e.eventId)), [myEvents]);

  const registrationMetaByEventId = useMemo(() => {
    return myEvents.reduce((acc, item) => {
      const eventId = String(item?.eventId?._id || item?.eventId || "");
      if (!eventId) return acc;

      acc[eventId] = {
        attendance: item?.attendance || (item?.attended ? "present" : "registered"),
        attended: Boolean(item?.attended),
        certificateGenerated: Boolean(item?.certificateGenerated || item?.certificateUrl),
        certificateUrl: item?.certificateUrl || "",
      };

      return acc;
    }, {});
  }, [myEvents]);

  const departmentOptions = useMemo(() => {
    return [...new Set(events.map((event) => event.department).filter(Boolean))].sort();
  }, [events]);

  const eventTypeOptions = useMemo(() => {
    return [
      ...new Set(
        events
          .map((event) => String(event.eventType || event.type || "").trim())
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [events]);

  const matchesCommonFilters = useCallback((event) => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = selectedDepartment
      ? event.department === selectedDepartment
      : true;

    const normalizedType = String(event.eventType || event.type || "").toLowerCase();
    const matchesType = selectedType
      ? normalizedType === selectedType.toLowerCase()
      : true;

    const eventDateKey = event.date ? new Date(event.date).toISOString().slice(0, 10) : "";
    const matchesDate = selectedDate
      ? eventDateKey === selectedDate
      : true;

    return matchesSearch && matchesDepartment && matchesType && matchesDate;
  }, [searchTerm, selectedDepartment, selectedType, selectedDate]);

  // Filter events based on user input
  const filteredActiveEvents = activeEvents.filter(matchesCommonFilters);
  const filteredCompletedEvents = completedEvents.filter(matchesCommonFilters);
  const filteredEvents = [...filteredActiveEvents, ...filteredCompletedEvents];

  /* ── Stats ─────────────────────────────────────────────────────────────── */
  const totalEvents     = events.length;
  const registeredCount = myEvents.length;
  const upcomingCount   = activeEvents.filter(e => new Date(e.date) >= now).length;
  const departmentCount = [...new Set(events.map(e => e.department))].filter(Boolean).length;

  const tabCounts = {
    all:        events.length,
    registered: registeredIds.size,
    upcoming:   events.filter(e => new Date(e.date) >= now).length,
    completed:  completedEvents.length,
    wishlist:   wishlistIds.length,
  };

  /* ── Handlers passed down ──────────────────────────────────────────────── */
  const handleOpenRegister = useCallback(async (event) => {
    if (!event?._id) return;

    const clashResult = await checkEventClash(event._id);

    if (clashResult.clash) {
      setClashDialog({
        open: true,
        event,
        conflictingEvents: clashResult.conflictingEvents,
      });
      return;
    }

    openRegistrationForm(event);
  }, [checkEventClash, openRegistrationForm]);

  const handleOpenDetails = useCallback(async (event) => {
    if (!event?._id) {
      setDetailsConflictingEvents([]);
      setDetailsEvent(event);
      return;
    }

    const clashResult = await checkEventClash(event._id);
    setDetailsConflictingEvents(clashResult.clash ? clashResult.conflictingEvents : []);
    setDetailsEvent(event);
  }, [checkEventClash]);

  const closeClashDialog = () => {
    setClashDialog({ open: false, event: null, conflictingEvents: [] });
  };

  const proceedWithClashRegistration = () => {
    if (clashDialog.event) {
      openRegistrationForm(clashDialog.event);
    }
    closeClashDialog();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("");
    setSelectedType("");
    setSelectedDate("");
  };

  const handleAddToCalendar = useCallback((event) => {
    if (!event?.title || !event?.date) {
      showToast("Event date is missing. Cannot add to calendar.", "warning");
      return;
    }

    openGoogleCalendar({
      title: event.title,
      description: event.description,
      location: event.venue,
      startTime: event.date,
      endTime: event.endDate,
    });

    showToast("Event added to Google Calendar 🚀", "success");
  }, [showToast]);

  const renderEventSection = (title, subtitle, list) => (
    <section className="animate-fadeUp" style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0, color: "#E2E8F0", fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.01em", fontSize: 20 }}>
            {title}
          </h2>
          <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: 13 }}>{subtitle}</p>
        </div>
        <div style={{ color: "#94A3B8", fontSize: 12 }}>{list.length} event{list.length !== 1 ? "s" : ""}</div>
      </div>

      <EventsGrid
        events={list}
        registeredIds={registeredIds}
        registrationMetaByEventId={registrationMetaByEventId}
        activeTab={activeTab}
        onDetails={handleOpenDetails}
        onRegister={handleOpenRegister}
        onAddToCalendar={handleAddToCalendar}
        wishlistIds={wishlistIds}
        wishlistLoadingMap={wishlistLoadingMap}
        onToggleWishlist={handleToggleWishlist}
      />
    </section>
  );

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

            <StatsRow
              totalEvents={totalEvents}
              registeredCount={registeredCount}
              upcomingCount={upcomingCount}
              departmentCount={departmentCount}
            />

            <div className="animate-fadeUp" style={{ marginTop: 8 }}>
              <h2
                style={{
                  margin: "0 0 8px",
                  color: "#E2E8F0",
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: "-0.01em",
                  fontSize: 20,
                }}
              >
                📊 Participation History
              </h2>
              <ParticipationHistory userId={userId} />
            </div>

            <RecommendedEvents
              userId={userId}
              registeredIds={registeredIds}
              wishlistIds={wishlistIds}
              wishlistLoadingMap={wishlistLoadingMap}
              onToggleWishlist={handleToggleWishlist}
              onDetails={handleOpenDetails}
              onRegister={handleOpenRegister}
              onAddToCalendar={handleAddToCalendar}
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
                eventTypeOptions={eventTypeOptions}
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
                onDetails={handleOpenDetails}
                onRegister={handleOpenRegister}
                onAddToCalendar={handleAddToCalendar}
                onToggleWishlist={handleToggleWishlist}
              />
            ) : activeTab === "completed" ? (
              renderEventSection("Completed Events", "Events that have ended or already have certificates generated for you.", filteredCompletedEvents)
            ) : activeTab === "upcoming" ? (
              renderEventSection("Active Events", "Browse events that are still open for participation.", filteredActiveEvents)
            ) : activeTab === "registered" ? (
              renderEventSection(
                "Your Registered Events",
                "Events you registered for, split across active and completed status.",
                filteredEvents.filter((event) => registeredIds.has(event._id))
              )
            ) : (
              <>
                {renderEventSection("Active Events", "Browse events that are still open for participation.", filteredActiveEvents)}
                <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "8px 0 20px" }} />
                {renderEventSection("Completed Events", "Ended events and events already completed via certificate.", filteredCompletedEvents)}
              </>
            )}
          </main>
        </div>

        {clashDialog.open && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeClashDialog(); }}>
            <div className="modal-box" style={{ maxWidth: 560 }}>
              <div style={{ padding: "22px 26px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ color: "#FCA5A5", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
                  ⚠️ You have another event at this time
                </div>
                <div style={{ color: "#94A3B8", fontSize: 13 }}>
                  You can still continue registration for {clashDialog.event?.title || "this event"}.
                </div>
              </div>

              <div style={{ padding: "16px 26px", display: "flex", flexDirection: "column", gap: 8 }}>
                {clashDialog.conflictingEvents.map((title, index) => (
                  <div
                    key={`${title}-${index}`}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(251,191,36,0.35)",
                      background: "rgba(251,191,36,0.08)",
                      color: "#FDE68A",
                      fontSize: 13,
                    }}
                  >
                    • {title}
                  </div>
                ))}
              </div>

              <div style={{ padding: "0 26px 22px", display: "flex", gap: 10 }}>
                <button className="btn-ghost" onClick={closeClashDialog} style={{ padding: "10px 18px" }}>
                  Cancel
                </button>
                <button className="btn-primary-glow" onClick={proceedWithClashRegistration} style={{ flex: 1, justifyContent: "center", padding: "10px 16px" }}>
                  Proceed Anyway
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details modal */}
        {detailsEvent && (
          <EventDetailsModal
            event={detailsEvent}
            alreadyJoined={registeredIds.has(detailsEvent._id)}
            userId={userId}
            onAddToCalendar={handleAddToCalendar}
            clashConflictingEvents={detailsConflictingEvents}
            onClose={() => {
              setDetailsEvent(null);
              setDetailsConflictingEvents([]);
            }}
            onRegister={() => {
              handleOpenRegister(detailsEvent);
              setDetailsEvent(null);
              setDetailsConflictingEvents([]);
            }}
          />
        )}

        {/* Registration modal */}
        {selectedEvent && (
          <RegistrationModal
            event={selectedEvent}
            formValues={formValues}
            onFormChange={setFormValues}
            isSubmitting={isConfirmingRegistration}
            onConfirmRegistration={handleConfirmRegistration}
            onClose={() => setSelectedEvent(null)}
          />
        )}

        <ChatbotWidget userId={userId} />
      </div>
    </>
  );
}

export default StudentDashboard;