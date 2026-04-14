const mongoose = require("mongoose");
const Registration = require("../models/Registration");
const Attendance = require("../models/Attendance");
const Certificate = require("../models/Certificate");

exports.getEventJourney = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userIdFromParams = req.params.userId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (userIdFromParams && userIdFromParams !== userId) {
      return res.status(403).json({ message: "Forbidden: cannot access another user's journey" });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid eventId or userId" });
    }

    const [registration, attendance, certificate] = await Promise.all([
      Registration.findOne({ userId, eventId }).select("_id"),
      Attendance.findOne({ userId, eventId, status: "present" }).select("_id"),
      Certificate.findOne({ userId, eventId }).select("_id"),
    ]);

    return res.json({
      registered: Boolean(registration),
      attended: Boolean(attendance),
      certificateGenerated: Boolean(certificate),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching event journey" });
  }
};
