import React, { useState, useEffect } from "react";
import AddBookForm from "./Addbook";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../store/authSlice";
import { getAllBooks } from "../store/booksSlice";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [showAddbook, setShowAddbook] = useState(false);
  const [books, setBooks] = useState([]);
  

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Use Redux state directly
  const { user, accessToken } = useSelector((state) => state.auth);

  const toggleAddBook = () => {
    setShowAddbook((prev) => !prev);
  };

  const handleEdit = (bookId) => {
    navigate(`/book/${bookId}/edit`);
    console.log(`/book/${bookId}/edit`);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!accessToken) {
          navigate("/login");
          return;
        }

        // 1. Fetch fresh user/admin data
        const dashboardResult = await dispatch(fetchDashboard());
        if (!dashboardResult.payload?.user && !user) {
          // If both Redux & API have no user → logout
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        // 2. Fetch all books
        const booksResult = await dispatch(getAllBooks());
        if (booksResult.payload) {
          setBooks(booksResult.payload);
        }
       
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
    };

    fetchDashboardData();
  }, [dispatch, navigate, accessToken, user]);

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-slate-50 overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Welcome Section */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#0d141c] tracking-light text-[32px] font-bold leading-tight min-w-72">
                {user ? (
                  <>Welcome back {user.name}</>
                ) : (
                  "Welcome Admin"
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start">
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0d80f2] text-slate-50 text-sm font-bold"
                  onClick={toggleAddBook}
                >
                  <span className="truncate">Add Book</span>
                </button>
                {showAddbook && (
                  <div className="w-full">
                    <AddBookForm />
                  </div>
                )}
              </div>
            </div>

            {/* Overview Section */}
            <h2 className="text-[#0d141c] text-[22px] font-bold px-4 pb-3 pt-5">
              Overview
            </h2>
            <div className="flex flex-wrap gap-4 p-4">
              <div className="flex flex-1 flex-col gap-2 rounded-lg p-6 border border-[#cedbe8]">
                <p className="text-base font-medium">Total Users</p>
                <p className="text-2xl font-bold">1,250</p>
              </div>
              <div className="flex flex-1 flex-col gap-2 rounded-lg p-6 border border-[#cedbe8]">
                <p className="text-base font-medium">Total Books</p>
                <p className="text-2xl font-bold">{books.length}</p>
              </div>
              <div className="flex flex-1 flex-col gap-2 rounded-lg p-6 border border-[#cedbe8]">
                <p className="text-base font-medium">Borrowed Books</p>
                <p className="text-2xl font-bold">750</p>
              </div>
              <div className="flex flex-1 flex-col gap-2 rounded-lg p-6 border border-[#cedbe8]">
                <p className="text-base font-medium">Pending Returns</p>
                <p className="text-2xl font-bold">120</p>
              </div>
            </div>

            {/* Trends Section */}
            <h2 className="text-[22px] font-bold px-4 pb-3 pt-5">Trends</h2>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              {/* Borrowing Trends Chart */}
              <div className="flex flex-1 flex-col gap-2 rounded-lg border border-[#cedbe8] p-6 min-w-72">
                <p className="text-base font-medium">Borrowing Trends</p>
                <p className="text-[32px] font-bold truncate">+15%</p>
                <div className="flex gap-1">
                  <p className="text-[#49739c] text-base">Last 30 Days</p>
                  <p className="text-[#078838] text-base font-medium">+15%</p>
                </div>
                <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                  <svg width="100%" height="148" viewBox="0 0 478 150">
                    <rect width="100%" height="100%" fill="#e7edf4" />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      fill="#49739c"
                      dy=".3em"
                    >
                      Chart Here
                    </text>
                  </svg>
                </div>
              </div>

              {/* Book Categories Chart */}
              <div className="flex flex-1 flex-col gap-2 rounded-lg border border-[#cedbe8] p-6 min-w-72">
                <p className="text-base font-medium">Book Categories</p>
                <p className="text-[32px] font-bold truncate">30%</p>
                <div className="flex gap-1">
                  <p className="text-[#49739c] text-base">This Year</p>
                  <p className="text-[#078838] text-base font-medium">+5%</p>
                </div>
                <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                  <div
                    className="border-t-2 border-[#49739c] bg-[#e7edf4] w-full"
                    style={{ height: "90%" }}
                  ></div>
                  <p className="text-[13px] font-bold text-[#49739c]">
                    Fiction
                  </p>
                  <div
                    className="border-t-2 border-[#49739c] bg-[#e7edf4] w-full"
                    style={{ height: "40%" }}
                  ></div>
                  <p className="text-[13px] font-bold text-[#49739c]">
                    Non-Fiction
                  </p>
                </div>
              </div>
            </div>

            {/* Latest Activity */}
            <h2 className="text-[22px] font-bold px-4 pb-3 pt-5">
              Latest Activity
            </h2>
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-lg border border-[#cedbe8] bg-slate-50">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Book
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Review
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[#cedbe8]">
                      <td className="px-4 py-2">Emily Carter</td>
                      <td className="px-4 py-2">The Secret Garden</td>
                      <td className="px-4 py-2 text-[#49739c]">
                        A timeless classic!
                      </td>
                      <td className="px-4 py-2">
                        <button className="rounded-lg h-8 px-4 bg-[#e7edf4] text-sm font-medium w-full">
                          5 stars
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recently Added Books */}
            <h2 className="text-[22px] font-bold px-4 pb-3 pt-5">
              Recently Added Books
            </h2>

            {books && books.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {books.map((book) => (
                  <div
                    key={book._id}
                    className="flex flex-col gap-4 bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
                  >
                    {/* Book Cover */}
                    <div className="w-full bg-center bg-cover aspect-[3/4] rounded-lg overflow-hidden">
                      <img
                        src={`http://localhost:7000/${book.coverImage}`}
                        alt={book.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Book Details */}
                    <div className="flex flex-col flex-grow">
                      <p className="text-lg font-semibold">{book.title}</p>
                      <p className="text-sm text-gray-600 mb-3">
                        by {book.author}
                      </p>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(book._id)}
                        className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No books available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
