import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlobBg from "../components/BlobBg";
import Icon from "../components/icon";
import { STYLES } from "../constants/styles";

function AdminDashboard() {
  const navigate = useNavigate();
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newCoordinatorMap, setNewCoordinatorMap] = useState({});

  // Manage department list
  const [departments, setDepartments] = useState([
    { name: "CSE", coordinator: "" },
    { name: "IT", coordinator: "" },
  ]);

  // Add department
  const handleAddDepartment = () => {
    const name = newDepartmentName.trim().toUpperCase();
    if (!name) return;

    const exists = departments.some((department) => department.name.toLowerCase() === name.toLowerCase());
    if (exists) return;

    // Update UI state dynamically
    setDepartments((previous) => [...previous, { name, coordinator: "" }]);
    setNewDepartmentName("");
  };

  // Remove department
  const handleRemoveDepartment = (departmentName) => {
    // Update UI state dynamically
    setDepartments((previous) => previous.filter((department) => department.name !== departmentName));
  };

  // Update coordinator
  const handleAssignCoordinator = (departmentName) => {
    const coordinatorValue = (newCoordinatorMap[departmentName] || "").trim();

    // Update UI state dynamically
    setDepartments((previous) =>
      previous.map((department) =>
        department.name === departmentName
          ? { ...department, coordinator: coordinatorValue }
          : department
      )
    );
  };

  const handleCoordinatorInputChange = (departmentName, value) => {
    setNewCoordinatorMap((previous) => ({ ...previous, [departmentName]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin-login");
  };

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ minHeight: "100vh", background: "#07091A", color: "#E2E8F0", position: "relative", overflow: "hidden" }}>
        <BlobBg />

        {/* Match admin UI with existing dashboards */}
        <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(7,9,26,0.85)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 32px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: "'Outfit', sans-serif", boxShadow: "0 4px 16px rgba(99,102,241,0.45)" }}>E</div>
            <div>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 19, background: "linear-gradient(135deg, #E2E8F0, #A5B4FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em" }}>Eventra</span>
              <span style={{ color: "#475569", fontSize: 13, marginLeft: 8, fontFamily: "'DM Sans', sans-serif" }}>/ Admin</span>
            </div>
          </div>

          <button className="btn-logout" onClick={handleLogout}>
            <Icon name="logout" size={15} color="#FCA5A5" />
            <span>Logout</span>
          </button>
        </header>

        <main style={{ position: "relative", zIndex: 1, padding: "32px 32px 56px", maxWidth: 1240, margin: "0 auto" }}>
          <div className="animate-fadeUp" style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 6 }}>
              <span className="gradient-text">Admin</span>{" "}
              <span style={{ color: "#E2E8F0" }}>Dashboard</span>
            </h1>
            <p style={{ color: "#64748B", fontSize: 15 }}>Manage departments and coordinators from one place</p>
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            <section className="animate-fadeUp" style={{ animationDelay: "0.12s", background: "rgba(255,255,255,0.035)", backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, boxShadow: "0 18px 48px rgba(0,0,0,0.25)", padding: 22 }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: "#E2E8F0", marginBottom: 4 }}>Add Department</h2>
                  <p style={{ color: "#64748B", fontSize: 13 }}>Create a department entry using the same UI language as the rest of the app.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <input
                  type="text"
                  value={newDepartmentName}
                  onChange={(event) => setNewDepartmentName(event.target.value)}
                  placeholder="Department name (e.g., ECE)"
                  className="form-input"
                  style={{ flex: "1 1 280px", minWidth: 220 }}
                />
                <button onClick={handleAddDepartment} className="btn-primary-glow" style={{ justifyContent: "center" }}>
                  <Icon name="plus" size={14} color="white" />
                  Add Department
                </button>
              </div>
            </section>

            <section className="animate-fadeUp" style={{ animationDelay: "0.18s", background: "rgba(255,255,255,0.035)", backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, boxShadow: "0 18px 48px rgba(0,0,0,0.25)", padding: 22 }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 18 }}>
                <div>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: "#E2E8F0", marginBottom: 4 }}>Manage Departments</h2>
                  <p style={{ color: "#64748B", fontSize: 13 }}>Keep the department list updated and assign coordinators dynamically.</p>
                </div>
                <div style={{ color: "#475569", fontSize: 13 }}>
                  {departments.length} department{departments.length !== 1 ? "s" : ""}
                </div>
              </div>

              <div style={{ display: "grid", gap: 14 }}>
                {departments.map((department) => (
                  <div key={department.name} className="event-card" style={{ padding: 18, display: "grid", gap: 14 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                      <div>
                        <div className="dept-badge" style={{ marginBottom: 8 }}>{department.name}</div>
                        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: "#E2E8F0", marginBottom: 4 }}>{department.name}</h3>
                        <p style={{ color: "#64748B", fontSize: 13 }}>
                          Coordinator: <span style={{ color: "#CBD5E1", fontWeight: 600 }}>{department.coordinator || "Not assigned"}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemoveDepartment(department.name)}
                        className="btn-logout"
                        style={{ padding: "8px 14px", fontSize: 12 }}
                      >
                        <Icon name="trash" size={13} color="#FCA5A5" />
                        Delete
                      </button>
                    </div>

                    {/* Reuse shared components for consistency */}
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                      <input
                        type="text"
                        value={newCoordinatorMap[department.name] || ""}
                        onChange={(event) => handleCoordinatorInputChange(department.name, event.target.value)}
                        placeholder="Coordinator name"
                        className="form-input"
                        style={{ flex: "1 1 260px", minWidth: 220 }}
                      />
                      <button
                        onClick={() => handleAssignCoordinator(department.name)}
                        className="btn-ghost"
                        style={{ padding: "10px 16px" }}
                      >
                        <Icon name="check" size={13} color="#A5B4FC" />
                        Assign Coordinator
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default AdminDashboard;