const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");

const { getEventJourney } = require("../controllers/studentController");

router.get("/event-journey/:eventId", requireAuth, getEventJourney);
router.get("/event-journey/:eventId/:userId", requireAuth, getEventJourney);

module.exports = router;
