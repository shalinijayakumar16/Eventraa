const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 🔥 REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { name, registerNo, email, password, department, year } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      registerNo,
      email,
      password: hashedPassword,
      department,
      year
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { registerNo, password } = req.body;

    const user = await User.findOne({ registerNo: registerNo.toUpperCase()});
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};