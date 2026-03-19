const Event = require("../models/Event");

// CREATE EVENT (with poster)
exports.createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      poster: req.file ? req.file.path : null
    };

    const event = await Event.create(eventData);

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL EVENTS
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET EVENTS BY DEPARTMENT
exports.getEventsByDept = async (req, res) => {
  try {
    const events = await Event.find({ department: req.params.dept });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE EVENT
exports.updateEvent = async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
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