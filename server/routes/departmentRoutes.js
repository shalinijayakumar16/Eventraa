const express = require("express");
const router = express.Router();

const {
  loginDepartment,
  getDepartments,
  updateCoordinator,
  deleteDepartment,
} = require("../controllers/departmentController");

router.post("/login", loginDepartment);
router.get("/", getDepartments);
router.put("/coordinator", updateCoordinator);
router.delete("/:name", deleteDepartment);

module.exports = router;