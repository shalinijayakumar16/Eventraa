const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
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
  answers: [
  {
    question: String,
    answer: String
  }
]
}, { timestamps: true });

module.exports = mongoose.model("Registration", registrationSchema);