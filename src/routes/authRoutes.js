//user routes
const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  register,
  login,
} = require("../contoller/authController");

// const { userAuth } = require("../middlewares/auth");

router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
