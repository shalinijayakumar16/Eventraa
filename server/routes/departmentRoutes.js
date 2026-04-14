const express = require("express");
const router = express.Router();
const { requireAuth, requireDepartmentAuth } = require("../middleware/auth");

const {
  loginDepartment,
  getDepartments,
  updateCoordinator,
  deleteDepartment,
  getDepartmentRegistrations,
} = require("../controllers/departmentController");

router.post("/login", loginDepartment);
router.get("/registrations", requireAuth, requireDepartmentAuth, getDepartmentRegistrations);
router.get("/", getDepartments);
router.put("/coordinator", updateCoordinator);
router.delete("/:name", deleteDepartment);

module.exports = router;