// Nav.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/authSlice";
import { toast } from "react-toastify";

export default function Nav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const role = user?.role?.toLowerCase() || "";

  const handleLogout = () => {
    dispatch(logoutUser({ navigate, toast }));
  };

  return (
    <header className="flex items-center justify-between border-b px-4 py-3 bg-white pr-9">
      <h2 className="text-xl font-bold">BookReview</h2>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-6">
        <Link to="/browse">Browse</Link>

        {role === "admin" && <Link to="/bookreview">BookReview</Link>}
        {role === "user" && <Link to="/my-books">My Books</Link>}

        {!user && <Link to="/signup">Signup</Link>}

        {user ? (
          <button onClick={handleLogout} className="btn">
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn">
            Log in
          </Link>
        )}
      </nav>

      {/* Mobile Nav */}
      <div className="md:hidden">
        <details>
          <summary className="cursor-pointer px-3 py-2 bg-gray-200 rounded">Menu</summary>
          <div className="absolute right-0 w-48 bg-white shadow p-2">
            <Link to="/browse" className="block py-1">Browse</Link>
            {role === "admin" && <Link to="/bookreview" className="block py-1">BookReview</Link>}
            {role === "user" && <Link to="/my-books" className="block py-1">My Books</Link>}
            {!user && <Link to="/signup" className="block py-1">Signup</Link>}
            {user ? (
              <button onClick={handleLogout} className="w-full py-1 mt-1 bg-gray-200 rounded">Logout</button>
            ) : (
              <Link to="/login" className="block py-1 mt-1 bg-gray-200 rounded">Log in</Link>
            )}
          </div>
        </details>
      </div>
    </header>
  );
}
