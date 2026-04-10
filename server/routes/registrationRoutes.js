const express = require("express");
const router = express.Router();

const { exportRegistrations } = require("../controllers/registrationController");

const {
  registerEvent,
  getMyEvents,
  getEventRegistrations, // 🔥 ADD
  getParticipationHistory,
} = require("../controllers/registrationController");

// existing
router.post("/register", registerEvent);
router.get("/my-events/:userId", getMyEvents);
router.get("/history/:userId", getParticipationHistory);

// 🔥 NEW ROUTE
router.get("/event-registrations/:eventId", getEventRegistrations);

router.get("/export/:eventId", exportRegistrations);


module.exports = router;