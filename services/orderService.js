const orderModel = require("../models/orderModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const { request, json } = require("express");
const ApiFeature = require("../utils/apiFeatures");
const factory = require("./handlersFactory");
//@desc get list of products
//@route get/ /api/v1/products
//@access public

exports.getManyOrders = factory.getMany(orderModel, "Order");

//desc     get sepsfic product  by id
//@route    get /v1/products/:id

exports.getOrder = factory.getOne(orderModel);

// desc  create product
//@route  post/ /api/v1/products
//@access  private
exports.createOrder = factory.createOne(orderModel);

//@desc     update sepcfic product by id
//@route    put / api/v1/products/:id
//@access   private
exports.updateOrder = factory.updateOne(orderModel);

// desc  delete sepcific product by id
//@route  delete api/vi/products/id
//@access  private

exports.deleteOrder = factory.deleteOne(orderModel);
