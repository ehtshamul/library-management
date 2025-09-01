import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addBook, updateBook } from "../store/booksSlice";
import { useNavigate, useParams } from "react-router-dom";

import * as auth from "../server/auth";
import { toast ,ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Select from "react-select";

// Rest of your component code remains the same

// Tag input component (unchanged)
const TagInput = ({ tags, onTagsChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        onTagsChange([...tags, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove) =>
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));

  return (
    <div className="rounded-xl border border-slate-300 bg-slate-50 p-2">
      <div className="flex flex-wrap gap-2 p-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-slate-600 hover:text-red-500"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a tag and press Enter"
        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm placeholder:text-slate-500"
      />
    </div>
  );
};

// Main AddBookForm
export default function AddBookForm({ mode = "add" }) {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    coAuthors: "",
    publisher: "",
    pubDate: "",
    edition: "",
    description: "",
    isbn: "",
    language: "",
    genre: "",
    categories: [],
    tags: [],
    dewey: "",
    pages: "",
    copies: 1,
    shelf: "",
    condition: "Good",
    coverImage: null,
    previewLink: "",
    keywords: [],
    audience: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);

  // Fetch book data if in edit mode
  useEffect(() => {
    const fetchBookData = async () => {
      if (mode === "edit" && id) {
        setLoading(true);
        try {
          const response = await auth.getBookById(id);
          const book = response.data;
          // Convert ISO date -> yyyy-MM-dd
      const formattedDate = book.pubDate 
        ? new Date(book.pubDate).toISOString().split("T")[0] 
        : "";
          
          // Convert comma-separated keywords to array if needed
          const keywordsArray = Array.isArray(book.keywords) 
            ? book.keywords 
            : (book.keywords || "").split(",").map(k => k.trim()).filter(k => k);
            
          setBookData({
            title: book.title || "",
            author: book.author || "",
            coAuthors: Array.isArray(book.coAuthors) ? book.coAuthors.join(", ") : (book.coAuthors || ""),
            publisher: book.publisher || "",
            pubDate: formattedDate || "",
            edition: book.edition || "",
            description: book.description || "",
            isbn: book.isbn || "",
            language: book.language || "",
            genre: book.genre || "",
            categories: book.categories || [],
            tags: book.tags || [],
            dewey: book.dewey || "",
            pages: book.pages || "",
            copies: book.copies || 1,
            shelf: book.shelf || "",
            condition: book.condition || "Good",
            coverImage: null, // Keep as null to avoid file issues
            previewLink: book.previewLink || "",
            keywords: keywordsArray,
            audience: book.audience || "",
          });
        } catch (error) {
          console.error("Error fetching book data:", error);
          setMessage({
            type: "error",
            text: "Failed to load book data. Please try again.",
          });
        }finally{
          setLoading(false);
        }
      }
    };

    fetchBookData();
  }, [mode, id]);

 const handleChange = (e) => {
  const { name, value, multiple, options } = e.target;
  if (multiple) {
    const selected = Array.from(options)
      .filter((o) => o.selected)
      .map((o) => o.value);
    setBookData({ ...bookData, [name]: selected });
  } else {
    setBookData({ ...bookData, [name]: value });
  }
};

  const handleCoverImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBookData({ ...bookData, coverImage: e.target.files[0] });
    }
  };

  const handleTagsChange = (newTags) => {
    setBookData({ ...bookData, tags: newTags });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();

      // Append all fields
      formData.append("title", bookData.title);
      formData.append("author", bookData.author);
      formData.append("coAuthors", bookData.coAuthors);
      formData.append("publisher", bookData.publisher);
      formData.append("pubDate", bookData.pubDate);
      formData.append("edition", bookData.edition);
      formData.append("description", bookData.description);
      formData.append("isbn", bookData.isbn);
      formData.append("language", bookData.language);
      formData.append("genre", bookData.genre);
      formData.append("audience", bookData.audience);
      formData.append("shelf", bookData.shelf);
      formData.append("condition", bookData.condition);
      formData.append("previewLink", bookData.previewLink);

      // Numeric fields
      formData.append("pages", Number(bookData.pages));
      formData.append("copies", Number(bookData.copies));
      // Keep dewey as string to match schema
      formData.append("dewey", bookData.dewey);

      // Arrays as JSON strings
      formData.append("categories", JSON.stringify(bookData.categories));
      formData.append("tags", JSON.stringify(bookData.tags));
      formData.append("keywords", JSON.stringify(bookData.keywords));

      // File
      if (bookData.coverImage) {
        formData.append("coverImage", bookData.coverImage);
      }

     
      if (mode === "edit" && id) {
        // Update existing book using Redux action
        const result = await dispatch(updateBook({ id, bookFormData: formData }));
        if (result.payload) {
          toast.success("Book updated successfully!");
          setTimeout(() => {

          Navigate('../admin/reviews');
          }, 2000);
          setMessage({
            type: "success",
            text: "Book updated successfully!",
          });
        } else {
          toast.error("Failed to update book. Please try again.");
          setMessage({
            type: "error",
            text: "Failed to update book. Please try again.",
          });
        }
      } else {
        // Add new book using Redux action
        const result = await dispatch(addBook(formData));
        if (result.payload) {
          toast.success("Book added successfully!");
          setMessage({
            type: "success",
            text: "Book added successfully!",
          });
          
          // Reset form only for add mode
          setBookData({
            title: "",
            author: "",
            coAuthors: "",
            publisher: "",
            pubDate: "",
            edition: "",
            description: "",
            isbn: "",
            language: "",
            genre: "",
            categories: [],
            tags: [],
            dewey: "",
            pages: "",
            copies: 1,
            shelf: "",
            condition: "Good",
            coverImage: null,
            previewLink: "",
            keywords: [],
            audience: "",
          });

          if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
          toast.error("Failed to add book. Please try again.");
          setMessage({
            type: "error",
            text: "Failed to add book. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting book:", error);
      toast.error(`Failed to ${mode === "edit" ? "update" : "add"} book. Please try again.`);
      const errorMsg =
        error.response?.data?.message || 
        `Failed to ${mode === "edit" ? "update" : "add"} book. Please try again.`;
      setMessage({ type: "error", text: errorMsg });
    } finally {
      toast.dismiss(  'loading' );
      setIsSubmitting(false);
    }
  };

  return (
    
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-5xl">
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}
       {loading && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <p className="text-gray-700 font-medium">Loading book details...</p>
    </div>
  </div>
)}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="p-8 grid gap-6">
            {/* Basic fields */}
            <label>
              Title*:
              <input
                name="title"
                value={bookData.title}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full"
              />
            </label>

            <label>
              Author*:
              <input
                name="author"
                value={bookData.author}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full"
              />
            </label>

            <label>
              Co-Authors:
              <input
                name="coAuthors"
                value={bookData.coAuthors}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </label>

            <label>
              Publisher:
              <input
                name="publisher"
                value={bookData.publisher}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </label>

            <label>
              Publication Date:
              <input
                type="date"
                name="pubDate"
                value={bookData.pubDate}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </label>

            <label>
              Edition:
              <input
                name="edition"
                value={bookData.edition}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </label>

            <label>
              Description:
              <textarea
                name="description"
                value={bookData.description}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </label>

            {/* Cataloging */}
            <label>
              ISBN*:
              <input
                name="isbn"
                value={bookData.isbn}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full"
              />
            </label>

            <label>
              Language:
              <select
                name="language"
                value={bookData.language}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              >
                <option value="">Select Language</option>
                <option>English</option>
                <option>Urdu</option>
                <option>Arabic</option>
                <option>Chinese</option>
                <option>French</option>
                <option>German</option>
                <option>Spanish</option>
              </select>
            </label>

            <label>
              Genre:
              <select
                name="genre"
                value={bookData.genre}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              >
                <option value="">Select Genre</option>
                <option>Fiction</option>
                <option>Non-Fiction</option>
                <option>Science</option>
                <option>Technology</option>
                <option>History</option>
                <option>Biography</option>
                <option>Children</option>
              </select>
            </label>

            {/* Categories */}
           <label className="block font-medium mb-2">Categories:</label>
<div className="space-y-2">
  {[
    "Computer Science",
    "Programming",
    "Self Help",
    "Business",
    "Design",
    "Education",
    "Health",
  ].map((c) => (
    <label key={c} className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={bookData.categories.includes(c)}
        onChange={(e) => {
          if (e.target.checked) {
            // add category
            setBookData({
              ...bookData,
              categories: [...bookData.categories, c],
            });
          } else {
            // remove category
            setBookData({
              ...bookData,
              categories: bookData.categories.filter((x) => x !== c),
            });
          }
        }}
        className="h-4 w-4"
      />
      <span>{c}</span>
    </label>
  ))}
</div>


            {/* Tags */}
            <label>
              Tags:
              <TagInput tags={bookData.tags} onTagsChange={handleTagsChange} />
            </label>

            <label>
              Dewey Decimal:
              <input
                name="dewey"
                value={bookData.dewey}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </label>

            <label>
              Pages:
              <input
                name="pages"
                type="number"
                value={bookData.pages}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </label>

            {/* Inventory */}
            <label>
              Copies:
              <input
                name="copies"
                type="number"
                value={bookData.copies}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </label>

            <label>
              Shelf:
              <input
                name="shelf"
                value={bookData.shelf}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </label>

            <label>
              Condition:
              <select
                name="condition"
                value={bookData.condition}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              >
                <option>Good</option>
                <option>New</option>
                <option>Fair</option>
                <option>Poor</option>
              </select>
            </label>

            {/* Media */}
            <label>
              Cover Image:
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCoverImageChange}
                accept="image/*"
                name="coverImage"
                className="border rounded p-2 w-full"
              />
              {bookData.coverImage && <p>{bookData.coverImage.name}</p>}
            </label>

            <label>
              Preview Link:
              <input
                name="previewLink"
                value={bookData.previewLink}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </label>

            {/* Keywords */}
            <label>
              Keywords:
              <input
                name="keywords"
                value={bookData.keywords.join(", ")}
                onChange={(e) =>
                  setBookData({
                    ...bookData,
                    keywords: e.target.value.split(",").map((k) => k.trim()),
                  })
                }
                placeholder="Comma separated"
                className="border rounded p-2 w-full"
              />
            </label>

            {/* Audience */}
            <label>
              Audience:
              <select
                name="audience"
                value={bookData.audience}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              >
                <option value="">Select Audience</option>
                <option>General</option>
                <option>Kids</option>
                <option>Teens</option>
                <option>Adults</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting 
                ? (mode === "edit" ? "Updating..." : "Adding...") 
                : (mode === "edit" ? "Update Book" : "Add Book")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}