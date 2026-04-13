const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

const getDateFilterFromRange = (range) => {
  const normalized = String(range || "").trim().toLowerCase();
  if (!normalized || normalized === "all") return {};

  const now = new Date();

  if (normalized === "7d" || normalized === "last7days") {
    const from = new Date(now);
    from.setDate(from.getDate() - 7);
    return { $gte: from, $lte: now };
  }

  if (normalized === "30d" || normalized === "last30days") {
    const from = new Date(now);
    from.setDate(from.getDate() - 30);
    return { $gte: from, $lte: now };
  }

  return {};
};

// Get platform analytics
exports.getAnalytics = async (req, res) => {
  try {
    const createdAtFilter = getDateFilterFromRange(req.query.range);
    const eventMatch = Object.keys(createdAtFilter).length
      ? { createdAt: createdAtFilter }
      : {};
    const registrationMatch = Object.keys(createdAtFilter).length
      ? { createdAt: createdAtFilter }
      : {};

    const [
      totalUsers,
      totalEvents,
      totalRegistrations,
      departmentEvents,
      departmentRegistrations,
      eventPopularity,
    ] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(eventMatch),
      Registration.countDocuments(registrationMatch),
      Event.aggregate([
        { $match: eventMatch },
        {
          $group: {
            _id: { $ifNull: ["$department", "Unknown"] },
            events: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            department: "$_id",
            events: 1,
          },
        },
      ]),
      Registration.aggregate([
        { $match: registrationMatch },
        {
          $lookup: {
            from: "events",
            localField: "eventId",
            foreignField: "_id",
            as: "event",
          },
        },
        { $unwind: "$event" },
        {
          $group: {
            _id: { $ifNull: ["$event.department", "Unknown"] },
            registrations: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            department: "$_id",
            registrations: 1,
          },
        },
      ]),
      Registration.aggregate([
        { $match: registrationMatch },
        {
          $lookup: {
            from: "events",
            localField: "eventId",
            foreignField: "_id",
            as: "event",
          },
        },
        { $unwind: "$event" },
        {
          $group: {
            _id: "$eventId",
            eventTitle: { $first: { $ifNull: ["$event.title", "Untitled Event"] } },
            registrations: { $sum: 1 },
          },
        },
        { $sort: { registrations: -1 } },
        {
          $project: {
            _id: 0,
            eventTitle: 1,
            registrations: 1,
          },
        },
      ]),
    ]);

    const deptMap = new Map();
    departmentEvents.forEach((item) => {
      deptMap.set(item.department, {
        department: item.department,
        events: item.events || 0,
        registrations: 0,
      });
    });

    departmentRegistrations.forEach((item) => {
      const existing = deptMap.get(item.department) || {
        department: item.department,
        events: 0,
        registrations: 0,
      };
      existing.registrations = item.registrations || 0;
      deptMap.set(item.department, existing);
    });

    const departmentActivity = Array.from(deptMap.values()).sort(
      (a, b) => b.registrations - a.registrations || b.events - a.events
    );

    const mostActiveDepartment = departmentActivity[0] || null;

    res.json({
      totalUsers,
      totalEvents,
      totalRegistrations,
      range: req.query.range || "all",
      departmentActivity,
      eventPopularity,
      topEvents: eventPopularity.slice(0, 5),
      mostActiveDepartment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics" });
  }
};