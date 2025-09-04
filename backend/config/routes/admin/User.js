const express = require('express');
const router = express.Router();
const { signup, refresh, logout, login } = require('../../controllers/admin/User');


// User Signup Route
router.post('/signup', signup);
// User Login Route
router.post('/login', login);
// Export the router
router.post('/refresh', refresh);
router.post('/logout', logout);

// Dev-only debug route

// forget password




module.exports = router;
