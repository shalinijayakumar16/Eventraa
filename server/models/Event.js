const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String
  },
  department: {
    type: String
  },
  type: {
    type: String   // Technical, Workshop, Non-Technical
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  maxParticipants: {
    type: Number
  },
  poster: {
    type: String
  },

  registrationLink: {
    type: String
  },

  // 🔥 NEW FEATURE (IMPORTANT)
  formFields: [
    {
      label: {
        type: String
      },
      type: {
        type: String
      },
      required: {
        type: Boolean,
        default: false
      }
    }
  ],

  status: {
    type: String,
    default: "active"
  }

}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);