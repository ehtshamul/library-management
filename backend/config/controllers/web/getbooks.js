// getbooks.js
const Books = require("../../models/admin/Addbook"); // make sure path is correct

// Fetch all books
const getBooks = async (req, res) => {
  try {
    // You must call find() as a function
    const books = await Books.find().sort({ createdAt: -1 }); 
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: error.message });
  }
};

// Fetch latest book
const getbooklatest = async (req, res) => {
  try {
    const latestBooks = await Books.find().sort({ createdAt: -1 }).limit(5);
    res.json(latestBooks);
  } catch (error) {
    console.error("Error fetching latest book:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getBooks, getbooklatest };
