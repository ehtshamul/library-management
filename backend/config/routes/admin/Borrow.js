const {borrowbook , returnbooks ,getUserBorrows}= require("../../controllers/admin/Borrow");
const {auth} = require("../../middleware/auth");

const express = require("express");
const router = express.Router();

router.post("/:bookId", auth(["admin", "Auth" ,"User"  ]) ,borrowbook);
router.post("/return/:borrowId", returnbooks);
router.get("/:userId",  getUserBorrows);


module.exports = router;
