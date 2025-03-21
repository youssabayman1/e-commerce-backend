const userModel = require("../models/userModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploudImageMiddlewares");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");

exports.uploadUserImage = uploadSingleImage("profileImg");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`upload/user/${filename}`);

    // Save image into our db
    req.body.profileImg = filename;
  }

  next();
});

//@desc get list of brands
//@route get/ /api/v1/brands
//@access public
exports.getUsers = factory.getMany(userModel);

//desc     get sepsfic brand  by id
//@route    get /v1/brands/:id

exports.getUser = factory.getOne(userModel);

// desc  create brand
//@route  post/ /api/v1/brands
//@access  private
exports.createUser = factory.createOne(userModel);
//@desc     update sepcfic brand by id
//@route    put / api/v1/brand/:id
//@access   private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  // Trigger "save" event when update document
  document.save();
  res.status(200).json({ data: document });
});

//to change password or update it
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangeAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  // Trigger "save" event when update document
  document.save();
  res.status(200).json({ data: document });
});

// desc  delete sepcific brand by id
//@route  delete api/vi/brand/id
//@access  private

exports.deleteUser = factory.deleteOne(userModel);
