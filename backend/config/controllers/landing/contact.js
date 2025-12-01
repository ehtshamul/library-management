const Contact = require("../../models/admin/contact");
const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

// Load environment variables
dotenv.config();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_name, // From .env file
    pass: process.env.EMAIL_pass, // From .env file
  },
});

// Save message + send emails
const contactForm = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    // Save message in database
    const newContact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });
    await newContact.save();

    // Send notification email to admin
   const mailOptions = {
  from: process.env.EMAIL_NAME, // Your Gmail
  to: email, // User's email
  subject: `📩 We received your message: ${subject}`,
  html: `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; background-color: #f9f9f9;">
    
    <!-- Header -->
    <div style="text-align: center; padding-bottom: 20px;">
      <h1 style="color:#2a7ae2; margin: 0;">Library Team</h1>
      <p style="color: #555; font-size: 14px; margin: 5px 0 0 0;">Your library, your knowledge hub</p>
    </div>
    
    <!-- Greeting -->
    <p style="font-size: 16px; color: #333;">Hi <strong>${name}</strong>,</p>
    
    <!-- Body -->
    <p style="font-size: 16px; color: #333;">
      Thank you for contacting our library. We have successfully received your message:
    </p>

    <!-- User Message -->
    <div style="background-color: #ffffff; border-left: 4px solid #2a7ae2; padding: 15px; margin: 15px 0; font-size: 15px; color: #333;">
      "${message}"
    </div>

    <p style="font-size: 16px; color: #333;">
      Our team will review your request and get back to you within <strong>24 hours</strong>.
    </p>

    <p style="font-size: 16px; color: #333;">
      If you need urgent assistance, you can reply to this email or call us at <strong>(03160143685)</strong>.
    </p>

    <!-- Footer -->
    <div style="border-top: 1px solid #e0e0e0; padding-top: 15px; margin-top: 20px; font-size: 14px; color: #777; text-align: center;">
      <p>🌐 <a href="https://www.wonderstacklibrary.com" style="color:#2a7ae2; text-decoration:none;">www.wonderstacklibrary.com</a> | 📞 (03160143685) | 📧 ${process.env.EMAIL_NAME}</p>
      <p>Thank you for choosing our library!</p>
    </div>
  </div>
  `
};

    await transporter.sendMail(mailOptions);

    // Send response back to frontend
    res.status(200).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ message: "Error submitting contact  ehtsam  form" });
  }
};

module.exports = { contactForm };