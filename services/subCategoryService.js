const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const subCategoryModel = require("../models/subCategoryModel");
const ApiFeature = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

exports.SetCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
//@route  post/ /api/v1/categoires
//@access  private
exports.createSubCatgory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
//get   /api/v1/category/:categoryId/subcategories
//get   /api/v1/product/:productyId/reviews

//@desc get list of Subcategoires
//@route get/ /api/v1/subcategories
//@access public
exports.getSubCategories = factory.getMany(subCategoryModel);
//desc     get sepsfic subcategory  by id
//@route    get /v1/subcategories/:id

exports.getSubCategory = factory.getOne(subCategoryModel);

//@desc     update sepcfic category by id
//@route    put / api/v1/category/:id
//@access   private
exports.updateSubCategory = factory.updateOne(subCategoryModel);

// desc  delete sepcific category by id
//@route  delete api/vi/category/id
//@access  private

exports.deleteSubCategory = factory.deleteOne(subCategoryModel);
