const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
    },
    coAuthors: {
      type: [String],
      default: [],
    },
    publisher: {
      type: String,
      default: "",
    },
    pubDate: {
      type: Date,
    },
    edition: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    isbn: {
      type: String,
      unique: true,
      required: true,
    },
    language: {
      type: String,
      default: "",
    },
    genre: {
      type: String,
      default: "",
    },
    categories: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    dewey: {
      type: String,
      default: "",
    },
    pages: {
      type: Number,
    },
    copies: {
      type: Number,
      default: 1,
    },
    shelf: {
      type: String,
      default: "",
    },
    condition: {
      type: String,
      enum: ["New", "Good", "Fair", "Poor"],
      default: "Good",
    },
    coverImage: {
      type: String,
      default: "",
    },
    previewLink: {
      type: String,
      default: "",
    },
    keywords: {
      type: [String],
      default: [],
    },
    audience: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);