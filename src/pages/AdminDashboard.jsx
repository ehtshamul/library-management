import React, { useState, useEffect, useRef } from "react";
import AddBookForm from "./Addbook";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../store/authSlice";
import { getAllBooks } from "../store/booksSlice";
import BorrowTrend from "../chart/borrowtre";



import { fetchLatestBooks } from "../store/booksSlice";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AdminDashboard = () => {
  const [showAddbook, setShowAddbook] = useState(false);
  const [books, setBooks] = useState([]);
  const [allbook, setAllbook] = useState([]);

  
   
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const didFetchRef = useRef(false);

  // ✅ Use Redux state directly
  const { user, accessToken } = useSelector((state) => state.auth);
 


  const toggleAddBook = () => {
    setShowAddbook((prev) => !prev);
  };

  const handleEdit = (bookId) => {
    navigate(`/book/${bookId}/edit`);
    console.log(`/admin/book/${bookId}/edit`);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!accessToken) {
          navigate("/login");
          toast.error("Please log in to access the admin dashboard.");

          return;
        }

        // 1. Fetch fresh user/admin data
        const dashboardResult = await dispatch(fetchDashboard());
        if (!dashboardResult.payload?.user && !user) {
          // If both Redux & API have no user → logout
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          toast.error("Session expired. Please log in again.");
          navigate("/login");
          return;
        }

        // 2. Fetch all books
        const booksResult = await dispatch(fetchLatestBooks());
        if (booksResult.payload) {
          setBooks(booksResult.payload);

        }
        const allBooksResult = await dispatch(getAllBooks());
        if (allBooksResult.payload) {
          setAllbook(allBooksResult.payload);

        }
        // You can add more data fetching here if needed 3
      
       
        

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data. Please try again.");
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          toast.error("Unauthorized access. Please log in again.");
          navigate("/login");
        }
      }
    };

    // Prevent multiple runs when `accessToken` or `user` changes
    if (!didFetchRef.current) {
      didFetchRef.current = true;
      fetchDashboardData();
       
    }
  }, [dispatch, navigate, accessToken, user]);
   console.log("This is books show:", books);


  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-slate-50 overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
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
            
           
              <div className="flex flex-1 flex-col gap-2 rounded-lg p-6 border border-[#cedbe8]">
                <p className="text-base font-medium">Total Books</p>
                <p className="text-2xl font-bold">{allbook.length}</p>
              </div>
             
            
            

            {/* Trends Section */}
            <BorrowTrend />

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
                      <p className="text-sm text-gray-600 mb-3">by {book.author}</p>

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
