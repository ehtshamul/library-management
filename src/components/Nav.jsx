// Nav.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/authSlice";
import { toast } from "react-toastify";

export default function Nav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const role = user?.role?.toLowerCase() || "";

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser({ navigate, toast }));
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <h2 className="text-2xl font-bold text-blue-600">BookReview</h2>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link className="hover:text-blue-500 transition" to="/">Browse</Link>

          {role === "admin" && (
            <>
              <Link className="hover:text-blue-500 transition" to="/admin-dashboard">Admin Dashboard</Link>
              <Link className="hover:text-blue-500 transition" to="/admin/reviews">Admin Reviews</Link>
               <Link className="hover:text-blue-500 transition" to="/admin/reviews/books">Admin boooks Review</Link>
            </>
          )}

          {role === "user" && <Link className="hover:text-blue-500 transition" to="/my-books">My Books</Link>}

          {!user && <Link className="hover:text-blue-500 transition" to="/signup">Signup</Link>}

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
              to="/login"
            >
              Log in
            </Link>
          )}
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Menu
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md flex flex-col z-50">
              <Link
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 hover:bg-gray-100"
                to="/"
              >
                Browse
              </Link>

              {role === "admin" && (
                <>
                  <Link
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 hover:bg-gray-100"
                    to="/admin-dashboard"
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 hover:bg-gray-100"
                    to="/admin/reviews"
                  >
                    Admin Reviews
                  </Link>
                </>
              )}

              {role === "user" && (
                <Link
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 hover:bg-gray-100"
                  to="/my-books"
                >
                  My Books
                </Link>
              )}

              {!user && (
                <Link
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 hover:bg-gray-100"
                  to="/signup"
                >
                  Signup
                </Link>
              )}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-2 hover:bg-gray-100 w-full"
                >
                  Logout
                </button>
              ) : (
                <Link
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 hover:bg-gray-100"
                  to="/login"
                >
                  Log in
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
