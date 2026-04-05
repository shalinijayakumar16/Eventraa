import { useEffect, useState } from "react";

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
import EventDetailsModal from "../components/EventDetailsModal";
import RegistrationModal from "../components/RegistrationModal";

function StudentDashboard() {
  const [events, setEvents]           = useState([]);
  const [myEvents, setMyEvents]       = useState([]);
  const [user, setUser]               = useState(null);
  const [showProfile, setShowProfile] = useState(false);

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

  useEffect(() => { fetchEvents(); }, [department, type]);
  useEffect(() => { fetchMyEvents(); fetchUser(); }, []);

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
      const res  = await fetch(`http://localhost:5000/api/user/${userId}`);
      const data = await res.json();
      setUser(data);
    } catch (err) { console.log(err); }
  };

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

  const registeredIds = new Set(myEvents.map(e => e.eventId?._id || e.eventId));

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
          onToggleProfile={() => setShowProfile(p => !p)}
          onLogout={handleLogout}
        />

        {showProfile && (
          <ProfileDropdown user={user} />
        )}

        {/* Page layout */}
        <div
          style={{ display: "flex", position: "relative", zIndex: 1 }}
          onClick={() => showProfile && setShowProfile(false)}
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

            <EventsGrid
              events={filteredEvents}
              registeredIds={registeredIds}
              activeTab={activeTab}
              onDetails={setDetailsEvent}
              onRegister={handleOpenRegister}
            />
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