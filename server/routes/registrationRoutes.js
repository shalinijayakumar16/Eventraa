const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");

const { exportRegistrations } = require("../controllers/registrationController");

const {
  registerEventV2,
  registerEvent,
  registerEventFromModal,
  getMyEvents,
  getEventRegistrations, // 🔥 ADD
  getParticipationHistory,
} = require("../controllers/registrationController");

// existing
router.post("/", requireAuth, registerEventV2);
router.post("/register", requireAuth, registerEvent);
router.post("/register-event", requireAuth, registerEventFromModal);
router.get("/my-events", requireAuth, getMyEvents);
router.get("/history", requireAuth, getParticipationHistory);

// Backward-compatible aliases; userId is ignored server-side and replaced by JWT identity.
router.get("/my-events/:userId", requireAuth, getMyEvents);
router.get("/history/:userId", requireAuth, getParticipationHistory);

// 🔥 NEW ROUTE
router.get("/event-registrations/:eventId", getEventRegistrations);

router.get("/export/:eventId", exportRegistrations);


module.exports = router;