const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

// Get platform analytics
exports.getAnalytics = async (req, res) => {
  try {
    // Count total users in database
    const totalUsers = await User.countDocuments();

    // Count total events created
    const totalEvents = await Event.countDocuments();

    // Count total event registrations
    const totalRegistrations = await Registration.countDocuments();

    // Return analytics summary
    res.json({
      totalUsers,
      totalEvents,
      totalRegistrations,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics" });
  }
};