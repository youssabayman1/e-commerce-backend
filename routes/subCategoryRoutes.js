const express = require("express");

// Assuming you have a function named 'getCategories' in your services
const {
  createSubCatgory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  SetCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryService");

//mergParams allow us to access parmeters on other routers
const router = express.Router({ mergeParams: true });
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subcategoryValidator");
const authroute = require("../services/authService");

router
  .route("/")
  .post(
    authroute.protect,
    authroute.allowedTo("manger", "admin"),
    SetCategoryIdToBody,
    createSubCategoryValidator,
    createSubCatgory
  )
  .get(createFilterObj, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);
module.exports = router;
