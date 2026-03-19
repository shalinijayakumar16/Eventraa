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
  status: {
  type: String,
  default: "active"
}

}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);