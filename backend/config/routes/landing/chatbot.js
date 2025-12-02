const chatbotapi =require("../../controllers/landing/chatbot");
const express = require("express");
const router = express.Router();
// Chatbot API route
router.post("/",chatbotapi.chatbotapi);
module.exports = router;
