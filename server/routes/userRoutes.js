const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  deptLogin,
  getUserProfile,
  updateUserProfile
} = require("../controllers/userController");

// 🔹 AUTH ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/dept-login", deptLogin);

// 🔹 PROFILE ROUTES
router.get("/user/:id", getUserProfile);
router.put("/user/:id", updateUserProfile);

module.exports = router;