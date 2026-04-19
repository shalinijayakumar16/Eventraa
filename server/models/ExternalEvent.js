/**
 * ExternalEvent Model
 * ──────────────────────────────────────────────────────
 * Represents events from other colleges
 * Fields: id, title, college_name, date, description, registration_link, source
 */

const mongoose = require("mongoose");

const externalEventSchema = new mongoose.Schema({
  // Event title/name
  title: {
    type: String,
    required: true,
    trim: true,
  },

  // Name of the college organizing the event
  college_name: {
    type: String,
    required: true,
    trim: true,
  },

  // Event date
  date: {
    type: Date,
    required: true,
  },

  // Event description
  description: {
    type: String,
    trim: true,
  },

  // External registration link (where students register)
  registration_link: {
    type: String,
    required: true,
    trim: true,
  },

  // Source of the event (e.g., "LinkedIn", "TechCrunch", "Manual")
  source: {
    type: String,
    default: "Manual",
    trim: true,
  },

  // Timestamp when event was added to our system
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Timestamp when event was last updated
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-update the updatedAt field on every save
externalEventSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("ExternalEvent", externalEventSchema);
