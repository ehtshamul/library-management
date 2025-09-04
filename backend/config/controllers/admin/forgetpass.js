const { User } = require("../../models/admin/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Nodemailer setup
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Email_name,
    pass: process.env.Email_pass,
  },
});

// Step 1: Send OTP
const sendOtp = async (req, res) => {
  try {
    // Expect email as string
    const email = req.body.email && req.body.email.email ? req.body.email.email : null;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 min expiry
    await user.save();

    await transport.sendMail({
      from: process.env.Email_name,
      to: email,
      subject: "🔐 Your Password Reset OTP",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Step 2: Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.resetOtp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.resetOtpExpiry < Date.now()) return res.status(400).json({ message: "OTP expired" });

    // Set plain password and let Mongoose pre-save hook hash it to avoid double-hashing
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendOtp, resetPassword };
