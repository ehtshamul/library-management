const express = require('express');
const router = express.Router();
const { protect, adminProtect } = require('../../middleware/admindashboard');
const {auth}= require('../../middleware/authmiddleware');

router.get("/dashboard", protect,adminProtect,auth(), (req, res) => {
  try {
    res.status(200).json({
      message: "Welcome to the Admin Dashboard",
      user: {
        id: req.user.id, 

        name: req.user.name || "Admin", 

        email: req.user.email,
        role: req.user.role || "Admin" // Fallback to "Admin" if role is not set
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
