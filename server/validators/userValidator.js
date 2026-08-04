const { body } = require("express-validator");
const validate = require("../middleware/validationMiddleware");

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),

  body("email").isEmail().withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  validate,
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),

  body("password").notEmpty().withMessage("Password is required"),

  validate,
];

module.exports = {
  registerValidation,
  loginValidation,
};
