const Registration = require("../models/Registration");
const User = require("../models/User");
const mongoose = require("mongoose");

// ✅ Register for event
exports.registerEvent = async (req, res) => {
  try {
    const { userId, eventId, answers } = req.body;

    // 🔥 fetch user using userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🚫 prevent duplicate
    const already = await Registration.findOne({ userId, eventId });

    if (already) {
      return res.status(400).json({ message: "Already registered" });
    }

    // ✅ create registration
    const reg = await Registration.create({
      userId,
      eventId,

      name: user.name,
      department: user.department,
      year: user.year,
      registerNo: user.registerNo,

      answers
    });

    res.json(reg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get registrations for a specific event
exports.getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const data = await Registration.find({
      eventId: new mongoose.Types.ObjectId(eventId)
    }).select("name department year registerNo");

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
// ✅ Export full registration data (WITH answers)
exports.exportRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const data = await Registration.find({
      eventId: new mongoose.Types.ObjectId(eventId)
    }); // 🔥 NO .select → includes answers

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};