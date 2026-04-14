const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");

const { generateCertificates, downloadCertificate } = require("../controllers/certificateController");

router.post("/generate/:eventId", generateCertificates);
router.get("/download/:eventId", requireAuth, downloadCertificate);
router.get("/download/:eventId/:userId", requireAuth, downloadCertificate);

module.exports = router;
