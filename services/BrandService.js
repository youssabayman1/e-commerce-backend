const BrandModel = require("../models/BrandModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploudImageMiddlewares");
exports.uploadBrandImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`upload/brands/${filename}`);

  // Save image into our db
  req.body.image = filename;

  next();
});
//@desc get list of brands
//@route get/ /api/v1/brands
//@access public
exports.getBrands = factory.getMany(BrandModel);

//desc     get sepsfic brand  by id
//@route    get /v1/brands/:id

exports.getBrand = factory.getOne(BrandModel);

// desc  create brand
//@route  post/ /api/v1/brands
//@access  private
exports.createBrand = factory.createOne(BrandModel);
//@desc     update sepcfic brand by id
//@route    put / api/v1/brand/:id
//@access   private
exports.updateBrand = factory.updateOne(BrandModel);
// desc  delete sepcific brand by id
//@route  delete api/vi/brand/id
//@access  private

exports.deleteBrand = factory.deleteOne(BrandModel);
