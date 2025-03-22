const express = require("express");
const {
  signupValidator,
  loginInValidator,
} = require("../utils/validators/authVaildator");

// Assuming you have a function named 'getCategories' in your services
const { signUp, logIn, forgotPassword } = require("../services/authService");
const {
  createAdmin,
  logInAdmin,
  forgotPasswordAdmin,
  allowedToAdmin,
  protectAdmin,
} = require("../services/authServiceAdmin");
const router = express.Router();

// Routes

router.route("/signup").post(signupValidator, signUp);
router.route("/login").post(loginInValidator, logIn);
router.route("/forgetPassword").post(forgotPassword);
router.route("/loginAdmin").post(logInAdmin);
router.route("/createAdmin").post(protectAdmin, allowedToAdmin, createAdmin);
router.route("/forgetPassword").post(forgotPasswordAdmin);
module.exports = router;
