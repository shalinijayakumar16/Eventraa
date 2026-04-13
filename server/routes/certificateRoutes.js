const express = require("express");
const router = express.Router();

const { generateCertificates, downloadCertificate } = require("../controllers/certificateController");

router.post("/generate/:eventId", generateCertificates);
router.get("/download/:eventId/:userId", downloadCertificate);

module.exports = router;
