import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const chartPalette = ["#6366F1", "#8B5CF6", "#06B6D4", "#22C55E", "#F59E0B"];

function TopEventsChart({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div style={{ color: "#64748B", fontSize: 14 }}>No event registration data available.</div>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 14 }}>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 6, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
            <XAxis type="number" stroke="#94A3B8" tick={{ fill: "#94A3B8", fontSize: 12 }} allowDecimals={false} />
            <YAxis
              type="category"
              width={180}
              dataKey="eventTitle"
              stroke="#94A3B8"
              tick={{ fill: "#94A3B8", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ background: "#0F172A", border: "1px solid rgba(148,163,184,0.24)", borderRadius: 10, color: "#E2E8F0" }}
              labelStyle={{ color: "#E2E8F0", fontWeight: 600 }}
            />
            <Bar dataKey="registrations" fill="#8B5CF6" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="registrations"
              nameKey="eventTitle"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {data.map((entry, index) => (
                <Cell key={entry.eventTitle} fill={chartPalette[index % chartPalette.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#0F172A", border: "1px solid rgba(148,163,184,0.24)", borderRadius: 10, color: "#E2E8F0" }}
              labelStyle={{ color: "#E2E8F0", fontWeight: 600 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TopEventsChart;
