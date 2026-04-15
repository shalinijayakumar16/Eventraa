const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const { getRecommendations } = require("../controllers/recommendationController");

router.get("/:userId", requireAuth, getRecommendations);

module.exports = router;
