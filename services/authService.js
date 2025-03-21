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
exports.signUp = asyncHandler(async (req, res, next) => {
  //create user
  const user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  //generate token
  const token = createToken(user._id);
  res.status(201).json({ data: user, token });
});

//@des  signup
//@route   api/v1/auth/signup
exports.logIn = asyncHandler(async (req, res, next) => {
  //create user
  const user = await userModel.findOne({
    email: req.body.email,
  });
  //generate token

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("email or password is incorrect", 401))();
  }
  const token = createToken(user._id);
  res.status(201).json({ data: user, token });
});

//MAKE SURE that user is login
exports.protect = asyncHandler(async (req, res, next) => {
  //1-check if token exict or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }

  //2-verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded);

  //3- check if user of token exist
  const currentUser = await userModel.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError("the user that belong this token does not exict", 401)
    );
  }

  //4-check if the user chang password after token created
  if (currentUser.passwordChangeAt) {
    const passChangeTimesStamp = parseInt(
      currentUser.passwordChangeAt.getTime() / 1000,
      10
    );
    if (passChangeTimesStamp > decoded.iat) {
      return next(
        new ApiError("user recntily changed password , please login again", 401)
      );
    }
  }
  req.user = currentUser;
  next();
});

exports.allowedTo = (...role) =>
  asyncHandler(async (req, res, next) => {
    //1-access roles
    //2-access registered user
    if (!role.includes(req.user.role)) {
      return next(new ApiError("you cant access this role", 403));
    }
    next();
  });

//to reset your password by send 6 digit number by (reset code) then use crybto to in crybted it

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //1- get user by email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`no email for this user ${req.body.email}`, 404));
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = crypto.createHash("sha256").update(resetCode).digest("hex");

  user.passwordResetCode = hash;
  user.passwordResetExpire = Date.now() + 10;
});
