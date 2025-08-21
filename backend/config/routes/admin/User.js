const express = require('express');
const router = express.Router();
const {signup, login, refresh,logout} = require('../../controllers/admin/User');

// User Signup Route
router.post('/signup',signup);
// User Login Route
router.post('/login', login);
// Refresh Token Route
router.post('/refresh', refresh);
// User Logout Route
router.post('/logout', logout);


// Export the router
module.exports = router;
