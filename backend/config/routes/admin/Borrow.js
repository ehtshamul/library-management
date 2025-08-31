const Borrowbooks= require("../../controllers/admin/Borrow");

const express = require("express");
const router = express.Router();

router.post("/borrow", Borrowbooks.borrowbook);

module.exports = router;
