const express = require("express");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

// Assuming you have a function named 'getCategories' in your services
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../services/CategoryService");

const router = express.Router();
const subCategoryRoute = require("./subCategoryRoutes");
const authroute = require("../services/authService");
// Routes

router
  .route("/")
  .get(getCategories)
  .post(
    authroute.protect,
    authroute.allowedTo("admin", "manger"),
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authroute.protect,
    authroute.allowedTo("admin", "manger"),
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
