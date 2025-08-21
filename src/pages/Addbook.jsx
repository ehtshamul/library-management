import React, { useState, useRef, useEffect } from "react";
import { AddBook, updateBook, getBookById } from "../server/auth";
import { useNavigate, useParams } from "react-router-dom";

// Tag input component
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
export default function AddBookForm({ mode = "add", onSuccess }) {
  const { id } = useParams();
  const navigate = useNavigate();

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
        try {
          const response = await getBookById(id);
          const book = response.data;
          
          // Convert comma-separated keywords to array if needed
          const keywordsArray = Array.isArray(book.keywords) 
            ? book.keywords 
            : (book.keywords || "").split(",").map(k => k.trim()).filter(k => k);
            
          setBookData({
            title: book.title || "",
            author: book.author || "",
            coAuthors: book.coAuthors || "",
            publisher: book.publisher || "",
            pubDate: book.pubDate ? book.pubDate.split('T')[0] : "",
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
            coverImage: null,
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
      Object.keys(bookData).forEach(key => {
        if (key !== 'coverImage') {
          if (Array.isArray(bookData[key])) {
            formData.append(key, JSON.stringify(bookData[key]));
          } else {
            formData.append(key, bookData[key]);
          }
        }
      });

      // File
      if (bookData.coverImage) {
        formData.append("coverImage", bookData.coverImage);
      }

      let response;
      if (mode === "edit" && id) {
        response = await updateBook(id, formData);
        setMessage({
          type: "success",
          text: response.data.message || "Book updated successfully!",
        });
        
        // Navigate back after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        response = await AddBook(formData);
        setMessage({
          type: "success",
          text: response.data.message || "Book added successfully!",
        });
        
        // Reset form
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
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error submitting book:", error);
      const errorMsg =
        error.response?.data?.message || 
        `Failed to ${mode === "edit" ? "update" : "add"} book. Please try again.`;
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 p-6">
      <div className="w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          {mode === "edit" ? "Edit Book" : "Add New Book"}
        </h2>

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

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="p-8 grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">Title*</label>
              <input
                name="title"
                value={bookData.title}
                onChange={handleChange}
                required
                className="border rounded-lg p-3 w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Author*</label>
              <input
                name="author"
                value={bookData.author}
                onChange={handleChange}
                required
                className="border rounded-lg p-3 w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Co-Authors</label>
              <input
                name="coAuthors"
                value={bookData.coAuthors}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Publisher</label>
              <input
                name="publisher"
                value={bookData.publisher}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Publication Date</label>
              <input
                type="date"
                name="pubDate"
                value={bookData.pubDate}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Edition</label>
              <input
                name="edition"
                value={bookData.edition}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">Description</label>
              <textarea
                name="description"
                value={bookData.description}
                onChange={handleChange}
                rows={4}
                className="border rounded-lg p-3 w-full"
              />
            </div>

            {/* Catalog Information */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-semibold mb-4">Catalog Information</h3>
            </div>

            <div>
              <label className="block mb-2 font-medium">ISBN*</label>
              <input
                name="isbn"
                value={bookData.isbn}
                onChange={handleChange}
                required
                className="border rounded-lg p-3 w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Language</label>
              <select
                name="language"
                value={bookData.language}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full"
              >
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="Urdu">Urdu</option>
                <option value="Arabic">Arabic</option>
                <option value="Chinese">Chinese</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Genre</label>
              <select
                name="genre"
                value={bookData.genre}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full"
              >
                <option value="">Select Genre</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science">Science</option>
                <option value="Technology">Technology</option>
                <option value="History">History</option>
                <option value="Biography">Biography</option>
                <option value="Children">Children</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Audience</label>
              <select
                name="audience"
                value={bookData.audience}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full"
              >
                <option value="">Select Audience</option>
                <option value="General">General</option>
                <option value="Kids">Kids</option>
                <option value="Teens">Teens</option>
                <option value="Adults">Adults</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">Categories</label>
              <select
                name="categories"
                multiple
                value={bookData.categories}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full h-32"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Programming">Programming</option>
                <option value="Self Help">Self Help</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">Tags</label>
              <TagInput tags={bookData.tags} onTagsChange={handleTagsChange} />
            </div>

            <div>
              <label className="block mb-2 font-medium">Dewey Decimal</label>
              <input
                name="dewey"
                value={bookData.dewey}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Pages</label>
              <input
                name="pages"
                type="number"
                value={bookData.pages}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full"
              />
            </div>

            {/* Inventory Information */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-semibold mb-4">Inventory Information</h3>
            </div>

            <div>
              <label className="block mb-2 font-medium">Copies</label>
              <input
                name="copies"
                type="number"
                value={bookData.copies}
                onChange={handleChange}
                min="1"
                className="border rounded-lg p-3 w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Shelf Location</label>
              <input
                name="shelf"
                value={bookData.shelf}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Condition</label>
              <select
                name="condition"
                value={bookData.condition}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full"
              >
                <option value="Good">Good</option>
                <option value="New">New</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            {/* Media */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-semibold mb-4">Media</h3>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">Cover Image</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCoverImageChange}
                accept="image/*"
                name="coverImage"
                className="border rounded-lg p-3 w-full"
              />
              {bookData.coverImage && (
                <p className="mt-2 text-sm">
                  Selected: {bookData.coverImage.name}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">Preview Link</label>
              <input
                name="previewLink"
                value={bookData.previewLink}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">Keywords</label>
              <input
                name="keywords"
                value={bookData.keywords.join(", ")}
                onChange={(e) =>
                  setBookData({
                    ...bookData,
                    keywords: e.target.value.split(",").map((k) => k.trim()),
                  })
                }
                placeholder="Comma separated keywords"
                className="border rounded-lg p-3 w-full"
              />
            </div>

            <div className="md:col-span-2 mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-6 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting 
                  ? (mode === "edit" ? "Updating..." : "Adding...") 
                  : (mode === "edit" ? "Update Book" : "Add Book")}
              </button>
              
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="h-12 px-6 rounded-xl bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 ml-4"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}