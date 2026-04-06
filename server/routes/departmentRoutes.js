const express = require("express");
const router = express.Router();

const {
  getDepartments,
  updateCoordinator,
  deleteDepartment,
} = require("../controllers/departmentController");

router.get("/", getDepartments);
router.put("/coordinator", updateCoordinator);
router.delete("/:name", deleteDepartment);

module.exports = router;