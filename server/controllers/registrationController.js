const Registration = require("../models/Registration");
const User = require("../models/User");
const Event = require("../models/Event"); // ✅ ADD THIS
const Attendance = require("../models/Attendance");
const mongoose = require("mongoose");

const createRegistration = async ({ userId, eventId, answers = [], feedback = "", interestLevel = null }) => {
  const user = await User.findById(userId);

  if (!user) {
    return { status: 404, payload: { message: "User not found" } };
  }

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return { status: 400, payload: { message: "Invalid eventId" } };
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return { status: 404, payload: { message: "Event not found" } };
  }

  const already = await Registration.findOne({ userId, eventId });

  if (already) {
    return { status: 400, payload: { message: "Already registered" } };
  }

  const normalizedAnswers = Array.isArray(answers) ? [...answers] : [];
  if (feedback && !normalizedAnswers.some((item) => item?.question === "feedback")) {
    normalizedAnswers.push({ question: "feedback", answer: String(feedback) });
  }

  const reg = await Registration.create({
    userId,
    eventId,
    name: user.name,
    department: event.department,
    studentDepartment: user.department,
    interestLevel: Number.isFinite(Number(interestLevel)) ? Number(interestLevel) : null,
     attendance: "registered",
     certificateGenerated: false,
    year: user.year,
    registerNo: user.registerNo,
    answers: normalizedAnswers,
  });

  console.log("User ID:", userId);
  console.log("Event ID:", eventId);
  console.log("Department:", event.department);

  await Attendance.updateOne(
    { userId, eventId },
    {
      $set: {
        status: "registered",
      },
    },
    { upsert: true }
  );

  if (event) {
    const alreadyExists = event.attendance.some(
      (s) => s.studentId === userId.toString()
    );

    if (!alreadyExists) {
      event.attendance.push({
        studentId: userId.toString(),
        name: user.name,
        registerNo: user.registerNo,
        attended: false,
      });

      await event.save();
    }
  }

  return { status: 201, payload: reg };
};

exports.registerEventV2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { eventId, interestLevel, answers, feedback } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!eventId) {
      return res.status(400).json({ message: "Event ID required" });
    }

    const result = await createRegistration({
      userId,
      eventId,
      answers,
      feedback,
      interestLevel,
    });

    if (result.status !== 201) {
      return res.status(result.status).json(result.payload);
    }

    return res.status(201).json({
      message: "Registration successful",
      data: result.payload,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Register for event
exports.registerEvent = async (req, res) => {
  try {
    const { eventId, answers } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await createRegistration({ userId, eventId, answers });
    return res.status(result.status).json(result.payload);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.registerEventFromModal = async (req, res) => {
  try {
    const { userId, eventId, feedback, answers } = req.body;
    const authUserId = req.user?.id;

    console.log("User:", userId);
    console.log("Event:", eventId);

    if (!authUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!userId || !eventId) {
      return res.status(400).json({ message: "userId and eventId are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid userId or eventId" });
    }

    if (userId !== authUserId) {
      return res.status(403).json({ message: "Forbidden: cannot register for another user" });
    }

    const result = await createRegistration({
      userId,
      eventId,
      answers,
      feedback,
      interestLevel: req.body?.interestLevel,
    });

    if (result.status !== 201) {
      return res.status(result.status).json(result.payload);
    }

    return res.status(201).json({
      message: "Registered successfully",
      registration: result.payload,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Registration failed" });
  }
};

// ✅ Get registrations for a specific event
exports.getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const data = await Registration.find({
      eventId: new mongoose.Types.ObjectId(eventId)
    })
      .select("name department studentDepartment year registerNo answers createdAt")
      .lean();

    const normalized = data.map((item) => ({
      ...item,
      department: item.studentDepartment || item.department || "",
    }));

    res.json(normalized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get user's registered events
exports.getMyEvents = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const events = await Registration.find({ userId })
      .populate("eventId");

    console.log("[registrations:getMyEvents] userId=", userId, "count=", events.length);

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getParticipationHistory = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Read from both sources so history still works even if one source is stale.
    const [attendedRegistrations, presentAttendance] = await Promise.all([
      Registration.find({
        userId,
        attended: true,
      }).populate("eventId"),
      Attendance.find({
        userId,
        status: "present",
      }).populate("eventId"),
    ]);

    const byEventId = new Map();

    attendedRegistrations.forEach((item) => {
      const eventId = String(item?.eventId?._id || item?.eventId || "");
      if (!eventId) return;
      byEventId.set(eventId, item);
    });

    presentAttendance.forEach((item) => {
      const eventId = String(item?.eventId?._id || item?.eventId || "");
      if (!eventId || byEventId.has(eventId)) return;

      // Normalize attendance-only entries to registration-like shape for UI compatibility.
      byEventId.set(eventId, {
        _id: `attendance-${item._id}`,
        userId: item.userId,
        eventId: item.eventId,
        attended: true,
        attendance: "present",
        certificateGenerated: false,
        certificateUrl: "",
        createdAt: item.createdAt,
      });
    });

    const data = Array.from(byEventId.values()).sort((a, b) => {
      const dateA = new Date(a?.eventId?.date || a?.createdAt || 0).getTime();
      const dateB = new Date(b?.eventId?.date || b?.createdAt || 0).getTime();
      return dateB - dateA;
    });

    console.log("[registrations:getParticipationHistory] userId=", userId, "count=", data.length);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

exports.syncAttendanceToRegistrations = async (eventId, attendance = []) => {
  // Keep registration.attended aligned with event attendance records
  if (!eventId || !Array.isArray(attendance)) return;

  const bulkOps = attendance
    .filter((entry) => entry?.studentId)
    .map((entry) => ({
      updateOne: {
        filter: {
          eventId,
          userId: entry.studentId,
        },
        update: {
          $set: {
            attended: Boolean(entry.attended),
            attendance: entry.attended ? "present" : "absent",
          },
        },
      },
    }));

  if (!bulkOps.length) return;
  await Registration.bulkWrite(bulkOps);

  const attendanceBulkOps = attendance
    .filter((entry) => entry?.studentId)
    .map((entry) => ({
      updateOne: {
        filter: {
          eventId,
          userId: entry.studentId,
        },
        update: {
          $set: {
            status: entry.attended ? "present" : "absent",
          },
        },
        upsert: true,
      },
    }));

  if (!attendanceBulkOps.length) return;
  await Attendance.bulkWrite(attendanceBulkOps);
};

// ✅ Export full registration data
exports.exportRegistrations = async (req, res) => {
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