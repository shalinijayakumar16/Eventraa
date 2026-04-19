const express = require("express");

const ExternalEvent = require("../models/ExternalEvent");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const events = await ExternalEvent.find().sort({ createdAt: -1, _id: -1 });
    return res.json(Array.isArray(events) ? events : []);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch external events" });
  }
});

module.exports = router;