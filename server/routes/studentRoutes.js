const express = require("express");
const router = express.Router();

const { getEventJourney } = require("../controllers/studentController");

router.get("/event-journey/:eventId/:userId", getEventJourney);

module.exports = router;
