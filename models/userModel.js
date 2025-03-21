const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, // Corrected 'trype' to 'type'
      trim: true,
      required: [true, "name is required"], // Updated error message for consistency
    },

    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    profileImg: String,
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "Password is too short"],
    },
    passwordChangeAt: Date,
    passwordResetCode: String,
    passwordResetExpire: Date,
    role: {
      type: String,
      enum: ["admin", "manger", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  //incrypt password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema); // Fixed typo: 'moongose' -> 'mongoose'
module.exports = User;
