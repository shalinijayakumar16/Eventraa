const express = require("express");
const router = express.Router();

const { exportRegistrations } = require("../controllers/registrationController");

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

router.get("/export/:eventId", exportRegistrations);


module.exports = router;