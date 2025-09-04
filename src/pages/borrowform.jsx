import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast ,ToastContainer } from "react-toastify";
import { createBorrow } from "../store/Borrow"; // ✅ use correct thunk

const BookCard = ({ book }) => {
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
 

  const userId = auth.user?.id; // ✅ make sure backend expects "_id"


  const handleBorrow = async () => {
    if (!dueDate) {
      toast.error("Please select a due date");
      return;
    }

    // ✅ due date validation
    const today = new Date();
    const diffTime = new Date(dueDate) - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 14) {
      toast.error("Due date cannot exceed 14 days");
      return;
    }

    try {
      setLoading(true);

      // ✅ dispatch thunk
     const res = await dispatch(

 createBorrow({ userId: userId, bookId: book?._id, duedate: dueDate })
).unwrap();

      toast.success(res.message || "Book borrowed successfully");
    } catch (err) {
      toast.error(err?.message || "Failed to borrow book");
    } finally {
      setLoading(false);
      book.copies -=1;
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md p-6 border border-gray-200">
 
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {book?.title || "Sample Book Title"}
      </h3>
      <p className="text-gray-600 mb-4">
        Copies: <span className="font-semibold">{book?.copies ?? 5}</span>
      </p>

      <div className="mb-4">
        <ToastContainer position="top-right" />
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Due Date:
        </label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        onClick={handleBorrow}
        disabled={loading || (book?.copies ?? 5) < 1}
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
          loading || (book?.copies ?? 5) < 1
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
        }`}
      >
        {loading ? "Borrowing..." : "Borrow"}
      </button>
    </div>
  );
};

export default BookCard;
