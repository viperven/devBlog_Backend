//user routes
const express = require("express");
const router = express.Router();

const {
  sendOtp,
} = require("../contoller/authController");

// const { userAuth } = require("../middlewares/auth");

router.post("/sendOtp", sendOtp);

module.exports = router;
