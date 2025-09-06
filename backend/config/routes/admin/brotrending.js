const express = require('express');
const router = express.Router();
const {trendingBooks}= require("../../charts/Borchart");
const {auth }= require('../../middleware/auth');

router.get('/trending',auth(["Admin" ,"admin"]), trendingBooks);


module.exports = router;
