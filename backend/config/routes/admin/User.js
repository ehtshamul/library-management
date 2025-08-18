const express = require('express');
const router = express.Router();
const {signup, login} = require('../../controllers/admin/User');

// User Signup Route
router.post('/signup',signup);
// User Login Route
router.post('/login', login);
// Export the router
module.exports = router;
