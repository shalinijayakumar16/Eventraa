const express = require("express");
const router = express.Router();
const { chatbot, querySemanticChatbot } = require("../controllers/chatbotController");

router.post("/query", querySemanticChatbot);

router.post("/", chatbot);

module.exports = router;