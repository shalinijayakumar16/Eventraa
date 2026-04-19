/**
 * Government Events Routes
 * ------------------------
 * Provides API endpoints for government event listings.
 */

const express = require("express");
const GovEvent = require("../models/GovEvent");

const router = express.Router();

/**
 * GET /api/gov-events
 * Returns all government events sorted by newest date first.
 */
router.get("/", async (_req, res) => {
  try {
    const events = await GovEvent.find({}).sort({ date: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("[GovEvents] Failed to fetch government events:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch government events",
    });
  }
});

module.exports = router;
