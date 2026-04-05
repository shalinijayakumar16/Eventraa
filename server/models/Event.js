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

  applyBy: {
    type: Date,
    required: true
  },

  deadline: {
    type: Date
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

  // 🔥 Custom Form Fields
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
  },

  // ✅ NEW: Attendance Tracking
  attendance: [
    {
      studentId: {
        type: String
      },
      name: {
        type: String
      },
      registerNo: {
        type: String
      },
      department :{
        type: String
      },
      year: {
        type: String
      },
      
      attended: {
        type: Boolean,
        default: false
      }
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);