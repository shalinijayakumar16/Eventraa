const Registration = require("../models/Registration");
const User = require("../models/User");
const Event = require("../models/Event"); // ✅ ADD THIS
const Attendance = require("../models/Attendance");
const mongoose = require("mongoose");

// ✅ Register for event
exports.registerEvent = async (req, res) => {
  try {
    const { userId, eventId, answers } = req.body;

    // 🔥 fetch user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🚫 prevent duplicate registration
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

    await Attendance.updateOne(
      { userId, eventId },
      {
        $set: {
          status: "registered",
        },
      },
      { upsert: true }
    );

    // ==============================
    // 🔥 NEW: ADD TO ATTENDANCE
    // ==============================

    const event = await Event.findById(eventId);

    if (event) {
      const alreadyExists = event.attendance.some(
        s => s.studentId === userId.toString()
      );

      if (!alreadyExists) {
        event.attendance.push({
          studentId: userId.toString(),
          name: user.name,
          registerNo: user.registerNo,
          attended: false
        });

        await event.save();
      }
    }

    // ==============================

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
    }).select("name department year registerNo answers createdAt");

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

exports.getParticipationHistory = async (req, res) => {
  try {
    // Fetch only attended events for participation history
    const data = await Registration.find({
      userId: req.params.userId,
      attended: true,
    }).populate("eventId");

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