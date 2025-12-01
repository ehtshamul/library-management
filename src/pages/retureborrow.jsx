import React, { useState, useEffect } from "react";
import { BookOpen, Calendar, User, RotateCcw, History } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getUserBorrows, returnBorrow } from "../store/Borrow";

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningBookId, setReturningBookId] = useState(null);

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.id); // ✅ safe access

  // Fetch user's borrowed + returned books
  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        setLoading(true);

        // 🔹 API: GET /api/auth/user-borrows/:userId
        const response = await dispatch(getUserBorrows(userId));

        if (response.meta.requestStatus === "fulfilled") {
          const allBooks = response.payload || [];

          // Split into active and returned lists
          setBorrowedBooks(allBooks.filter((b) => b.status === "borrowed"));
          setReturnedBooks(allBooks.filter((b) => b.status === "returned"));
        }
      } catch (error) {
        console.error("Error fetching borrowed books:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchBorrowedBooks();
  }, [dispatch, userId]);
  console.log(borrowedBooks);

  // Handle book return
  const handleReturnBook = async (borrowId) => {
    try {
      setReturningBookId(borrowId);

      // 🔹 API: PUT /api/auth/return/:borrowId  (body: { userId })
      // Capture the returned book from current state before updating
      const returnedBook = borrowedBooks.find((b) => b.borrowId === borrowId);

      await dispatch(returnBorrow({ borrowId, userId }));

      // Move book from active list to returned list
      setBorrowedBooks((prev) => prev.filter((b) => b.borrowId !== borrowId));

      if (returnedBook) {
        setReturnedBooks((prev) => [
          ...prev,
          { ...returnedBook, status: "returned", returnDate: new Date().toISOString() },
        ]);
      }
    } catch (error) {
      console.error("Error returning book:", error);
    } finally {
      setReturningBookId(null);
    }
  };

  // Helpers
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const d = new Date(dueDate);
    if (Number.isNaN(d.getTime())) return false;
    return d < new Date();
  };

  // Loading screen
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading your books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Section 1: Currently Borrowed */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            My Borrowed Books
          </h2>
          <p className="text-gray-600 mt-1">
            {borrowedBooks.length}{" "}
            {borrowedBooks.length === 1 ? "book" : "books"} currently borrowed
          </p>
        </div>

        {borrowedBooks.length === 0 ? (
          <div className="p-6 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No borrowed books
            </h3>
            <p className="text-gray-600">
              You haven't borrowed any books yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {borrowedBooks.map((b) => (
              <div
                key={b.borrowId}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {b.book?.title ?? "Unknown title"}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <User className="h-4 w-4 mr-1" /> {b.book?.author ?? "Unknown author"}
                    </p>
                    <p className="text-sm text-gray-500">ISBN: {b.book?.isbn ?? "N/A"}</p>

                    <div className="flex space-x-4 mt-3 text-sm">
                      <span className="text-gray-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" /> Borrowed:{" "}
                        {b.borrowdate ? formatDate(b.borrowdate) : "N/A"}
                      </span>
                      <span
                        className={`flex items-center ${isOverdue(b.dueDate)
                            ? "text-red-600"
                            : "text-gray-600"
                          }`}
                      >
                        <Calendar className="h-4 w-4 mr-1" /> Due:{" "}
                        {formatDate(b.dueDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 ml-6">
                    <button
                      onClick={() => handleReturnBook(b.borrowId)}
                      disabled={returningBookId === b.borrowId}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      {returningBookId === b.borrowId ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Returning...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Return
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {isOverdue(b.dueDate) && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                    ⚠️ This book is overdue. Please return it as soon as
                    possible.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Returned Books */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center">
          <History className="h-6 w-6 text-gray-600 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Returned Books (History)
          </h2>
        </div>

        {returnedBooks.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            No returned books yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {returnedBooks.map((b) => (
              <div key={b.borrowId} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {b.book?.title ?? "Unknown title"}
                </h3>
                <p className="text-sm text-gray-600">Author: {b.book?.author ?? "Unknown author"}</p>
                <p className="text-sm text-gray-500">
                  Returned on: {formatDate(b.returnDate)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowedBooks;
