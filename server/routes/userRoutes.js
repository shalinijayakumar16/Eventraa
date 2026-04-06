const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  deptLogin,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  toggleUserStatus,
  deleteUser
} = require("../controllers/userController");

// 🔹 AUTH ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/dept-login", deptLogin);

// 🔹 PROFILE ROUTES
router.get("/user/:id", getUserProfile);
router.put("/user/:id", updateUserProfile);

// 🔹 ADMIN USER MANAGEMENT ROUTES
router.get("/all", getAllUsers);
router.put("/toggle-status/:id", toggleUserStatus);
router.delete("/delete/:id", deleteUser);

module.exports = router;