const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["registered", "present", "absent"],
      default: "registered",
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);