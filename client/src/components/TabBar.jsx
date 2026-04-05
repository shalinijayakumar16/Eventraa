import Icon from "./icon";
import { TABS } from "../constants/config";

function TabBar({ activeTab, onTabChange, tabCounts }) {
  return (
    <div className="animate-fadeUp" style={{ marginBottom: 22, animationDelay: "0.12s" }}>
      <div className="tab-bar" style={{ overflowX: "auto" }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon name={tab.icon} size={13} color="currentColor" />
            {tab.label}
            <span style={{
              padding: "1px 7px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              background: activeTab === tab.id ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
              color: activeTab === tab.id ? "#fff" : "#64748B",
            }}>
              {tabCounts[tab.id]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TabBar;
