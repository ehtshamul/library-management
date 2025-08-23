const { body } = require("express-validator");

const createBookValidator = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 2 }).withMessage("Title must be at least 2 characters long"),

  body("author")
    .notEmpty().withMessage("Author is required"),

  body("isbn")
    .notEmpty().withMessage("ISBN is required")
    .isISBN().withMessage("Invalid ISBN format"),

  body("pubDate")
    .optional()
    .isISO8601().withMessage("Publication date must be a valid date"),

  body("pages")
    .optional()
    .isInt({ min: 1 }).withMessage("Pages must be a positive number"),

  body("copies")
    .optional()
    .isInt({ min: 1 }).withMessage("Copies must be at least 1"),

  body("language")
    .optional()
    .isString().withMessage("Language must be a string"),
];
module.exports = { createBookValidator };