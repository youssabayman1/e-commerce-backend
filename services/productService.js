const productModel = require("../models/productModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const { request, json } = require("express");
const ApiFeature = require("../utils/apiFeatures");
const factory = require("./handlersFactory");
//@desc get list of products
//@route get/ /api/v1/products
//@access public

exports.getProducts = factory.getMany(productModel, "product");

//desc     get sepsfic product  by id
//@route    get /v1/products/:id

exports.getProduct = factory.getOne(productModel);

// desc  create product
//@route  post/ /api/v1/products
//@access  private
exports.createProduct = factory.createOne(productModel);

//@desc     update sepcfic product by id
//@route    put / api/v1/products/:id
//@access   private
exports.updateProduct = factory.updateOne(productModel);

// desc  delete sepcific product by id
//@route  delete api/vi/products/id
//@access  private

exports.deleteProduct = factory.deleteOne(productModel);
