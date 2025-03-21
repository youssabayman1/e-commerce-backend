const express = require("express");
const {
  signupValidator,
  loginInValidator,
} = require("../utils/validators/authVaildator");

// Assuming you have a function named 'getCategories' in your services
const { signUp, logIn, forgotPassword } = require("../services/authService");
const router = express.Router();

// Routes

router.route("/signup").post(signupValidator, signUp);
router.route("/login").post(loginInValidator, logIn);
router.route("/forgetPassword").post(forgotPassword);
/* router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);
 */
module.exports = router;
