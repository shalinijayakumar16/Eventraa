const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  registerNo: {              
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  department: {
    type: String
  },
  interests: {
    type: [String],
    default: []
  },
  interest: {
    type: String,
    default: ""
  },
  year: {
    type: String
  },
   // ✅ NEW FIELD
  profilePic: {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });


module.exports = mongoose.model("User", userSchema);