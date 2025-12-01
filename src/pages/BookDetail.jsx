import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import * as api from "../server/auth";
import BookReviewForm from "./review";
import ReviewsDisplay from "./showreview";
import {
  Calendar,
  BookOpen,
  Users,
  Tag,
  Download,
  Globe,
  Hash,
} from "lucide-react";
import BookCard from "./borrowform";


export default function BookDetail() {
  const [book, setBook] = useState(null);
  const [progress, setProgress] = useState(0);
  const [suggects ,setSuggect]= useState('false')

  const [showBookCard, setShowBookCard] = useState(false);

  const { slug } = useParams();
  const location = useLocation();
  const { id } = location.state || {}; // navigate سے ملا ہوا id
  const handleSug = () => {
  setSuggest((prev) => !prev);
};

  const formattedDate = book?.pubDate
    ? new Date(book.pubDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
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
  const toggleBookCard = () => {
    setShowBookCard((prev) => !prev); // flips true/false
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-lg shadow-lg p-6 border">
                  <img
                    src={
                      book.coverImage
                        ? `http://localhost:7000/${book.coverImage}`
                        : "https://via.placeholder.com/400x600?text=No+Cover"
                    }
                    alt={book.title}
                    className="w-full rounded-md shadow-md"
                  />

                  
                </div>
              </div>
            </div>


            

            {/* Book Details */}
            <div className="lg:col-span-3 space-y-8">
              <div>  <button onClick={toggleBookCard} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
              {showBookCard ? " Borrow now" : "Borrow Form"}
            </button> </div>
            {showBookCard && <BookCard book={book} />}
              {/* Title and Author */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
                  {book.title}
                </h1>
                <p className="text-xl text-gray-600 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  by {book.author}
                </p>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  About this book
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Book Information */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Book Information
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Publisher
                        </p>
                        <p className="text-sm text-gray-600">
                          {book.publisher}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Published
                        </p>
                        <p className="text-sm text-gray-600">
                          {formattedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Pages
                        </p>
                        <p className="text-sm text-gray-600">{book.pages}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Language
                        </p>
                        <p className="text-sm text-gray-600">{book.language}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Edition
                      </p>
                      <p className="text-sm text-gray-600">{book.edition}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Genre</p>
                      <p className="text-sm text-gray-600">{book.genre}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dewey</p>
                      <p className="text-sm text-gray-600">{book.dewey}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">ISBN</p>
                      <p className="text-sm text-gray-600 font-mono">
                        {book.isbn}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Shelf Location
                      </p>
                      <p className="text-sm text-gray-600">{book.shelf}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Available Copies
                      </p>
                      <p className="text-sm text-gray-600">{book.copies}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Condition
                      </p>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          book.condition === "New"
                            ? "bg-green-100 text-green-800"
                            : book.condition === "Good"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {book.condition}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Target Audience
                      </p>
                      <p className="text-sm text-gray-600">{book.audience}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Classification */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Classification
                </h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">
                        Categories
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {book.categories?.map((cat, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full border border-blue-200"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">
                        Tags
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {book.tags?.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded-full border border-green-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">
                        Keywords
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {book.keywords?.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full border border-gray-300"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Add Review</h3>
          <BookReviewForm BookID={book._id} />
        </div>
      
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        
    
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <ReviewsDisplay BookID={book._id} />
        </div>
      </div>
    </div>
    </div>
  );
}