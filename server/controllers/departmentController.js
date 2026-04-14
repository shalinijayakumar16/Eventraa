const Department = require("../models/Department");
const Registration = require("../models/Registration");
const jwt = require("jsonwebtoken");

// Get all departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};

// Update coordinator
exports.updateCoordinator = async (req, res) => {
  try {
    const { name, coordinator = "" } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    // Store coordinator in MongoDB
    const updated = await Department.findOneAndUpdate(
      { name: String(name).trim().toUpperCase() },
      { coordinator: String(coordinator).trim() },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update coordinator" });
  }
};

// Remove department
exports.deleteDepartment = async (req, res) => {
  try {
    const { name } = req.params;

    await Department.findOneAndDelete({
      name: String(name).trim().toUpperCase(),
    });

    res.json({ message: "Department removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove department" });
  }
};

// Department login
exports.loginDepartment = async (req, res) => {
  try {
    const { deptId, password } = req.body;

    console.log("[Department Login] Request received", {
      deptId,
      hasPassword: Boolean(password),
    });

    if (!deptId || !password) {
      return res.status(400).json({ message: "Department ID and password are required" });
    }

    const normalizedDeptId = String(deptId).trim().toUpperCase();

    const departments = [
      { deptId: "CSE", password: "cse123" },
      { deptId: "IT", password: "it123" },
      { deptId: "ECE", password: "ece123" },
      { deptId: "MECH", password: "mech123" },
      { deptId: "CIVIL", password: "civil123" },
      { deptId: "EEE", password: "eee123" },
      { deptId: "BIO", password: "bio123" },
      { deptId: "MBA", password: "mba123" },
      { deptId: "MCA", password: "mca123" },
      { deptId: "OTHER", password: "other123" },
    ];

    const department = departments.find(
      (entry) => entry.deptId === normalizedDeptId && entry.password === password
    );

    if (!department) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: department.deptId,
        role: "department",
        department: department.deptId,
      },
      process.env.JWT_SECRET || "eventra-dev-secret",
      { expiresIn: "12h" }
    );

    return res.status(200).json({
      message: "Department login successful",
      department: department.deptId,
      token,
    });
  } catch (error) {
    console.error("[Department Login] Unexpected error", error);
    return res.status(500).json({ message: "Server error during department login" });
  }
};

exports.getDepartmentRegistrations = async (req, res) => {
  try {
    const department = req.user?.department;
    const eventId = req.query?.eventId;

    if (!department) {
      return res.status(400).json({ message: "Department claim missing in token" });
    }

    const query = { department };
    if (eventId) {
      query.eventId = eventId;
    }

    const registrations = await Registration.find(query)
      .populate("userId", "name email registerNo department year")
      .populate("eventId", "title date department")
      .sort({ createdAt: -1 })
      .lean();

    const normalized = registrations.map((registration) => ({
      ...registration,
      name: registration?.name || registration?.userId?.name || "",
      registerNo: registration?.registerNo || registration?.userId?.registerNo || "",
      department: registration?.studentDepartment || registration?.userId?.department || "",
      year: registration?.year || registration?.userId?.year || "",
    }));

    return res.json(normalized);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching registrations" });
  }
};