
const Books = require("../../models/admin/Addbook.js");

// book controllers
// Helper function to ensure a field is always an array
const parseArrayField = (field) => {
  if (!field) return [];
  return Array.isArray(field)
    ? field
    : field.split(",").map(item => item.trim());
};

const books = async (req, res) => {
  const {
    title,
    author,
    coAuthors,
    publisher,
    pubDate,
    edition,
    description,
    isbn,
    language,
    genre,
    categories,
    tags,
    dewey,
    pages,
    copies,
    shelf,
    condition,
    previewLink,
    keywords,
    audience
  } = req.body;

  try {
    // Check required fields
    if (!title || !author || !isbn) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    // Check if book already exists
    const existingBook = await Books.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: "Book with this ISBN already exists",
      });
    }

    // Parse array fields safely
    const categoriesArray = parseArrayField(categories);
    const tagsArray = parseArrayField(tags);
    const keywordsArray = parseArrayField(keywords);

    // Create new book
    const book = await Books.create({
      title,
      author,
      coAuthors: coAuthors || "",
      publisher: publisher || "",
      pubDate: pubDate ? new Date(pubDate) : undefined,
      edition: edition || "",
      description: description || "",
      isbn,
      language: language || "",
      genre: genre || "",
      categories: categoriesArray,
      tags: tagsArray,
      dewey: dewey || "",
      pages: pages ? parseInt(pages) : undefined,
      copies: copies ? parseInt(copies) : 1,
      shelf: shelf || "",
      condition: condition || "Good",
      coverImage: req.file ? req.file.path : "",
      previewLink: previewLink || "",
      keywords: keywordsArray,
      audience: audience || ""
    });
    

    // Success response
    res.status(201).json({
      success: true,
      message: "Book added successfully",
      book: {
        id: book._id,
        title: book.title,
        bookId: book.isbn,
      }
    });

  } catch (error) {
    console.error("Error adding book:", error);
    // Handle specific errors
 
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// updatebooks 

const update = async (req, res) => {
  try {
    // Parse array fields
    if (req.body.categories) req.body.categories = parseArrayField(req.body.categories);
    if (req.body.tags) req.body.tags = parseArrayField(req.body.tags);
    if (req.body.keywords) req.body.keywords = parseArrayField(req.body.keywords);

    // Handle file upload
    if (req.file) req.body.coverImage = req.file.path;

    // Convert numbers
    if (req.body.pages) req.body.pages = parseInt(req.body.pages);
    if (req.body.copies) req.body.copies = parseInt(req.body.copies);

    const updatedBook = await Books.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ message: "Book not found" });
  

    res.status(200).json({ success: true, book: updatedBook });
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).json({ message: "Internal server error" });
   
  }
};



module.exports = {update ,books};
