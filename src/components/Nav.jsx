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
      <nav className="hidden md:flex gap-9 items-center w-4/5 justify-end">
        <Link to="/browse">Browse</Link>

        {role === "admin" && (
          <>
            <Link to="/browse">BookReview</Link>
            <Link to="/admin-dashboard">Admin dashboard</Link>
          </>
        )}

        {role === "user" && <Link to="/my-books">My Books</Link>}

        {!user && <Link to="/signup">Signup</Link>}

        {user ? (
          <button onClick={handleLogout} className="btn block py-1 mt-1 w-1/5 bg-gray-200 rounded ">
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn block py-1 mt-1 bg-gray-200 rounded">
            Log in
          </Link>
        )}
      </nav>
      <div className="md:hidden">
        <details>
          <summary className="cursor-pointer px-3 py-2 bg-gray-200 rounded">Menu</summary>
          <div className="">
            <Link to="/browse" className="block py-1">Browse</Link>
            {role === "admin" && <Link to="/bookreview" className="block py-1">BookReview</Link>&&
            role === "admin" && <Link to="/admin-dashboard" className="block py-1">Admin dasboard</Link>
            
            }
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
