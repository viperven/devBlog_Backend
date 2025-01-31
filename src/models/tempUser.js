const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },  // OTP for verification
    otpExpiresAt: { type: Date, required: true }, // Expiry for OTP
    isVerified: { type: Boolean, default: false }  // Flag for verification
}, { timestamps: true });

module.exports = mongoose.model("TempUser", tempUserSchema);
