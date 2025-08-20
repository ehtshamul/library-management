const express = require('express');
const router = express.Router();
const { books, update } = require("../../controllers/admin/Books");
const uploadMiddleware = require('../../middleware/uploadbook');
const { protect, adminProtect } = require('../../middleware/admindashboard');
const Books = require("../../models/admin/Addbook");
const { createBookValidator } = require("../../middleware/expressvailidator");



// Create
router.post("/", protect, adminProtect, createBookValidator, uploadMiddleware, books);

// Update
router.put("/:id", protect, adminProtect,createBookValidator, uploadMiddleware, update);
// GET book by ID
// GET book by ID
router.get("/:id", async (req, res) => {
  console.log("Fetching book ID:", req.params.id);
  try {
    const book = await Books.findById(req.params.id); // <-- use "Books"
    console.log("Found book:", book);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    console.error("Error in get book:", err);
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
