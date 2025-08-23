const express = require('express');
const router = express.Router();
const { books, update ,Getid } = require("../../controllers/admin/Books");
const uploadMiddleware = require('../../middleware/uploadbook');

const Books = require("../../models/admin/Addbook");
const { createBookValidator } = require("../../middleware/expressvailidator");
const {auth}=require('../../middleware/auth')



// Create
router.post("/", auth([ "Admin", "admin" ]) , createBookValidator, uploadMiddleware, books);

// Update
router.put("/:id",createBookValidator,auth(["Admin","admin"]) , uploadMiddleware, update);
// GET book by ID
// GET book by ID
router.get("/:id" ,Getid);



module.exports = router;
