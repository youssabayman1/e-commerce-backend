const CategoryModel = require("../models/CategoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeature = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

//@desc get list of categoires
//@route get/ /api/v1/categories
//@access public
// pagantions
exports.getCategories = factory.getMany(CategoryModel);

//desc     get sepsfic category  by id
//@route    get /v1/categories/:id

exports.getCategory = factory.getOne(CategoryModel);

// desc  create category
//@route  post/ /api/v1/categoires
//@access  private
exports.createCategory = factory.createOne(CategoryModel);

//@desc     update sepcfic category by id
//@route    put / api/v1/category/:id
//@access   private
exports.updateCategory = factory.updateOne(CategoryModel);
// desc  delete sepcific category by id
//@route  delete api/vi/category/id
//@access  private

exports.deleteCategory = factory.deleteOne(CategoryModel);
