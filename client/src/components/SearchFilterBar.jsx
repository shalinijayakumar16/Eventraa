import Icon from "./icon";

function SearchFilterBar({
  searchTerm,
  setSearchTerm,
  selectedDepartment,
  setSelectedDepartment,
  selectedType,
  setSelectedType,
  selectedDate,
  setSelectedDate,
  departmentOptions,
  filteredCount,
  onClearFilters,
}) {
  const hasActiveFilters = searchTerm || selectedDepartment || selectedType || selectedDate;

  return (
    <div className="animate-fadeUp" style={{ marginBottom: 24, animationDelay: "0.16s" }}>
      <div className="filters-row" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 260px", minWidth: 220 }}>
          <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <Icon name="search" size={16} color="#475569" />
          </div>
          <input
            className="search-input"
            placeholder="Search events by name..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={selectedDepartment}
          onChange={(event) => setSelectedDepartment(event.target.value)}
        >
          <option value="">All Departments</option>
          {departmentOptions.map((department) => (
            <option key={department} value={department}>{department}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={selectedType}
          onChange={(event) => setSelectedType(event.target.value)}
        >
          <option value="">All Event Types</option>
          <option value="Tech">Tech</option>
          <option value="Cultural">Cultural</option>
          <option value="Workshop">Workshop</option>
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: selectedDate ? "#CBD5E1" : "#475569",
            padding: "9px 14px",
            borderRadius: 10,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            outline: "none",
            cursor: "pointer",
            colorScheme: "dark",
          }}
        />

        {hasActiveFilters && (
          <button className="btn-ghost" onClick={onClearFilters} style={{ fontSize: 12, padding: "8px 14px" }}>
            <Icon name="x" size={12} color="#94A3B8" />
            Clear Filters
          </button>
        )}

        <div style={{ marginLeft: "auto", fontSize: 13, color: "#475569" }}>
          {filteredCount} event{filteredCount !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}

export default SearchFilterBar;