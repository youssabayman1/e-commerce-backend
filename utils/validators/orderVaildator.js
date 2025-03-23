const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Product = require("../../models/productModel");

exports.createOrderValidator = [
  // Validate products array
  check("products")
    .isArray({ min: 1 })
    .withMessage("At least one product must be included in the order")
    .custom(async (products) => {
      for (let productItem of products) {
        const product = await Product.findById(productItem.product);
        if (!product) {
          throw new Error(`Product with ID ${productItem.product} not found`);
        }

        // Validate product quantity
        if (productItem.quantity <= 0) {
          throw new Error(
            `Quantity for product ${productItem.product} must be greater than 0`
          );
        }
      }
      return true;
    }),

  // Validate discountPercentage (optional, should be a valid percentage)
  check("discountPercentage")
    .optional()
    .isNumeric()
    .withMessage("Discount percentage must be a number")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount percentage must be between 0 and 100"),

  // Validate totalAmount - should be numeric and greater than or equal to 0
  check("totalAmount")
    .isNumeric()
    .withMessage("Total amount must be a number")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be greater than or equal to 0"),

  // Validate customer address fields
  check("customerDetails.street")
    .notEmpty()
    .withMessage("Street address is required")
    .isLength({ min: 5 })
    .withMessage("Street address must be at least 5 characters"),

  check("customerDetails.city")
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 3 })
    .withMessage("City name must be at least 3 characters"),

  check("customerDetails.postalCode")
    .notEmpty()
    .withMessage("Postal code is required")
    .isPostalCode("any")
    .withMessage("Invalid postal code format"),

  check("customerDetails.country")
    .notEmpty()
    .withMessage("Country is required")
    .isAlpha()
    .withMessage("Country name must only contain letters"),

  // Validate customer info
  check("customerDetails.Name")
    .notEmpty()
    .withMessage("Customer name is required")
    .isLength({ min: 3 })
    .withMessage("Customer name must be at least 3 characters"),

  check("customerDetails.Phone")
    .notEmpty()
    .withMessage("Customer phone is required")
    .isMobilePhone("ar-EG", { strictMode: false })
    .withMessage("Invalid phone number format"),

  check("customerDetails.Email")
    .notEmpty()
    .withMessage("Customer email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  // Validate order status (optional, can be "pending", "inprogress", "out-for-delivery", "delivered")
  check("status")
    .optional()
    .isIn(["pending", "inprogress", "out-for-delivery", "delivered"])
    .withMessage("Invalid order status"),

  // Use the custom validator middleware
  validatorMiddleware,
];

exports.getOrderValidator = [
  check("id").isMongoId().withMessage("Invalid order ID format"),
  validatorMiddleware,
];

exports.updateOrderValidator = [
  check("id").isMongoId().withMessage("Invalid order ID format"),
  validatorMiddleware,
];

exports.deleteOrderValidator = [
  check("id").isMongoId().withMessage("Invalid order ID format"),
  validatorMiddleware,
];
