const Contact =require("../../models/admin/contact");
const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Email_name,
    pass: process.env.Email_pass,
  },
});
// ===============================
// GET all messages - for admin dashboard
const Adminmail= async (req,res)=>{
    try {
        const messages =await Contact.find().sort({createdAt:-1});
        res.status(200).json(messages);



        
    } catch (error) {
        res.status(500).json({error:"Server error"});
        
    }

}
// ===============================
// 3️⃣ ADMIN REPLIES TO USER
// ===============================
const replyToUser = async (req, res) => {
  try {
    const { id, replyText } = req.body;

    if (!id || !replyText) {
      return res.status(400).json({ error: "ID and reply text are required" });
    }

    // Find message
    const message = await Contact.findById(id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Save admin response
    message.response = replyText;
    await message.save();

    // ---------- SEND PROFESSIONAL HTML EMAIL ----------
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; background:#f6f9fc; padding:20px;">
        <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

          <h2 style="color:#1e293b; margin-bottom:10px;">Hello ${message.name},</h2>

          <p style="color:#475569; font-size:15px; line-height:1.6;">
            We have reviewed your message regarding:
          </p>

          <p style="background:#f1f5f9; padding:12px 16px; border-radius:8px; color:#334155; font-size:14px;">
            <strong>${message.subject}</strong>
          </p>

          <p style="color:#475569; font-size:15px; margin-top:18px;">
            Here is our response:
          </p>

          <div style="background:#e0f7ff; padding:14px 18px; border-left:4px solid #0ea5e9; border-radius:8px; color:#0c4a6e; font-size:14px; font-style:italic;">
            ${replyText}
          </div>

          <p style="margin-top:25px; color:#475569; font-size:15px;">
            If you have more questions, feel free to reply to this email.
          </p>

          <p style="margin-top:30px; color:#1e293b; font-weight:bold;">
            Best regards,<br>
            <span style="color:#2563eb;">Admin Team</span>
          </p>

        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.Email_name,
      to: message.email,
      subject: `Re: ${message.subject}`,
      html: htmlTemplate,
    });

    return res.status(200).json({
      message: "Reply sent successfully and saved in database",
    });

  } catch (error) {
    console.error("Reply error:", error);
    return res.status(500).json({
      error: "Server error while sending reply",
    });
  }
};

module.exports={Adminmail ,replyToUser};

