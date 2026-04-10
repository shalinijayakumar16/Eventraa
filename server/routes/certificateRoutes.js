const express = require("express");
const router = express.Router();

const { generateCertificates } = require("../controllers/certificateController");

router.post("/generate/:eventId", generateCertificates);

module.exports = router;
