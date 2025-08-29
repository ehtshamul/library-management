const { body } = require("express-validator");

const borrowValidator = [
  body("user")
    .notEmpty().withMessage("User ID is required")
    .isMongoId().withMessage("Invalid User ID"),

  body("book")
    .notEmpty().withMessage("Book ID is required")
    .isMongoId().withMessage("Invalid Book ID"),

  body("day")
    .notEmpty().withMessage("Borrow duration is required")
    .isInt({ min: 3, max: 14 })
    .withMessage("Borrow duration must be between 3 and 14 days"),
];

module.exports = borrowValidator;
