import React, { useState, useRef } from "react";
import { set } from "react-hook-form";

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

  const removeTag = (tagToRemove) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

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

export default function AddBookForm() {
  const [bookData, setBookData] = useState({
    title: '',
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
    copies: "",
    shelf: "",
    condition: "",
    coverImage: null,
    previewLink: "",
    keywords: "",
    audience: ""   
  });

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, multiple, options } = e.target;

    if (multiple) {
      const selected = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setBookData({ ...bookData, [name]: selected });
    } else if (type === "checkbox") {
      setBookData({ ...bookData, [name]: e.target.checked });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Book data submitted:", bookData);
    // Add form submission logic here

    // api call 
    

    // Reset form after submission
    setBookData({
      title: '',
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
    copies: "",
    shelf: "",
    condition: "",
    coverImage: null,
    previewLink: "",
    keywords: "",
    audience: ""  
    });

  };


  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add New Book</h1>
            <p className="text-sm text-slate-600 mt-1">Provide details to add a book to your library. Fields are grouped for clarity.</p>
          </div>

          {/* Content */}
          <div className="px-8 py-8 grid gap-10">
            {/* Basic Details */}
            <section>
              <h2 className="text-base font-semibold text-slate-900 mb-4">Basic Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">Book Title</span>
                  <input id="title" name="title" onChange={handleChange} value={bookData.title} placeholder="Enter book title" className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3 text-slate-900" />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">Author</span>
                  <input id="author" name="author" placeholder="Enter author name" className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3 text-slate-900" onChange={handleChange} value={bookData.author} />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">Co-Authors (optional)</span>
                  <input id="coAuthors" name="coAuthors" placeholder="e.g., Jane Doe; John Smith" className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3 text-slate-900" onChange={handleChange} value={bookData.coAuthors} />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">Publisher</span>
                  <input id="publisher" name="publisher" placeholder="Enter publisher" className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3 text-slate-900" value={bookData.publisher} onChange={handleChange} />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">Publication Date</span>
                  <input
                    onChange={handleChange}
                    value={bookData.pubDate}
                    id="pubDate"
                    name="pubDate"
                    placeholder="YYYY-MM-DD"
                    type="date"
                    className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3 text-slate-900"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">Edition (optional)</span>
                  <input id="edition" name="edition" onChange={handleChange} value={bookData.edition} placeholder="e.g., 2nd Edition" className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3 text-slate-900" />
                </label>

                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Description</span>
                  <textarea id="description" name="description" onChange={handleChange} value={bookData.description} placeholder="Short description or abstract" className="min-h-[100px] rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900" />
                </label>
              </div>
            </section>

            {/* Cataloging */}
            <section>
              <h2 className="text-base font-semibold text-slate-900 mb-4">Cataloging</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">ISBN</span>
                  <input id="isbn" name="isbn" onChange={handleChange} value={bookData.isbn} placeholder="e.g., 978-3-16-148410-0" className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3" />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">Language</span>
                  <select id="language" name="language" onChange={handleChange} value={bookData.language} className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3">
                    <option value="">Select language</option>
                    <option>English</option>
                    <option>Urdu</option>
                    <option>Arabic</option>
                    <option>Chinese</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Spanish</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">Genre</span>
                  <select id="genre" name="genre" value={bookData.genre} onChange={handleChange} className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3">
                    <option value="">Select genre</option>
                    <option>Fiction</option>
                    <option>Non-Fiction</option>
                    <option>Science</option>
                    <option>Technology</option>
                    <option>History</option>
                    <option>Biography</option>
                    <option>Children</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">Categories</span>
                  <select id="categories" onChange={handleChange} value={bookData.categories} name="categories" multiple className="min-h-28 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2">
                    <option>Computer Science</option>
                    <option>Programming</option>
                    <option>Self Help</option>
                    <option>Business</option>
                    <option>Design</option>
                    <option>Education</option>
                    <option>Health</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Tags</span>
                  <TagInput tags={bookData.tags} onTagsChange={handleTagsChange} />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">Dewey Decimal (optional)</span>
                  <input id="dewey"  onChange={handleChange} value={bookData.dewey} name="dewey" placeholder="e.g., 005.133" className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3" />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">Pages</span>
                  <input id="pages" name="pages" onChange={handleChange} value={bookData.pages} placeholder="e.g., 320" className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3" />
                </label>
              </div>
            </section>

            {/* Inventory */}
            <section>
              <h2 className="text-base font-semibold text-slate-900 mb-4">Inventory</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">Number of Copies</span>
                  <input id="copies" name="copies" onChange={handleChange} value={bookData.copies} placeholder="e.g., 5" className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3" />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">Shelf / Location</span>
                  <input id="shelf" name="shelf" onChange={handleChange} value={bookData.shelf} placeholder="e.g., Aisle 3 · Shelf B" className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3" />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">Condition</span>
                  <select id="condition" name="condition" onChange={handleChange} value={bookData.condition} className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3">
                    <option value="">Select condition</option>
                    <option>New</option>
                    <option>Good</option>
                    <option>Fair</option>
                    <option>Poor</option>
                  </select>
                </label>
              </div>
            </section>

            {/* Media */}
            <section>
              <h2 className="text-base font-semibold text-slate-900 mb-4">Media</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <p className="text-sm font-semibold text-slate-800">Upload Book Cover</p>
                    <p className="text-xs text-slate-600">Drag & drop or click to upload</p>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleCoverImageChange}
                      className="hidden"
                      accept="image/*"
                      id="coverImage"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="mt-4 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Choose File
                    </button>
                    
                    {bookData.coverImage && (
                      <div className="mt-4 text-sm text-slate-700">
                        Selected: {bookData.coverImage.name}
                      </div>
                    )}
                  </div>
                </div>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">External Preview Link (optional)</span>
                  <input id="previewLink" name="previewLink" onChange={handleChange} value={bookData.previewLink} placeholder="e.g., Google Books or sample PDF URL" className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3" />
                </label>
              </div>
            </section>

            {/* SEO / Discoverability */}
            <section>
              <h2 className="text-base font-semibold text-slate-900 mb-4">Discoverability</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">Search Keywords (optional)</span>
                  <input id="keywords" name="keywords" onChange={handleChange} value={bookData.keywords} placeholder="e.g., js, react, beginner" className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3" />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">Audience</span>
                  <select id="audience" name="audience" onChange={handleChange} value={bookData.audience} className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3">
                    <option value="">Select audience</option>
                    <option>General</option>
                    <option>Kids</option>
                    <option>Teens</option>
                    <option>Adults</option>
                    <option>Academic</option>
                  </select>
                </label>
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button type="button" className="h-11 px-5 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold hover:bg-slate-100">Save as Draft</button>
              <button type="submit" className="h-11 px-5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">Add Book</button>
            </div>
          </div>
        </form>

        <p className="text-center text-xs text-slate-500 mt-3">Form wired with React state · TailwindCSS classes included.</p>
      </div>
    </div>
  );
}