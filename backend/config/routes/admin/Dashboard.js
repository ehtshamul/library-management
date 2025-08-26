const express = require('express');
const router = express.Router();
// Middleware to protect routes
const {auth} = require('../../middleware/auth'); // Import your auth middleware

router.get("/dashboard", auth([ "Admin", "admin" ]), (req, res) => { // Apply auth middleware
  try {
    res.status(200).json({
      message: "Welcome to the Admin Dashboard",
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role || "Admin" // Fallback to "Admin" if role is not set
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
