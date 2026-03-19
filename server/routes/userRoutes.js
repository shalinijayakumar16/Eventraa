const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  registerUser,
  loginUser,deptLogin
} = require("../controllers/userController");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);
// Department Login
router.post("/dept-login", deptLogin);




module.exports = router;