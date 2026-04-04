const express = require("express");
const router = express.Router();
const controller = require("../controllers/eventControllers");
const upload = require("../middleware/upload");

// CREATE EVENT
router.post("/", upload.single("poster"), controller.createEvent);

// GET ALL EVENTS
router.get("/", controller.getAllEvents);

// GET BY DEPARTMENT
router.get("/dept/:dept", controller.getEventsByDept);

// UPDATE
router.put("/:id", upload.single("poster"), controller.updateEvent);

// DELETE
router.delete("/:id", controller.deleteEvent);

// ==============================
// ✅ NEW: ATTENDANCE ROUTES
// ==============================

// Get attendance for an event
router.get("/:id/attendance", controller.getAttendance);

// Update attendance (mark present/absent)
router.put("/:id/attendance", controller.updateAttendance);

module.exports = router;