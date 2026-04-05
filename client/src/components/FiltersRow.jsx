import Icon from "./icon";
import { ALL_DEPARTMENTS, ALL_TYPES } from "../constants/config";

function FiltersRow({ search, department, type, dateFilter, filteredCount, onSearchChange, onDepartmentChange, onTypeChange, onDateChange, onClear }) {
  const hasFilters = search || department || type || dateFilter;

  return (
    <div className="animate-fadeUp" style={{ marginBottom: 24, animationDelay: "0.16s" }}>
      {/* Search bar */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <Icon name="search" size={16} color="#475569" />
        </div>
        <input
          className="search-input"
          placeholder="Search events by name…"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", opacity: 0.6 }}
          >
            <Icon name="x" size={14} color="#94A3B8" />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="filters-row" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748B", fontSize: 13 }}>
          <Icon name="filter" size={14} color="#64748B" />
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Filter</span>
        </div>

        {/* Department */}
        <select className="filter-select" value={department} onChange={e => onDepartmentChange(e.target.value)}>
          <option value="">All Departments</option>
          {ALL_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        {/* Type */}
        <select className="filter-select" value={type} onChange={e => onTypeChange(e.target.value)}>
          <option value="">All Types</option>
          {ALL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        {/* Date from */}
        <input
          type="date"
          value={dateFilter}
          onChange={e => onDateChange(e.target.value)}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: dateFilter ? "#CBD5E1" : "#475569",
            padding: "9px 14px",
            borderRadius: 10,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            outline: "none",
            cursor: "pointer",
            colorScheme: "dark",
          }}
        />

        {/* Clear filters */}
        {hasFilters && (
          <button className="btn-ghost" onClick={onClear} style={{ fontSize: 12, padding: "8px 14px" }}>
            <Icon name="x" size={12} color="#94A3B8" />
            Clear
          </button>
        )}

        <div style={{ marginLeft: "auto", fontSize: 13, color: "#475569" }}>
          {filteredCount} event{filteredCount !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}

export default FiltersRow;
