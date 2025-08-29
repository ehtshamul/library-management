const express = require('express');
const { searchBooks } = require('../../controllers/web/search'); // ✅ no .js needed if CommonJS
const router = express.Router();

router.get('/search', searchBooks);

module.exports = router;
