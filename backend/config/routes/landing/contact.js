const {contactForm} =require("../../controllers/landing/contact");
const {Adminmail , replyToUser}=require("../../controllers/landing/adminreview");
const express = require("express");
const {auth}= require("../../middleware/auth")
const router = express.Router();


// Route for contact form submission
router.post("/contact", contactForm);
// Route for admin to get all messages
router.get("/", auth (["admin" ,"Admin"]), Adminmail);
// Route for admin to reply to a user message
router.post("/reply", auth (["admin" ,"Admin"]), replyToUser);





module.exports = router;