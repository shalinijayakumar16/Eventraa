import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlobBg from "../components/BlobBg";
import Icon from "../components/icon";
import { STYLES } from "../constants/styles";
import AdminAnalytics from "../components/AdminAnalytics";
import EventApproval from "../components/EventApproval";
import EventraLogo from "../components/EventraLogo";
import { apiUrl } from "../constants/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newCoordinatorMap, setNewCoordinatorMap] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeSection, setActiveSection] = useState("departments");

  // Manage department list
  const [departments, setDepartments] = useState([]);

  // Fetch department data from backend
  const fetchDepartments = async () => {
    setDepartmentsLoading(true);
    try {
      const response = await fetch(apiUrl("/api/departments"));

      if (!response.ok) {
        throw new Error("Failed to fetch departments");
      }

      const payload = await response.json();
      setDepartments(Array.isArray(payload) ? payload : []);
    } catch (error) {
      setDepartments([]);
      showFeedback("Unable to load departments");
    } finally {
      setDepartmentsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchUsers();
  }, []);

  const showFeedback = (message) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(""), 2500);
  };

  // Load all users for admin panel
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await fetch(apiUrl("/api/users/all"));

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const payload = await response.json();
      setUsers(Array.isArray(payload) ? payload : []);
    } catch (error) {
      setUsers([]);
      showFeedback("Unable to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  // Add department
  const handleAddDepartment = async () => {
    const name = newDepartmentName.trim().toUpperCase();
    if (!name) return;

    const exists = departments.some((department) => department.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      showFeedback("Department already exists");
      return;
    }

    try {
      // Store coordinator in MongoDB
      const response = await fetch(apiUrl("/api/departments/coordinator"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, coordinator: "" }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to add department");
      }

      // Update UI state dynamically
      setNewDepartmentName("");
      showFeedback("Department added successfully");
      fetchDepartments();
    } catch (error) {
      showFeedback(error.message || "Unable to add department");
    }
  };

  // Remove department
  const handleRemoveDepartment = async (departmentName) => {
    try {
      const response = await fetch(apiUrl(`/api/departments/${encodeURIComponent(departmentName)}`), {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to remove department");
      }

      // Update UI state dynamically
      showFeedback("Department removed");
      fetchDepartments();
    } catch (error) {
      showFeedback(error.message || "Unable to remove department");
    }
  };

  // Update coordinator
  const handleAssignCoordinator = async (departmentName) => {
    const coordinatorValue = (newCoordinatorMap[departmentName] || "").trim();

    if (!coordinatorValue) {
      showFeedback("Please enter coordinator name");
      return;
    }

    try {
      // Save coordinator in MongoDB
      const response = await fetch(apiUrl("/api/departments/coordinator"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: departmentName, coordinator: coordinatorValue }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to update coordinator");
      }

      await response.json();

      // Update UI state dynamically
      setNewCoordinatorMap((previous) => ({
        ...previous,
        [departmentName]: "",
      }));

      // Fetch latest department list so UI always reflects DB state
      await fetchDepartments();

      showFeedback("Coordinator assigned successfully");
    } catch (error) {
      showFeedback(error.message || "Unable to assign coordinator");
    }
  };

  const handleCoordinatorInputChange = (departmentName, value) => {
    setNewCoordinatorMap((previous) => ({ ...previous, [departmentName]: value }));
  };

  // Toggle user access status
  const handleToggleUserStatus = async (userId) => {
    try {
      const response = await fetch(apiUrl(`/api/users/toggle-status/${userId}`), {
        method: "PUT",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to update user status");
      }

      // Update UI after action
      await fetchUsers();
      showFeedback("User status updated successfully");
    } catch (error) {
      showFeedback(error.message || "Unable to update user status");
    }
  };

  // Delete user permanently
  const handleDeleteUser = async (userId) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this user?");
    if (!shouldDelete) return;

    try {
      const response = await fetch(apiUrl(`/api/users/delete/${userId}`), {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to delete user");
      }

      // Update UI after action
      await fetchUsers();
      showFeedback("User deleted successfully");
    } catch (error) {
      showFeedback(error.message || "Unable to delete user");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin-login");
  };

  const filteredUsers = users.filter((user) => {
    const searchValue = userSearch.trim().toLowerCase();
    const matchesSearch =
      !searchValue ||
      String(user.name || "").toLowerCase().includes(searchValue) ||
      String(user.email || "").toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive !== false) ||
      (statusFilter === "blocked" && user.isActive === false);

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ minHeight: "100vh", background: "#07091A", color: "#E2E8F0", position: "relative", overflow: "hidden" }}>
        <BlobBg />

        {/* Match admin UI with existing dashboards */}
        <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(7,9,26,0.85)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 32px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <EventraLogo subtitle="Admin" />

          <button className="btn-logout" onClick={handleLogout}>
            <Icon name="logout" size={15} color="#FCA5A5" />
            <span>Logout</span>
          </button>
        </header>

        <main style={{ position: "relative", zIndex: 1, padding: "32px 32px 56px", maxWidth: 1240, margin: "0 auto" }}>
          {feedbackMessage && (
            <div style={{ marginBottom: 16, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 12, padding: "10px 14px", color: "#6EE7B7", fontSize: 13, fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>
              {feedbackMessage}
            </div>
          )}

          <div className="animate-fadeUp" style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 6 }}>
              <span className="gradient-text">Admin</span>{" "}
              <span style={{ color: "#E2E8F0" }}>Dashboard</span>
            </h1>
            <p style={{ color: "#64748B", fontSize: 15 }}>Manage departments and coordinators from one place</p>
          </div>

          {/* Switch between admin sections without scrolling */}
          <div className="view-tabs animate-fadeUp" style={{ animationDelay: "0.08s", marginBottom: 18 }}>
            <button
              className={`view-tab ${activeSection === "departments" ? "active" : "inactive"}`}
              onClick={() => setActiveSection("departments")}
            >
              <Icon name="filter" size={14} color={activeSection === "departments" ? "#fff" : "#64748B"} />
              Manage Departments
            </button>
            <button
              className={`view-tab ${activeSection === "users" ? "active" : "inactive"}`}
              onClick={() => setActiveSection("users")}
            >
              <Icon name="users" size={14} color={activeSection === "users" ? "#fff" : "#64748B"} />
              Manage Users
            </button>
            <button
              className={`view-tab ${activeSection === "analytics" ? "active" : "inactive"}`}
              onClick={() => setActiveSection("analytics")}
            >
              <Icon name="trending" size={14} color={activeSection === "analytics" ? "#fff" : "#64748B"} />
              Analytics
            </button>
            <button
              className={`view-tab ${activeSection === "approvals" ? "active" : "inactive"}`}
              onClick={() => setActiveSection("approvals")}
            >
              <Icon name="check" size={14} color={activeSection === "approvals" ? "#fff" : "#64748B"} />
              Event Approvals
            </button>
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            {activeSection === "departments" && (
            <>
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
                  <Icon name="zap" size={14} color="white" />
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
                {departmentsLoading && (
                  <div style={{ color: "#64748B", fontSize: 14 }}>Loading departments...</div>
                )}

                {!departmentsLoading && departments.length === 0 && (
                  <div style={{ color: "#64748B", fontSize: 14 }}>No departments available</div>
                )}

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
                        <Icon name="x" size={13} color="#FCA5A5" />
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
            </>
            )}

            {activeSection === "users" && (
            <section className="animate-fadeUp" style={{ animationDelay: "0.24s", background: "rgba(255,255,255,0.035)", backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, boxShadow: "0 18px 48px rgba(0,0,0,0.25)", padding: 22 }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: "#E2E8F0", marginBottom: 4 }}>Manage Users</h2>
                  <p style={{ color: "#64748B", fontSize: 13 }}>View students, block or unblock access, and delete users when needed.</p>
                </div>
                <div style={{ color: "#475569", fontSize: 13 }}>
                  {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
                <input
                  type="text"
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                  placeholder="Search by name or email"
                  className="form-input"
                  style={{ flex: "1 1 300px", minWidth: 220 }}
                />
                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="all">All Users</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              <div style={{ overflowX: "auto", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                      {[
                        "Name",
                        "Register No",
                        "Email",
                        "Department",
                        "Year",
                        "Status",
                        "Actions",
                      ].map((heading) => (
                        <th
                          key={heading}
                          style={{
                            textAlign: "left",
                            padding: "12px 14px",
                            color: "#94A3B8",
                            fontSize: 12,
                            fontFamily: "'Outfit', sans-serif",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            borderBottom: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {usersLoading && (
                      <tr>
                        <td colSpan={7} style={{ padding: "16px 14px", color: "#64748B" }}>
                          Loading users...
                        </td>
                      </tr>
                    )}

                    {!usersLoading && filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ padding: "16px 14px", color: "#64748B" }}>
                          No users found for the selected filters.
                        </td>
                      </tr>
                    )}

                    {!usersLoading && filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td style={{ padding: "12px 14px", color: "#E2E8F0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{user.name}</td>
                        <td style={{ padding: "12px 14px", color: "#CBD5E1", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{user.registerNo}</td>
                        <td style={{ padding: "12px 14px", color: "#CBD5E1", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{user.email}</td>
                        <td style={{ padding: "12px 14px", color: "#CBD5E1", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{user.department || "-"}</td>
                        <td style={{ padding: "12px 14px", color: "#CBD5E1", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{user.year || "-"}</td>
                        <td style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "4px 10px",
                              borderRadius: 999,
                              fontSize: 11,
                              fontFamily: "'Outfit', sans-serif",
                              fontWeight: 700,
                              color: user.isActive === false ? "#FCA5A5" : "#6EE7B7",
                              background: user.isActive === false ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)",
                              border: user.isActive === false ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(16,185,129,0.25)",
                            }}
                          >
                            {user.isActive === false ? "Blocked" : "Active"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <button
                              className="btn-ghost"
                              style={{ padding: "8px 12px", fontSize: 12 }}
                              onClick={() => handleToggleUserStatus(user._id)}
                            >
                              <Icon name={user.isActive === false ? "check" : "x"} size={12} color="#A5B4FC" />
                              {user.isActive === false ? "Unblock" : "Block"}
                            </button>

                            <button
                              className="btn-logout"
                              style={{ padding: "8px 12px", fontSize: 12 }}
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              <Icon name="x" size={12} color="#FCA5A5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            )}

            {activeSection === "analytics" && <AdminAnalytics />}

            {activeSection === "approvals" && <EventApproval />}
          </div>
        </main>
      </div>
    </>
  );
}

export default AdminDashboard;