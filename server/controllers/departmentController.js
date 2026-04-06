const Department = require("../models/Department");

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