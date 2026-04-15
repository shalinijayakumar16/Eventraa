const mongoose = require("mongoose");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Attendance = require("../models/Attendance");

const toRecommendation = (event) => ({
  eventId: String(event._id),
  title: event.title,
  department: event.department || "",
  eventType: event.eventType || event.type || "",
  date: event.date,
});

const getFallbackRecommendations = async (excludeEventIds = []) => {
  const now = new Date();

  const fallback = await Event.find({
    status: "approved",
    date: { $gte: now },
    _id: { $nin: excludeEventIds },
  })
    .sort({ date: 1, createdAt: -1 })
    .limit(5)
    .select("title department eventType type date")
    .lean();

  return fallback.map(toRecommendation);
};

exports.getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    if (req.user && req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const [registrations, presentAttendances] = await Promise.all([
      Registration.find({ userId }).select("eventId").lean(),
      Attendance.find({ userId, status: "present" }).select("eventId").lean(),
    ]);

    const registeredEventIds = [
      ...new Set(registrations.map((item) => String(item.eventId))),
    ];

    const historyEventIds = [
      ...new Set([
        ...registrations.map((item) => String(item.eventId)),
        ...presentAttendances.map((item) => String(item.eventId)),
      ]),
    ];

    // Fallback: no participation history, return latest upcoming events.
    if (!historyEventIds.length) {
      const fallback = await getFallbackRecommendations(registeredEventIds);
      return res.json(fallback);
    }

    const historyEvents = await Event.find({
      _id: { $in: historyEventIds },
    })
      .select("department eventType type")
      .lean();

    const departments = [
      ...new Set(
        historyEvents
          .map((event) => event.department)
          .filter((value) => Boolean(value))
      ),
    ];

    const eventTypes = [
      ...new Set(
        historyEvents
          .map((event) => event.eventType || event.type)
          .filter((value) => Boolean(value))
      ),
    ];

    if (!departments.length && !eventTypes.length) {
      const fallback = await getFallbackRecommendations(registeredEventIds);
      return res.json(fallback);
    }

    const similarFilters = [];
    if (departments.length) {
      similarFilters.push({ department: { $in: departments } });
    }
    if (eventTypes.length) {
      similarFilters.push({ eventType: { $in: eventTypes } });
      similarFilters.push({ type: { $in: eventTypes } });
    }

    const recommendations = await Event.find({
      status: "approved",
      date: { $gte: new Date() },
      _id: { $nin: registeredEventIds },
      $or: similarFilters,
    })
      .sort({ date: 1, createdAt: -1 })
      .limit(5)
      .select("title department eventType type date")
      .lean();

    if (!recommendations.length) {
      const fallback = await getFallbackRecommendations(registeredEventIds);
      return res.json(fallback);
    }

    return res.json(recommendations.map(toRecommendation));
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};
