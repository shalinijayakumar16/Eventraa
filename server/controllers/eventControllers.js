const Event = require("../models/Event");
const Registration = require("../models/Registration");

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

    const eventData = {
      ...req.body,
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
    const { department, type, userId } = req.query;

    let filter = {};
    if (department) filter.department = department;
    if (type) filter.type = type;

    const events = await Event.find(filter);

    let registeredEventIds = [];

    if (userId) {
      const registrations = await Registration.find({ userId });
      registeredEventIds = registrations.map(r =>
        r.eventId.toString()
      );
    }

    const now = new Date();

    const active = [];
    const expired = [];

    events.forEach(e => {
      const isExpired = new Date(e.applyBy) < now;

      const eventObj = {
        ...e._doc,
        status: isExpired ? "expired" : "active",
        isRegistered: registeredEventIds.includes(e._id.toString())
      };

      if (isExpired) expired.push(eventObj);
      else active.push(eventObj);
    });

    res.json({
      active,
      expired,
      total: events.length
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET EVENTS BY DEPARTMENT
exports.getEventsByDept = async (req, res) => {
  try {
    const { userId } = req.query;

    const events = await Event.find({
      department: req.params.dept
    });

    let registeredEventIds = [];
    if (userId) {
      const registrations = await Registration.find({ userId });
      registeredEventIds = registrations.map(r =>
        r.eventId.toString()
      );
    }

    const now = new Date();

    const active = [];
    const expired = [];

    events.forEach(e => {
      const isExpired = new Date(e.applyBy) < now;

      const eventObj = {
        ...e._doc,
        status: isExpired ? "expired" : "active",
        isRegistered: registeredEventIds.includes(e._id.toString())
      };

      if (isExpired) expired.push(eventObj);
      else active.push(eventObj);
    });

    res.json({
      active,
      expired,
      total: events.length
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
      { new: true }
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