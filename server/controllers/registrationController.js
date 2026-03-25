const Registration = require("../models/Registration");

// ✅ Register for event
exports.registerEvent = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    // prevent duplicate
    const already = await Registration.findOne({ userId, eventId });

    if (already) {
      return res.status(400).json({ message: "Already registered" });
    }

    const reg = await Registration.create({ userId, eventId });

    res.json(reg);
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