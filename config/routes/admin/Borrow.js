const borrowBook = require("../../controllers/admin/Borrow");
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const borrowValidator = require("../../middleware/borrow");
const { validationResult } = require("express-validator");

router.post(
  "/borrow",
  borrowValidator,  // 1. validate inputs
  (req, res, next) => {  // 2. handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  auth([ "User"]), // 3. auth middleware
  borrowBook // 4. controller
);

module.exports = router;
