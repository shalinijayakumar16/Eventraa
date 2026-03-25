const express = require("express");
const router = express.Router();

const {
  registerEvent,
  getMyEvents,
  getEventRegistrations // 🔥 ADD
} = require("../controllers/registrationController");

// existing
router.post("/register", registerEvent);
router.get("/my-events/:userId", getMyEvents);

// 🔥 NEW ROUTE
router.get("/event-registrations/:eventId", getEventRegistrations);

module.exports = router;