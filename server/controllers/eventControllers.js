const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Certificate = require("../models/Certificate");
const User = require("../models/User");
const { syncAttendanceToRegistrations } = require("./registrationController");
const { getConflictingEvents } = require("../utils/eventClash");

const DEFAULT_EVENT_DURATION_MS = 60 * 60 * 1000;

const resolveEventType = (payload = {}) => {
  const rawValue = payload.eventType ?? payload.type;
  if (typeof rawValue !== "string") return "";
  return rawValue.trim();
};

const toValidDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getEventEndTime = (event) => {
  const end = toValidDate(event?.endTime) || toValidDate(event?.date);
  if (end) return end;

  const start = toValidDate(event?.startTime);
  if (start) return new Date(start.getTime() + DEFAULT_EVENT_DURATION_MS);

  return null;
};

const isEventActiveForUser = (event, certifiedEventIds, now = new Date()) => {
  const endTime = getEventEndTime(event);
  const isCompletedByTime = !endTime || endTime <= now;
  const isCompletedByCertificate = certifiedEventIds.has(String(event._id));
  return !isCompletedByTime && !isCompletedByCertificate;
};

exports.checkEventClash = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    if (!userId || !eventId) {
      return res.status(400).json({ message: "userId and eventId are required" });
    }

    const targetEvent = await Event.findById(eventId).select("_id title date startTime endTime");

    if (!targetEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const registrations = await Registration.find({ userId, eventId: { $ne: eventId } })
      .select("eventId")
      .populate("eventId", "_id title date startTime endTime");

    const existingEvents = registrations
      .map((registration) => registration.eventId)
      .filter(Boolean);

    const conflicts = getConflictingEvents(existingEvents, targetEvent);

    return res.json({
      clash: conflicts.length > 0,
      conflictingEvents: conflicts.map((event) => event.title || "Untitled Event"),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ✅ GET RECOMMENDED EVENTS (LEVEL 1 SCORING)
exports.getRecommendedEvents = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user data from database
    const user = await User.findById(userId).select("department year interests interest");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [events, certificates] = await Promise.all([
      Event.find({ status: "approved" }),
      Certificate.find({ userId }).select("eventId"),
    ]);

    const certifiedEventIds = new Set(certificates.map((item) => String(item.eventId)));
    const now = new Date();

    // Calculate recommendation score for each event
    const scoredEvents = events
      .filter((event) => isEventActiveForUser(event, certifiedEventIds, now))
      .map((event) => {
      let score = 0;

      if (event.department && user.department && event.department === user.department) {
        score += 3;
      }

      if (event.year && user.year && String(event.year) === String(user.year)) {
        score += 2;
      }

      const userInterests = Array.isArray(user.interests)
        ? user.interests
        : user.interest
          ? [user.interest]
          : [];

      const normalizedEventType = event.eventType || event.type;

      if (normalizedEventType && userInterests.includes(normalizedEventType)) {
        score += 2;
      }

      // Higher score = more relevant to the user
        return {
          ...event.toObject(),
          score,
        };
      });

    // Sort events based on score
    const sortedEvents = scoredEvents.sort((a, b) => b.score - a.score);

    // Return top recommended events
    res.json(sortedEvents.slice(0, 5));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
    let formFields = [];

    if (req.body.formFields) {
      try {
        formFields = JSON.parse(req.body.formFields);
      } catch (err) {
        return res.status(400).json({ message: "Invalid formFields format" });
      }
    }

    const deadline = req.body.deadline || req.body.applyBy;
    const eventType = resolveEventType(req.body);

    if (!eventType) {
      return res.status(400).json({ message: "eventType is required" });
    }

    const eventData = {
      ...req.body,
      eventType,
      // Keep legacy field aligned for older UI paths.
      type: eventType,
      // New events require admin approval before being visible
      status: "pending",
      applyBy: deadline,
      deadline,
      maxParticipants: req.body.maxParticipants ? Number(req.body.maxParticipants) : undefined,
      formFields,
      poster: req.file ? req.file.path.replace(/\\/g, "/") : null
    };

    const event = await Event.create(eventData);

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET ALL EVENTS
exports.getAllEvents = async (req, res) => {
  try {
    const { department, type, eventType, userId } = req.query;

    let filter = {
      // Students should only see approved events
      status: "approved",
    };
    if (department) filter.department = department;
    if (eventType || type) {
      const normalizedType = String(eventType || type).trim();
      filter.$or = [
        { eventType: normalizedType },
        { type: normalizedType },
      ];
    }

    const [events, registrations, certificates] = await Promise.all([
      Event.find(filter).sort({ date: 1 }),
      userId ? Registration.find({ userId }).select("eventId") : Promise.resolve([]),
      userId ? Certificate.find({ userId }).select("eventId") : Promise.resolve([]),
    ]);

    const registeredEventIds = new Set(registrations.map((item) => String(item.eventId)));
    const certifiedEventIds = new Set(certificates.map((item) => String(item.eventId)));
    const now = new Date();

    const active = [];
    const completed = [];

    events.forEach((event) => {
      const isActive = isEventActiveForUser(event, certifiedEventIds, now);
      const eventObj = {
        ...event._doc,
        approvalStatus: event.status,
        eventState: isActive ? "active" : "completed",
        isRegistered: registeredEventIds.has(event._id.toString()),
        isCertified: certifiedEventIds.has(event._id.toString()),
      };

      if (isActive) active.push(eventObj);
      else completed.push(eventObj);
    });

    res.json({
      active,
      completed,
      total: events.length,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET EVENTS BY DEPARTMENT
exports.getEventsByDept = async (req, res) => {
  try {
    const { userId } = req.query;

    const [events, registrations, certificates] = await Promise.all([
      Event.find({ department: req.params.dept }).sort({ date: 1 }),
      userId ? Registration.find({ userId }).select("eventId") : Promise.resolve([]),
      userId ? Certificate.find({ userId }).select("eventId") : Promise.resolve([]),
    ]);

    const registeredEventIds = new Set(registrations.map((item) => String(item.eventId)));
    const certifiedEventIds = new Set(certificates.map((item) => String(item.eventId)));
    const now = new Date();

    const active = [];
    const completed = [];

    events.forEach((event) => {
      const isActive = isEventActiveForUser(event, certifiedEventIds, now);
      const eventObj = {
        ...event._doc,
        eventState: isActive ? "active" : "completed",
        isRegistered: registeredEventIds.has(event._id.toString()),
        isCertified: certifiedEventIds.has(event._id.toString()),
      };

      if (isActive) active.push(eventObj);
      else completed.push(eventObj);
    });

    res.json({
      active,
      completed,
      total: events.length,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET ATTENDANCE (UPDATED 🔥)
exports.getAttendance = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🔥 ALWAYS fetch registrations
    const registrations = await Registration.find({ eventId: req.params.id });

    console.log("Registrations:", registrations); // now this WILL print

    // 🔥 Merge attendance with registration data
    const students = registrations.map(r => {
      const existing = event.attendance?.find(
        s => s.studentId === r.userId.toString()
      );

      return {
        studentId: r.userId.toString(),
        name: r.name,
        registerNo: r.registerNo,
        department: r.department,
        year: r.year,
        attended: existing ? existing.attended : false
      };
    });

    res.json(students);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE ATTENDANCE (UPDATED 🔥)
exports.updateAttendance = async (req, res) => {
  try {
    const { attendance } = req.body;

    if (!Array.isArray(attendance)) {
      return res.status(400).json({ message: "Attendance must be an array" });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🔥 Replace full attendance (clean + safe)
    event.attendance = attendance.map(a => ({
      studentId: a.studentId,
      name: a.name || "",
      registerNo: a.registerNo || "",
      department: a.department || "",
      year: a.year || "",
      attended: a.attended
    }));

    await event.save();

    await syncAttendanceToRegistrations(event._id, event.attendance);

    res.status(200).json({
      message: "Attendance saved successfully",
      attendance: event.attendance
    });

  } catch (err) {
    console.error("Attendance Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE EVENT
exports.updateEvent = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (Object.prototype.hasOwnProperty.call(req.body, "eventType") || Object.prototype.hasOwnProperty.call(req.body, "type")) {
      const eventType = resolveEventType(req.body);
      if (!eventType) {
        return res.status(400).json({ message: "eventType must not be empty" });
      }

      updateData.eventType = eventType;
      // Keep legacy field aligned for older UI paths.
      updateData.type = eventType;
    }

    if (req.body.deadline || req.body.applyBy) {
      updateData.applyBy = req.body.deadline || req.body.applyBy;
      updateData.deadline = req.body.deadline || req.body.applyBy;
    }

    if (req.body.maxParticipants !== undefined) {
      updateData.maxParticipants = Number(req.body.maxParticipants);
    }

    if (req.body.formFields) {
      try {
        updateData.formFields = JSON.parse(req.body.formFields);
      } catch (err) {
        return res.status(400).json({ message: "Invalid formFields format" });
      }
    }

    if (req.file) {
      updateData.poster = req.file.path.replace(/\\/g, "/");
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE EVENT
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch events waiting for admin approval
exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve event so it becomes visible to students
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject event to prevent spam
exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event rejected and removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};