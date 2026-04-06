const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["department", "admin"],
    default: "department"
  }
}, { timestamps: true });

module.exports = mongoose.models.DepartmentAuth || mongoose.model("DepartmentAuth", departmentSchema);