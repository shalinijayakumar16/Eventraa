const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 🔥 REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { name, registerNo, email, password, department, year } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      registerNo: registerNo.toUpperCase(),
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

    const user = await User.findOne({
      registerNo: registerNo.toUpperCase()
    });

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

// 🔥 DEPARTMENT LOGIN
exports.deptLogin = async (req, res) => {
  const { deptId, password } = req.body;

  const departments = [
    { deptId: "CSE", password: "cse123" },
    { deptId: "IT", password: "it123" },
    { deptId: "ECE", password: "ece123" },
    { deptId: "MECH", password: "mech123" },
    { deptId: "CIVIL", password: "civil123" },
    { deptId: "EEE", password: "eee123" },
    { deptId: "BIO", password: "bio123" },
    { deptId: "MBA", password: "mba123" },
    { deptId: "MCA", password: "mca123" },
    { deptId: "OTHER", password: "other123" }
  ];

  const dept = departments.find(
    d => d.deptId === deptId && d.password === password
  );

  if (!dept) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({
    message: "Department login successful",
    department: dept.deptId
  });
};

// ✅ GET PROFILE (by ID)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// ✅ UPDATE PROFILE
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, department, year, profilePic } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        department,
        year,
        profilePic
      },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};