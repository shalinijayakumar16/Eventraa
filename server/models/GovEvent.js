/**
 * GovEvent Model
 * ----------------
 * Stores government-related events shown in the student dashboard.
 */

const mongoose = require("mongoose");

const govEventSchema = new mongoose.Schema({
  // Event title shown to students.
  title: {
    type: String,
    required: true,
    trim: true,
  },

  // Optional event summary/description.
  description: {
    type: String,
    trim: true,
  },

  // Event date (if available from source).
  date: {
    type: Date,
  },

  // Registration page URL used by the Register button.
  registration_link: {
    type: String,
    required: true,
    trim: true,
  },

  // Source label to identify government-feed events.
  source: {
    type: String,
    default: "Government",
    trim: true,
  },

  // Creation timestamp for event insertion tracking.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GovEvent", govEventSchema);
