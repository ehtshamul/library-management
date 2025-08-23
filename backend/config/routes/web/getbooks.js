const express = require('express');
const router = express.Router();
const { getBooks,getbooklatest}= require("../../controllers/web/getbooks");

router.get('/getbooks', getBooks);
router.get('/getbooklatest', getbooklatest);

module.exports = router;
