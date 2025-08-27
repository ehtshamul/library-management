import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import * as api from "../server/auth";

export default function BookDetail() {
  const [book, setBook] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const { slug } = useParams();
  const location = useLocation();
  const { id } = location.state || {}; // navigate سے ملا ہوا id

  const formattedDate = book?.pubDate
    ? new Date(book.pubDate).toISOString().split("T")[0]
    : "";

  useEffect(() => {
    async function fetchBook() {
      try {
        if (!id) return;
        const response = await api.getBookById(id);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    }
    fetchBook();
  }, [id, slug]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setProgress(0);

      const response = await axios.get(book.previewLink, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          }
        },
      });

      // Create Blob download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${book.title || "file"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
    } finally {
      setDownloading(false);
    }
  };

  if (!book) {
    return <p className="text-center mt-10">Loading book details...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-gray-50 border-b p-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {book.title}
          </h1>
          <p className="text-gray-600 mt-2 text-lg">by {book.author}</p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-3 gap-10 p-8">
          {/* Left: Cover */}
          <div className="col-span-1 flex flex-col items-center space-y-5">
            <img
              src={
                book.coverImage
                  ? `http://localhost:7000/${book.coverImage}`
                  : "https://via.placeholder.com/200x300"
              }
              alt={book.title}
              className="rounded-xl shadow-lg border-2 border-gray-200"
            />

            {!book.previewLink && (
              <div className="w-full">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition disabled:opacity-50 w-full"
                >
                  {downloading ? "Downloading..." : "Download PDF"}
                </button>

                {/* Progress Bar */}
                {downloading && (
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="col-span-2 space-y-8">
            <p className="text-gray-700 text-base leading-relaxed">
              {book.description}
            </p>

            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm text-gray-800">
              <p>
                <span className="font-semibold">Publisher:</span>{" "}
                {book.publisher}
              </p>
              <p>
                <span className="font-semibold">Edition:</span> {book.edition}
              </p>
              <p>
                <span className="font-semibold">Published:</span>{" "}
                {formattedDate}
              </p>
              <p>
                <span className="font-semibold">Pages:</span> {book.pages}
              </p>
              <p>
                <span className="font-semibold">Language:</span>{" "}
                {book.language}
              </p>
              <p>
                <span className="font-semibold">Genre:</span> {book.genre}
              </p>
              <p>
                <span className="font-semibold">Dewey:</span> {book.dewey}
              </p>
              <p>
                <span className="font-semibold">Shelf:</span> {book.shelf}
              </p>
              <p>
                <span className="font-semibold">Copies:</span> {book.copies}
              </p>
              <p>
                <span className="font-semibold">Condition:</span>{" "}
                {book.condition}
              </p>
              <p>
                <span className="font-semibold">Audience:</span>{" "}
                {book.audience}
              </p>
              <p>
                <span className="font-semibold">ISBN:</span> {book.isbn}
              </p>
            </div>

            {/* Categories, Tags, Keywords */}
            <div className="space-y-3">
              <div>
                <span className="font-semibold">Categories: </span>
                {book.categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="ml-2 inline-block px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-700"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <div>
                <span className="font-semibold">Tags: </span>
                {book.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="ml-2 inline-block px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div>
                <span className="font-semibold">Keywords: </span>
                {book.keywords.map((key, idx) => (
                  <span
                    key={idx}
                    className="ml-2 inline-block px-3 py-1 text-xs rounded-full border border-gray-400 text-gray-700"
                  >
                    {key}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
