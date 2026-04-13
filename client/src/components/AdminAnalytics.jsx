import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Icon from "./icon";
import DepartmentActivityChart from "./admin/DepartmentActivityChart";
import TopEventsChart from "./admin/TopEventsChart";

const API_BASE = "http://localhost:5000";

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState("30d");

  const maxActivityScore = useMemo(() => {
    if (!analytics?.departmentActivity?.length) return 1;

    return Math.max(
      ...analytics.departmentActivity.map((item) =>
        Number(item.events || 0) + Number(item.registrations || 0)
      )
    );
  }, [analytics]);

  // Fetch analytics data when component loads
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE}/api/admin/analytics`, {
          params: { range },
        });

        setAnalytics(response.data || null);
      } catch (error) {
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [range]);

  const departmentActivity = analytics?.departmentActivity || [];
  const topEvents = analytics?.topEvents || [];

  return (
    <section className="animate-fadeUp" style={{ animationDelay: "0.12s", background: "rgba(255,255,255,0.035)", backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, boxShadow: "0 18px 48px rgba(0,0,0,0.25)", padding: 22 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 18 }}>
        <div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: "#E2E8F0", marginBottom: 4 }}>Campus Activity Heatmap</h2>
          <p style={{ color: "#64748B", fontSize: 13 }}>Track department activity and top events by student participation.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[{ label: "Last 7 Days", value: "7d" }, { label: "Last 30 Days", value: "30d" }, { label: "All Time", value: "all" }].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setRange(item.value)}
              className={range === item.value ? "btn-primary-glow" : "btn-ghost"}
              style={{ padding: "8px 14px", fontSize: 12 }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ color: "#64748B", fontSize: 14 }}>Loading analytics...</div>
      )}

      {!loading && analytics && (
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>
            <div className="event-card" style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ color: "#94A3B8", fontSize: 12, fontFamily: "'Outfit', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Events</div>
                <Icon name="calendar" size={16} color="#A5B4FC" />
              </div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 30, color: "#E2E8F0" }}>{analytics.totalEvents ?? 0}</div>
            </div>

            <div className="event-card" style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ color: "#94A3B8", fontSize: 12, fontFamily: "'Outfit', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Registrations</div>
                <Icon name="trending" size={16} color="#A5B4FC" />
              </div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 30, color: "#E2E8F0" }}>{analytics.totalRegistrations ?? 0}</div>
            </div>

            <div className="event-card" style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ color: "#94A3B8", fontSize: 12, fontFamily: "'Outfit', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>Most Active Department 🔥</div>
                <Icon name="zap" size={16} color="#F59E0B" />
              </div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 22, color: "#FDE68A" }}>
                {analytics.mostActiveDepartment?.department || "N/A"}
              </div>
              <div style={{ color: "#94A3B8", fontSize: 12, marginTop: 4 }}>
                {analytics.mostActiveDepartment
                  ? `${analytics.mostActiveDepartment.events} events • ${analytics.mostActiveDepartment.registrations} registrations`
                  : "No activity data yet"}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 14 }}>
            <div className="event-card" style={{ padding: 18 }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: "#E2E8F0", marginBottom: 12 }}>
                Department Activity
              </h3>

              <DepartmentActivityChart data={departmentActivity} />
            </div>

            <div className="event-card" style={{ padding: 18 }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: "#E2E8F0", marginBottom: 12 }}>
                Activity Heatmap
              </h3>
              <div style={{ display: "grid", gap: 8 }}>
                {departmentActivity.length === 0 && (
                  <div style={{ color: "#64748B", fontSize: 14 }}>No heatmap data available.</div>
                )}
                {departmentActivity.map((item) => {
                  const score = Number(item.events || 0) + Number(item.registrations || 0);
                  const intensity = Math.max(0.15, Math.min(score / maxActivityScore, 1));

                  return (
                    <div
                      key={item.department}
                      style={{
                        borderRadius: 10,
                        padding: "10px 12px",
                        border: "1px solid rgba(99,102,241,0.28)",
                        background: `rgba(99,102,241,${intensity.toFixed(2)})`,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                        <span style={{ color: "#E2E8F0", fontSize: 13, fontWeight: 600 }}>{item.department}</span>
                        <span style={{ color: "#E2E8F0", fontSize: 12 }}>{score}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="event-card" style={{ padding: 18 }}>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: "#E2E8F0", marginBottom: 12 }}>
              Top Events by Participation
            </h3>

            <TopEventsChart data={topEvents} />
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