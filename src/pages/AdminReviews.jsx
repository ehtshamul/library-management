import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooks, deleteBook } from "../store/booksSlice";
import { useNavigate } from "react-router-dom";

export default function AdminReviews() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = (user?.role || "").toLowerCase() === "admin";
  const books = useSelector((state) => state.books.books);

  const [selectedBook, setSelectedBook] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
 const makeSlug = (title) =>
  title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

const handleView = (book) => {
  const slug = makeSlug(book.title);
  
  navigate(`/book/${slug}/bookdetails`, { state: { id: book._id } });
};


  useEffect(() => {
    if (isAdmin) dispatch(getAllBooks());
  }, [dispatch, isAdmin]);

  const handleEdit = (bookId) => navigate(`/book/${bookId}/edit`);
  const handleDelete = (book) => { setSelectedBook(book); setShowConfirm(true); };
  const confirmDelete = async () => {
    if (!selectedBook?._id) return;
    await dispatch(deleteBook(selectedBook._id)).unwrap();
    setShowConfirm(false);
    setSelectedBook(null);
  };

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">You are not authorized to view this page.</div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Reviews</h1>
          <button
            onClick={() => navigate("/book/create")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Add Book
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3">Cover</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">ISBN</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="border-t">
                  <td className="px-4 py-2">
                    <img
                      src={`http://localhost:7000/${book.coverImage}`}
                      alt={book.title}
                      className="h-16 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2">{book.title}</td>
                  <td className="px-4 py-2">{book.author}</td>
                  <td className="px-4 py-2">{book.isbn}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button onClick={() => handleEdit(book._id)} className="px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
                    <button onClick={() => handleDelete(book)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                    <button onClick={() => handleView(book)} className="px-3 py-1 bg-green-500 hover:bg-green-700 text-white rounded">view</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-2">Confirm Delete</h2>
              <p className="text-slate-600 mb-4">
                Are you sure you want to delete {" "}
                <span className="font-semibold">{selectedBook?.title}</span>?
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-800">Cancel</button>
                <button onClick={confirmDelete} className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}