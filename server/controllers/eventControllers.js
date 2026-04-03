const Event = require("../models/Event");
const Registration = require("../models/Registration");

// ✅ CREATE EVENT (with poster + formFields + applyBy)
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

    const eventData = {
      ...req.body,
      formFields,
      poster: req.file ? req.file.path.replace(/\\/g, "/") : null
    };

    const event = await Event.create(eventData);

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ GET ALL EVENTS (ACTIVE + EXPIRED based on applyBy)
exports.getAllEvents = async (req, res) => {
  try {
    const { department, type, userId } = req.query;

    let filter = {};
    if (department) filter.department = department;
    if (type) filter.type = type;

    const events = await Event.find(filter);

    // 🔥 NEW: get user registrations
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
        isRegistered: registeredEventIds.includes(e._id.toString()) // ✅ FIX
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


// ✅ GET EVENTS BY DEPARTMENT (ACTIVE + EXPIRED)
exports.getEventsByDept = async (req, res) => {
  try {
    const { userId } = req.query; // ✅ GET USER ID

    const events = await Event.find({
      department: req.params.dept
    });

    // ✅ FETCH REGISTRATIONS
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
        isRegistered: registeredEventIds.includes(e._id.toString()) // ✅ ADD HERE
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


// ✅ UPDATE EVENT
exports.updateEvent = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // Handle formFields parsing
    if (req.body.formFields) {
      try {
        updateData.formFields = JSON.parse(req.body.formFields);
      } catch (err) {
        return res.status(400).json({ message: "Invalid formFields format" });
      }
    }

    // Handle poster update
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