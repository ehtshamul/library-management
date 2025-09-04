const {borrowbook , returnbooks ,getUserBorrows}= require("../../controllers/admin/Borrow");
const {auth} = require("../../middleware/auth");

const express = require("express");
const router = express.Router();

router.post("/:bookId", auth(), borrowbook);
router.post("/return/:borrowId", auth(), returnbooks);
router.get("/:userId", auth(), getUserBorrows);


module.exports = router;
