import { useEffect, useState } from "react";
import Icon from "./icon";

const API_BASE = "http://localhost:5000";

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch analytics data when component loads
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/admin/analytics`);
        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const payload = await response.json();
        setAnalytics(payload);
      } catch (error) {
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <section className="animate-fadeUp" style={{ animationDelay: "0.12s", background: "rgba(255,255,255,0.035)", backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, boxShadow: "0 18px 48px rgba(0,0,0,0.25)", padding: 22 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 18 }}>
        <div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: "#E2E8F0", marginBottom: 4 }}>Platform Analytics</h2>
          <p style={{ color: "#64748B", fontSize: 13 }}>Track key metrics across users, events, and participation.</p>
        </div>
      </div>

      {loading && (
        <div style={{ color: "#64748B", fontSize: 14 }}>Loading analytics...</div>
      )}

      {!loading && analytics && (
        // Show key metrics in card layout
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          {/* Display platform statistics */}
          <div className="event-card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ color: "#94A3B8", fontSize: 12, fontFamily: "'Outfit', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Users</div>
              <Icon name="users" size={16} color="#A5B4FC" />
            </div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 30, color: "#E2E8F0" }}>{analytics.totalUsers ?? 0}</div>
          </div>

          <div className="event-card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ color: "#94A3B8", fontSize: 12, fontFamily: "'Outfit', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Events</div>
              <Icon name="calendar" size={16} color="#A5B4FC" />
            </div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 30, color: "#E2E8F0" }}>{analytics.totalEvents ?? 0}</div>
          </div>

          <div className="event-card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ color: "#94A3B8", fontSize: 12, fontFamily: "'Outfit', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>Active Participation</div>
              <Icon name="trending" size={16} color="#A5B4FC" />
            </div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 30, color: "#E2E8F0" }}>{analytics.totalRegistrations ?? 0}</div>
          </div>
        </div>
      )}

      {!loading && !analytics && (
        <div style={{ color: "#64748B", fontSize: 14 }}>Unable to load analytics right now.</div>
      )}
    </section>
  );
}

export default AdminAnalytics;