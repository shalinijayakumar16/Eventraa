import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function DepartmentActivityChart({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div style={{ color: "#64748B", fontSize: 14, padding: "6px 0" }}>No department activity found for this range.</div>;
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
          <XAxis dataKey="department" stroke="#94A3B8" tick={{ fill: "#94A3B8", fontSize: 12 }} />
          <YAxis stroke="#94A3B8" tick={{ fill: "#94A3B8", fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "#0F172A", border: "1px solid rgba(148,163,184,0.24)", borderRadius: 10, color: "#E2E8F0" }}
            labelStyle={{ color: "#E2E8F0", fontWeight: 600 }}
          />
          <Legend wrapperStyle={{ color: "#CBD5E1" }} />
          <Bar dataKey="events" fill="#6366F1" radius={[6, 6, 0, 0]} />
          <Bar dataKey="registrations" fill="#22C55E" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DepartmentActivityChart;
