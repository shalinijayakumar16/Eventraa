const Event = require("../models/Event");

// CREATE EVENT (with poster)
exports.createEvent = async (req, res) => {
  try {
    let formFields = [];

    // 🔥 Parse dynamic form fields
    if (req.body.formFields) {
      try {
        formFields = JSON.parse(req.body.formFields);
      } catch (err) {
        return res.status(400).json({ message: "Invalid formFields format" });
      }
    }

    const eventData = {
      ...req.body,
      formFields, // ✅ store parsed form fields
      poster: req.file ? req.file.path.replace(/\\/g, "/") : null
    };

    const event = await Event.create(eventData);

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL EVENTS (ONLY ACTIVE)
exports.getAllEvents = async (req, res) => {
  try {
    const { department, type } = req.query;

    let filter = {
      status: "active"
    };

    // ✅ Optional filters
    if (department) {
      filter.department = department;
    }

    if (type) {
      filter.type = type;
    }

    const events = await Event.find(filter);

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET EVENTS BY DEPARTMENT (ONLY ACTIVE)
exports.getEventsByDept = async (req, res) => {
  try {
    const events = await Event.find({
      department: req.params.dept,
      status: "active" // ✅ filter expired
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE EVENT (with optional poster update)
exports.updateEvent = async (req, res) => {
  try {
    let updateData = {
      ...req.body
    };

    // 🔥 Parse formFields if present
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

// DELETE EVENT
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};