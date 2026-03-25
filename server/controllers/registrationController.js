const Registration = require("../models/Registration");

// ✅ Register for event (UPDATED)
exports.registerEvent = async (req, res) => {
  try {
    const { userId, eventId, answers } = req.body;

    // prevent duplicate
    const already = await Registration.findOne({ userId, eventId });

    if (already) {
      return res.status(400).json({ message: "Already registered" });
    }

    const reg = await Registration.create({
      userId,
      eventId,
      answers // 🔥 IMPORTANT
    });

    res.json(reg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const mongoose = require("mongoose");

// ✅ Get registrations for a specific event
exports.getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const data = await Registration.find({
      eventId: new mongoose.Types.ObjectId(eventId)
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ✅ Get user's registered events
exports.getMyEvents = async (req, res) => {
  try {
    const { userId } = req.params;

    const events = await Registration.find({ userId })
      .populate("eventId");

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};