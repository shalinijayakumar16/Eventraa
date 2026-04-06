import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px 16px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0, color: "#0f172a" }}>Admin Dashboard</h1>
            <p style={{ margin: "4px 0 0", color: "#64748b" }}>Manage departments and coordinators</p>
          </div>
          <button
            onClick={handleLogout}
            style={{ border: "1px solid #ef4444", background: "white", color: "#ef4444", borderRadius: 10, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}
          >
            Logout
          </button>
        </div>

        <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: 16, marginBottom: 18 }}>
          <h2 style={{ fontSize: 20, color: "#0f172a", margin: "0 0 12px" }}>Add Department</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              type="text"
              value={newDepartmentName}
              onChange={(event) => setNewDepartmentName(event.target.value)}
              placeholder="Department name (e.g., ECE)"
              style={{ flex: "1 1 280px", minWidth: 220, padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1" }}
            />
            <button
              onClick={handleAddDepartment}
              style={{ border: "none", background: "#2563eb", color: "white", borderRadius: 10, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}
            >
              Add
            </button>
          </div>
        </section>

        <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: 16 }}>
          <h2 style={{ fontSize: 20, color: "#0f172a", margin: "0 0 12px" }}>Manage Departments</h2>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #e2e8f0", color: "#334155" }}>Department</th>
                  <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #e2e8f0", color: "#334155" }}>Coordinator</th>
                  <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #e2e8f0", color: "#334155" }}>Assign Coordinator</th>
                  <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #e2e8f0", color: "#334155" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((department) => (
                  <tr key={department.name}>
                    <td style={{ padding: "12px", borderBottom: "1px solid #f1f5f9", color: "#0f172a", fontWeight: 700 }}>{department.name}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #f1f5f9", color: "#334155" }}>
                      {department.coordinator || "Not assigned"}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #f1f5f9" }}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <input
                          type="text"
                          value={newCoordinatorMap[department.name] || ""}
                          onChange={(event) => handleCoordinatorInputChange(department.name, event.target.value)}
                          placeholder="Coordinator name"
                          style={{ flex: "1 1 210px", minWidth: 150, padding: "8px 10px", borderRadius: 8, border: "1px solid #cbd5e1" }}
                        />
                        <button
                          onClick={() => handleAssignCoordinator(department.name)}
                          style={{ border: "none", background: "#0ea5e9", color: "white", borderRadius: 8, padding: "8px 12px", fontWeight: 700, cursor: "pointer" }}
                        >
                          Assign
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #f1f5f9" }}>
                      <button
                        onClick={() => handleRemoveDepartment(department.name)}
                        style={{ border: "1px solid #ef4444", background: "white", color: "#ef4444", borderRadius: 8, padding: "8px 12px", fontWeight: 700, cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;