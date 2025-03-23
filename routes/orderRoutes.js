const express = require("express");
const {
  getOrderValidator,
  createOrderValidator,
  updateOrderValidator,
  deleteOrderValidator,
} = require("../utils/validators/orderVaildator");

// Assuming you have a function named 'getCategories' in your services
const {
  getManyOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../services/orderService");
const router = express.Router();

// Routes

router.route("/").get(getManyOrders).post(createOrderValidator, createOrder);
router
  .route("/:id")
  .get(getOrderValidator, getOrder)
  .put(updateOrderValidator, updateOrder)
  .delete(deleteOrderValidator, deleteOrder);

module.exports = router;
