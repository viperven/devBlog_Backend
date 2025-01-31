const User = require("../models/user");
const TempUser = require("../models/tempUser");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { sendOtpbyEmail } = require("../helper/emailService");

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const tempUser = await TempUser.findOne({ email });

        if (!tempUser) return res.status(400).json({ message: "OTP expired, request again" });
        if (tempUser.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

        // Mark email as verified
        tempUser.isVerified = true;
        await tempUser.save();

        res.json({ message: "Email verified successfully" });
    }
    catch (err) {
        // console.log(err?.message);
        res.status(500).json({ message: "Internal server error" });

    }
};

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already registered" });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP in temp collection
        await TempUser.findOneAndUpdate(
            { email },
            { otp, isVerified: false, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
            { upsert: true }
        );

        // Send OTP via email
        sendOtpbyEmail(email, otp);

        res.json({ message: "OTP sent to email" });
    }
    catch (err) {
        // console.log(err?.message);
        res.status(500).json({ message: "Internal server error" });

    }
};


const register = async (req, res) => {
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
};

module.exports = { register,sendOtp,verifyOtp };