const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const { getRecommendations, getMlRecommendations } = require("../controllers/recommendationController");

router.get("/ml/:userId", requireAuth, getMlRecommendations);

router.get("/:userId", requireAuth, getRecommendations);

module.exports = router;
