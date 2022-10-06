const { validationResult, body } = require("express-validator");

const checkValidations = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const errorMessage = error.array().map((err) => err.msg);
    const message = errorMessage.join(". ");

    return res.status(400).json({
      status: "error",
      message,
    });
  }
  next();
};

const createUserValidations = [
  body("username")
    .notEmpty()
    .withMessage("Username cannot be empty")
    .isString()
    .withMessage("Username must be a text")
    .isLength({ min: 3 })
    .withMessage("username must be at least 3 characters"),
  body("email")
    .notEmpty()
    .withMessage("email cannot be empty")
    .isEmail()
    .withMessage("must provide a valid email"),
  body("password")
    .notEmpty()
    .withMessage("password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters")
    .isString()
    .withMessage("password must be a text"),
  checkValidations,
];

const createProductValidations = [
  body("title")
    .notEmpty()
    .withMessage("title cannot be empty")
    .isString()
    .withMessage("tile must be a text")
    .isLength({ min: 3 })
    .withMessage("title must be at least 3 characters"),
  body("description")
    .notEmpty()
    .withMessage("description cannot be empty")
    .isLength({ min: 3 })
    .withMessage("title must be at least 3 characters")
    .isString()
    .withMessage("tile must be a text"),
  body("quantity")
    .notEmpty()
    .withMessage("quantity cannot be empty")
    .isInt()
    .withMessage("quantity must be an integer"),
  body("price")
    .notEmpty()
    .withMessage("price cannot be empty")
    .isInt()
    .withMessage("price must be an integer"),
  checkValidations,
];

const addProductValidators = [
  body("productId")
    .isInt({ min: 1 })
    .withMessage("productId must be a integer."),
  body("quantity").isInt({ min: 1 }).withMessage("quantity must be a integer."),

  checkValidations,
];

const updateProductValidators = [
  body("productId")
    .isInt({ min: 1 })
    .withMessage("productId must be a integer."),
  body("newQty").isInt().withMessage("newQty must be a integer."),

  checkValidations,
];
module.exports = {
  createUserValidations,
  createProductValidations,
  addProductValidators,
  updateProductValidators,
};
