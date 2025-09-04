const express = require('express');
const router = express.Router();

const {sendOtp , resetPassword} = require('../../controllers/admin/forgetpass');

// Forget Password Route
router.post('/send-otp', sendOtp);
router.post('/reset-password', resetPassword);
module.exports = router;