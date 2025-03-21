const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");
const bcrypt = require("bcrypt");
exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User is required")
    .isLength({ min: 3 })
    .withMessage("too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invaild Email Address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email already exists"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be least 6 characters ")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("password confirmtion incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("password Confirm is required"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,

  validatorMiddleware,
];

exports.changePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("please enter the current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("please enter the confirm passaword"),
  body("password")
    .notEmpty()
    .withMessage("please enter the new password ")
    .custom(async (val, { req }) => {
      //virfiy current password
      const user = await User.findById(req.params.id);

      if (!user) {
        throw new Error("id not found");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Password uncorrect");
      }
      // virfiy confirm password
      if (val !== req.body.passwordConfirm) {
        throw new Error("password confirmtion not same password");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .isEmail()
    .withMessage("Invaild Email Address")
    .custom(
      (val) =>
        User.findOne({ email: val }).then((user) => {
          if (user) {
            return Promise.reject(new Error("email already exists"));
          }
        }),
      check("profileImg").optional(),

      check("role").optional(),
      check("phone").isMobilePhone("ar-EG").withMessage(" number is Invailed")
    ),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID"),
  validatorMiddleware,
];
