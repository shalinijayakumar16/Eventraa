const Registration = require("../models/Registration");
const Certificate = require("../models/Certificate");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const CERTIFICATE_DIR = path.join(__dirname, "..", "certificates");
const CERTIFICATE_TEMPLATE = path.join(CERTIFICATE_DIR, "certificate-test.pdf");

const ensureCertificateFile = (targetPath) => {
  if (fs.existsSync(CERTIFICATE_TEMPLATE)) {
    fs.copyFileSync(CERTIFICATE_TEMPLATE, targetPath);
    return;
  }

  const fallbackPdf = Buffer.from(
    "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 18 Tf 40 80 Td (Certificate) Tj ET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n0000000102 00000 n \n0000000241 00000 n \n0000000345 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n415\n%%EOF\n",
    "utf8"
  );

  fs.writeFileSync(targetPath, fallbackPdf);
};

exports.generateCertificates = async (req, res) => {
  try {
    // Check eventId received from frontend
    console.log("Event ID:", req.params.eventId);

    // Ensure correct ObjectId format
    const eventObjectId = new mongoose.Types.ObjectId(req.params.eventId);

    fs.mkdirSync(CERTIFICATE_DIR, { recursive: true });

    // Fetch only attended students
    const registrations = await Registration.find({
      eventId: eventObjectId,
      attended: true,
    }).populate("userId eventId");

    console.log("Registrations found:", registrations);

    // Ensure registrations array is not empty
    if (registrations.length === 0) {
      return res.status(400).json({
        message: "No attended students found for this event",
      });
    }

    // Generate certificate placeholder for each attendee
    for (const reg of registrations) {
      console.log("Generating certificate for:", reg.userId?.name || reg.userId?._id);

      // Loop through each student and assign certificate
      const fileName = `certificate-${reg.userId._id}.pdf`;
      const filePath = path.join(CERTIFICATE_DIR, fileName);

      ensureCertificateFile(filePath);

      // Save accessible file path for frontend download
      const certificateUrl = `/certificates/${fileName}`;
      reg.certificateUrl = certificateUrl;

      // Save updated registration document
      await reg.save();

      await Certificate.updateOne(
        { userId: reg.userId._id, eventId: eventObjectId },
        {
          $set: {
            certificateUrl,
            generatedAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    return res.json({ message: "Certificates generated successfully" });
  } catch (error) {
    console.error("Certificate error:", error);
    return res.status(500).json({ message: "Error generating certificates" });
  }
};
