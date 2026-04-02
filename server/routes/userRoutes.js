const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

// 🔥 ADD THIS LINE (IMPORTANT)
const User = require("../models/User");

const {
  registerUser,
  loginUser,
  deptLogin
} = require("../controllers/userController");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Department Login
router.post("/dept-login", deptLogin);

// ✅ GET USER PROFILE
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.log(err); // 👈 helpful for debugging
    res.status(500).json({ message: "Error fetching user" });
  }
});

module.exports = router;