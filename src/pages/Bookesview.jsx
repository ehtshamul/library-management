import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLatestBooks, deleteBook } from "../store/booksSlice";
import { useNavigate } from "react-router-dom";

// ...existing code...
export default function BookGrid() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Books = useSelector((state) => state.books.books); // use redux store
  const { user } = useSelector((state) => state.auth);
  const isAdmin = (user?.role || "").toLowerCase() === "admin";
  const [selectedBook, setSelectedBook] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEdit = (bookId) => {
    navigate(`/book/${bookId}/edit`); // route: /book/:id/edit
  };

  const handleDelete = (book) => {
    setSelectedBook(book);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedBook?._id) return;
    await dispatch(deleteBook(selectedBook._id)).unwrap();
    setShowConfirm(false);
    setSelectedBook(null);
  };

  useEffect(() => {
    dispatch(fetchLatestBooks());
  }, [dispatch]);

  // ...existing rendering code uses books array...



  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          Book Collection
        </h1>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
          {Books.map((book) => (
            <div
              key={book.id || book._id}
              className="flex flex-col group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-4 max-w-[350px] w-full"
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={`http://localhost:7000/${book.coverImage}`}
                  alt={book.title}
                  className="w-full h-[300px] object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
              </div>

              {/* Content */}
              <div className="mt-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 truncate">
                    {book.author}
                  </p>
                </div>

                {/* Action buttons */}
                {isAdmin && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(book._id)}
                      className="flex-1 px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book)}
                      className="flex-1 px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Confirm Delete Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-2">
                Confirm Delete
              </h2>
              <p className="text-slate-600 mb-4">
                Are you sure you want to delete {" "}
                <span className="font-semibold">{selectedBook?.title}</span>?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
