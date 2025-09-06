import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchBooks } from "../store/booksSlice";
import { useNavigate } from "react-router-dom";

export default function BookGrid() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { books: Books } = useSelector((state) => state.books);

  // Convert title into slug
  const makeSlug = (title) =>
    title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  // Navigate to details page
  const handleView = (book) => {
    const slug = makeSlug(book.title);
    navigate(`/book/${slug}/bookdetails`, { state: { id: book._id } });
  };

  useEffect(() => {
    dispatch(searchBooks());
  }, [dispatch]);

  // Search filter
  const filteredBooks = Books.filter((book) => {
    const titleMatch = book.title.toLowerCase().includes(search.toLowerCase());
    const authorMatch = book.author?.toLowerCase().includes(search.toLowerCase());
    const keywordsMatch = book.keywords?.some((kw) =>
      kw.toLowerCase().includes(search.toLowerCase())
    );

    return titleMatch || authorMatch || keywordsMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Book Collection</h1>

            {/* Search bar */}
            <div className="w-full max-w-md ml-6">
              <input
                type="text"
                placeholder="Search by title, author, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Book Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleView(book)}
            >
              {/* Cover Image */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={`http://localhost:7000/${book.coverImage}`}
                  alt={book.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Book Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 truncate">{book.author}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No books found
            </h3>
            <p className="text-gray-600">Try searching with a different keyword.</p>
          </div>
        )}
      </div>
    </div>
  );
}
