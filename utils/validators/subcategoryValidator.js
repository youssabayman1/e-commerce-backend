const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

// Validator for creating subcategory
exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Subcategory name is required") // Changed to be more meaningful
    .isLength({ min: 2 })
    .withMessage("Too short subcategory name") // Corrected grammar
    .isLength({ max: 32 })
    .withMessage("Too long subcategory name"), // Corrected grammar

  check("category")
    .notEmpty()
    .withMessage("Category ID is required") // Changed to be more meaningful
    .isMongoId()
    .withMessage("Invalid category ID, must be a valid MongoDB ObjectId"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  validatorMiddleware, // Ensures validation errors are handled
];

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory ID"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory ID"),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory ID"),
  validatorMiddleware,
];
