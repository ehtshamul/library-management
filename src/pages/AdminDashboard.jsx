import React, { useState, useEffect } from "react";
import AddBookForm from "./Addbook";
import { Dashboard, getAllBooks, getLatestBook } from "../server/auth";
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../server/AuthContext.jsx";

const AdminDashboard = () => {
  const [showAddbook, setShowAddbook] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [books, setBooks] = useState([]);
  const [latestBook, setLatestBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role.toLowerCase() !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const toggleAddBook = () => {
    setShowAddbook(!showAddbook);
  };

  const handleEdit = (bookId) => {
    navigate(`/book/${bookId}/edit`);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch admin data
        const dashboardResponse = await Dashboard();
        setAdminData(dashboardResponse.data.user);

        // Fetch all books
        const booksResponse = await getAllBooks();
        setBooks(booksResponse.data.books || booksResponse.data);

        // Fetch latest book
        const latestResponse = await getLatestBook();
        setLatestBook(latestResponse.data.book || latestResponse.data);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role.toLowerCase() === "admin") {
      fetchDashboardData();
    }
  }, [user, logout]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 overflow-x-hidden">
      {/* Navigation Bar */}
      <Nav />
      
      <div className="layout-container flex h-full grow flex-col">
        {/* Welcome Section */}
        <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#0d141c] tracking-light text-[32px] font-bold leading-tight min-w-72">
                {adminData && <span>Welcome back {adminData.name}</span>}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start">
                <button 
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0d80f2] text-slate-50 text-sm font-bold" 
                  onClick={toggleAddBook}
                >
                  <span className="truncate">{showAddbook ? "Cancel" : "Add Book"}</span>
                </button>
                {showAddbook && (
                  <div className="w-full mt-4">
                    <AddBookForm onSuccess={() => {
                      setShowAddbook(false);
                      // Refresh books list
                      getAllBooks().then(response => {
                        setBooks(response.data.books || response.data);
                      });
                    }} />
                  </div>
                )}
              </div>
            </div>

            {/* Overview Section */}
            <h2 className="text-[#0d141c] text-[22px] font-bold px-4 pb-3 pt-5">Overview</h2>
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

            {/* Recently Added Books */}
            <h2 className="text-[22px] font-bold px-4 pb-3 pt-5">Recently Added Books</h2>
            
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
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/200x300?text=No+Image";
                        }}
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
              <p className="text-center text-gray-500 py-10">No books available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;