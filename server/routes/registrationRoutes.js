const express = require("express");
const router = express.Router();

const {
  registerEvent,
  getMyEvents
} = require("../controllers/registrationController");

// POST → register
router.post("/register", registerEvent);

// GET → my events
router.get("/my-events/:userId", getMyEvents);

module.exports = router;