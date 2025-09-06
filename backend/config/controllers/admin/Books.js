const Books = require("../../models/admin/Addbook");
const mongoose = require("mongoose");
const path = require("path");

// ✅ Helper: normalize file path (fix Windows backslashes & remove absolute path)
const normalizePath = (filePath) => {
  if (!filePath) return "";
  return filePath.replace(/\\/g, "/").replace(path.resolve() + "/", "");
};

// ✅ Helper to coerce input into an array
const parseArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    const trimmed = field.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // fall through to comma-split
      }
    }
    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

// 📌 Add new book
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
    audience,
  } = req.body;

  try {
    if (!title || !author || !isbn) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    const existingBook = await Books.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: "Book with this ISBN already exists",
      });
    }

    // Parse array fields
    const categoriesArray = parseArrayField(categories);
    const tagsArray = parseArrayField(tags);
    const keywordsArray = parseArrayField(keywords);
    const coAuthorsArray = parseArrayField(coAuthors);

    const book = await Books.create({
      title,
      author,
      coAuthors: coAuthorsArray,
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
      coverImage: req.file ? normalizePath(req.file.path) : "",
      previewLink: previewLink || "",
      keywords: keywordsArray,
      audience: audience || "",
    });

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      book,
    });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// 📌 Update book
const update = async (req, res) => {
  try {
    if (req.body.categories) req.body.categories = parseArrayField(req.body.categories);
    if (req.body.tags) req.body.tags = parseArrayField(req.body.tags);
    if (req.body.keywords) req.body.keywords = parseArrayField(req.body.keywords);
    if (req.body.coAuthors) req.body.coAuthors = parseArrayField(req.body.coAuthors);

    if (req.file) {
      req.body.coverImage = normalizePath(req.file.path);
    }

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

// 📌 Get book by ID
const Getid = async (req, res) => {
  const { id } = req.params;
  console.log("Fetching book ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }

  try {
    const book = await Books.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    console.error("Error in get book:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📌 Delete book
const delectboosk = async (req, res) => {
  const { id } = req.params;
  console.log("delete book ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }

  try {
    const book = await Books.findByIdAndDelete(id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Error in delete book:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { update, books, Getid, delectboosk };
