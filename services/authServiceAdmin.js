const crypto = require("crypto");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = (payload) => {
  return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXP_TIME,
  });
};

//@des  signup
//@route   api/v1/auth/signup
exports.createAdmin = asyncHandler(async (req, res, next) => {
  // Ensure the logged-in user is an admin
  if (req.user.role !== "admin") {
    return next(new ApiError("You are not authorized to create an admin", 403));
  }

  // 1. Create the new user (admin)
  const newAdmin = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: "admin", // Explicitly set the role to admin
  });

  // 2. Generate a token for the new admin (optional)
  const token = createToken(newAdmin._id);

  // 3. Send response with user data and token
  res.status(201).json({
    message: "Admin created successfully",
    data: newAdmin,
    token, // Optionally send token, or just return the new admin data if token is not needed for the new admin
  });
});

//@des  signup
//@route   api/v1/auth/signup
exports.logInAdmin = asyncHandler(async (req, res, next) => {
  // 1. Find the user by email
  const admin = await userModel.findOne({ email: req.body.email });

  // 2. Check if the user exists and if the password matches
  if (!admin || !(await bcrypt.compare(req.body.password, admin.password))) {
    return next(new ApiError("Email or password is incorrect", 401));
  }

  // 3. Ensure the user is an admin
  if (admin.role !== "admin") {
    return next(new ApiError("You must be an admin to log in", 403)); // Forbidden if not an admin
  }

  // 4. Generate a token for the admin
  const token = createToken(admin._id); // Assuming createToken is a function that generates the JWT

  // 5. Send response with user data and token
  res.status(200).json({
    message: "Logged in successfully",
    data: admin, // User data
    token, // JWT token
  });
});

//to reset your password by send 6 digit number by (reset code) then use crybto to in crybted it
exports.allowedToAdmin = asyncHandler(async (req, res, next) => {
  // Check if the user has 'admin' role
  if (req.user.role !== "admin") {
    return next(
      new ApiError("You don't have permission to access this route", 403)
    ); // Forbidden if not admin
  }
  next(); // Proceed to next middleware or route handler
});

exports.protectAdmin = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if token exists in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError(
        "You are not logged in. Please log in to access this route.",
        401
      )
    );
  }

  // 2. Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3. Find the user associated with the token
  const currentUser = await userModel.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError("The user belonging to this token no longer exists.", 401)
    );
  }

  // 4. Attach user to the request object
  req.user = currentUser;

  next(); // Proceed to the next middleware or route handler
});

// Check if the user is an admin

exports.forgotPasswordAdmin = asyncHandler(async (req, res, next) => {
  //1- get user by email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`no email for this user ${req.body.email}`, 404));
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = crypto.createHash("sha256").update(resetCode).digest("hex");

  user.passwordResetCode = hash;
  //add expire time to reset code (10 min)
  user.passwordResetExpire = Date.now() + 10 * 60 * 1000;
  user.passwordResetVervied = false;
  await user.save();
});
