const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

// Assuming you have a function named 'getCategories' in your services
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../services/productService");
const router = express.Router();
const authroute = require("../services/authService");
// Routes

router
  .route("/")
  .get(getProducts)
  .post(
    authroute.protect,
    authroute.allowedTo("manger", "admin"),
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
