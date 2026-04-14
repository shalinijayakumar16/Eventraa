const Registration = require("../models/Registration");
const Certificate = require("../models/Certificate");
const Attendance = require("../models/Attendance");
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

    const [presentAttendance, attendedOrPresentRegistrations] = await Promise.all([
      Attendance.find({ eventId: eventObjectId, status: "present" }).select("userId"),
      Registration.find({
        eventId: eventObjectId,
        $or: [{ attended: true }, { attendance: "present" }],
      }).populate("userId eventId"),
    ]);

    const presentUserIds = new Set(
      presentAttendance
        .map((item) => String(item?.userId || ""))
        .filter(Boolean)
    );

    const registrations = await Registration.find({ eventId: eventObjectId })
      .populate("userId eventId")
      .then((all) =>
        all.filter((registration) => {
          const registrationUserId = String(registration?.userId?._id || registration?.userId || "");
          if (!registrationUserId) return false;

          return (
            Boolean(registration?.attended) ||
            registration?.attendance === "present" ||
            presentUserIds.has(registrationUserId)
          );
        })
      );

    console.log("[certificate:generate] eventId=", String(eventObjectId));
    console.log("[certificate:generate] present attendance count:", presentAttendance.length);
    console.log("[certificate:generate] prefiltered registration count:", attendedOrPresentRegistrations.length);
    console.log("[certificate:generate] eligible registration count:", registrations.length);

    // Ensure registrations array is not empty
    if (registrations.length === 0) {
      return res.status(400).json({
        message: "No present students found for this event",
      });
    }

    const updated = [];

    // Generate certificate placeholder for each attendee
    for (const reg of registrations) {
      console.log("Generating certificate for:", reg.userId?.name || reg.userId?._id);

      // Loop through each student and assign certificate
      const fileName = `certificate-${eventObjectId}-${reg.userId._id}.pdf`;
      const filePath = path.join(CERTIFICATE_DIR, fileName);

      ensureCertificateFile(filePath);

      // Save accessible file path for frontend download
      const certificateUrl = `/certificates/${fileName}`;
      reg.certificateUrl = certificateUrl;
      reg.certificateGenerated = true;
      reg.attended = true;
      reg.attendance = "present";

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

      updated.push({
        registrationId: reg._id,
        userId: reg.userId?._id,
        eventId: eventObjectId,
        attendance: reg.attendance,
        certificateGenerated: reg.certificateGenerated,
        certificateUrl,
      });
    }

    console.log("[certificate:generate] updated registrations:", updated);
    return res.json({
      message: "Certificates generated successfully",
      updatedCount: updated.length,
      registrations: updated,
    });
  } catch (error) {
    console.error("Certificate error:", error);
    return res.status(500).json({ message: "Error generating certificates" });
  }
};

exports.downloadCertificate = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userIdFromParams = req.params.userId;
    const authUserId = req.user?.id;

    if (!authUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (userIdFromParams && userIdFromParams !== authUserId) {
      return res.status(403).json({ message: "Forbidden: cannot access another user's certificate" });
    }

    const userId = authUserId;

    if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid eventId or userId" });
    }

    console.log("[certificate:download] userId=", userId, "eventId=", eventId);

    fs.mkdirSync(CERTIFICATE_DIR, { recursive: true });

    const registration = await Registration.findOne({ eventId, userId }).populate("userId eventId");
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    if (!registration.attended) {
      return res.status(403).json({ message: "Attendance not marked yet" });
    }

    const eventObjectId = new mongoose.Types.ObjectId(eventId);
    const fileName = `certificate-${eventObjectId}-${userId}.pdf`;
    const filePath = path.join(CERTIFICATE_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      ensureCertificateFile(filePath);
    }

    const certificateUrl = `/certificates/${fileName}`;

    await Certificate.updateOne(
      { userId, eventId: eventObjectId },
      {
        $set: {
          certificateUrl,
          generatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    await Registration.updateOne(
      { userId, eventId: eventObjectId },
      {
        $set: {
          attended: true,
          attendance: "present",
          certificateGenerated: true,
          certificateUrl,
        },
      }
    );

    return res.download(filePath, fileName, (error) => {
      if (error && !res.headersSent) {
        return res.status(500).json({ message: "Unable to download certificate" });
      }
    });
  } catch (error) {
    console.error("Certificate download error:", error);
    return res.status(500).json({ message: "Error downloading certificate" });
  }
};
