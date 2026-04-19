// models/ExternalEvent.js
const mongoose = require("mongoose");

const externalEventSchema = new mongoose.Schema({
  title: String,
  link: { type: String, unique: true },
  description: String,
  date: String,
  tags: [String],
  platform: { type: String, default: "devfolio" }
});

module.exports = mongoose.model("ExternalEvent", externalEventSchema);