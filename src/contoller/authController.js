const User = require("../models/user");
const TempUser = require("../models/tempUser");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { sendOtpbyEmail } = require("../helper/emailService");
const {
  validateVerifyOtp,
  validateSendOtp,
  validteRegister,
  validateLogin,
} = require("../validation/authValidation");

const sendOtp = async (req, res, next) => {
  try {
    validateSendOtp(req);

    const { name, email } = req.body;

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in temp collection
    await TempUser.findOneAndUpdate(
      { email },
      {
        name,
        otp,
        isVerified: false,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      { upsert: true },
      { runValidators: true }
    );

    // Send OTP via email
    sendOtpbyEmail(email, otp);

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    // console.log(err?.message);
    next(err);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    validateVerifyOtp(req);

    const { email, otp } = req.body;

    const tempUser = await TempUser.findOne({ email });

    if (!tempUser)
      return res.status(400).json({ message: "OTP expired, request again" });
    if (tempUser.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    // Mark email as verified
    tempUser.isVerified = true;
    tempUser.otpExpiresAt = new Date(Date.now());
    await tempUser.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    // console.log(err?.message);
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    validteRegister(req);
    const { name, email, password } = req.body;

    const tempUser = await TempUser.findOne({ email });

    if (!tempUser || !tempUser.isVerified)
      return res.status(400).json({ message: "Email not verified" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in users collection
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Delete temp user entry
    await TempUser.deleteOne({ email });

    res.json({ message: "Registration successful" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    validateLogin(req);

    const { email, password } = req.body;

    const isUserExists = await User.findOne({ email: email });
    if (!isUserExists) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "User does not exist" });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      isUserExists.password
    );
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = await isUserExists.generateAuthToken();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    const safeData = {
      id: isUserExists._id,
      name: isUserExists.name,
      email: isUserExists.email,
    };

    res.status(200).json({
      isSuccess: true,
      message: "logged in sucessfulyy",
      apiData: safeData,
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, sendOtp, verifyOtp, login };
