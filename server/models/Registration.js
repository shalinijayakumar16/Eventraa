const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },
    attended: {
      type: Boolean,
      default: false,
    },
    attendance: {
      type: String,
      enum: ["registered", "present", "absent"],
      default: "registered",
    },
    certificateGenerated: {
      type: Boolean,
      default: false,
    },
    // Store generated certificate link
    certificateUrl: {
      type: String,
      default: "",
    },

    // 🔥 Snapshot of student details (auto-filled from User)
    name: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    studentDepartment: {
      type: String,
      default: ""
    },
    interestLevel: {
      type: Number,
      default: null
    },
    year: {
      type: String,
      required: true
    },
    registerNo: {
      type: String,
      required: true
    },

    // 📝 Dynamic form answers
    answers: [
      {
        question: {
          type: String
        },
        answer: {
          type: String
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);