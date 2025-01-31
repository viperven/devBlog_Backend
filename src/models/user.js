const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
    },
    profilePicture: {
      type: String,
      trim: true,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
  return await jwt.sign(
    {
      id: this._id,
      email: this.emailId,
      name: this.name,
    },
    process.env.jwtSecret,
    { expiresIn: "1d" }
  );
};

const User = mongoose.model("User", userSchema);

module.exports = User;
