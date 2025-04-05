const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/apiFeatures");
const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");

exports.deleteOne = (Modle) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const documents = await Modle.findByIdAndDelete(id);
    if (!documents) {
      return next(new ApiError(`nod documents for this is  id  ${id}`, 404));
    }
    return res.status(200).json({
      message: `Item with id ${id} has been deleted.`,
    });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    // Trigger "save" event when update document
    document.save();
    res.status(200).json({ data: document });
  });

exports.createOne = (Modle) =>
  asyncHandler(async (req, res) => {
    const newDoc = await Modle.create(req.body);
    res.status(201).json({ data: newDoc });
  });

exports.getOne = (Modle) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Modle.findById(id);
    if (!document) {
      return next(new ApiError(`nod document for this is  id  ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getMany = (Modle, modleName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    console.log(filter);
    // Build query
    const documentsCounts = await Order.countDocuments();
    const apiFeatures = new ApiFeatures(Modle.find(filter), req.query)
      .paginate(documentsCounts)
      .search(modleName)
      .filter()
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });
