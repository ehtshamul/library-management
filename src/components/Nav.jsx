// Nav.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";


export default function Nav() {
  const { user, logout } = useAuth();
 


  const handleLogout = () => {
    logout();
  };

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-solid border-b-[#e7edf4] px-4 md:px-6 lg:px-10 xl:px-12 py-3">
          {/* Brand */}
          <div className="flex items-center gap-2 md:gap-3 lg:gap-4 text-[#0d141c]">
            <h2 className="text-base md:text-lg lg:text-xl font-bold">
              BookReview
            </h2>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex flex-1 justify-end gap-6 lg:gap-8 xl:gap-10">
            <nav className="flex items-center gap-6 lg:gap-9 xl:gap-12">
              <Link className="text-sm lg:text-base font-medium" to="/browse">
                Browse
              </Link>

              {/* Role-based links */}
              {user && user.role?.toLowerCase() === "admin" && (
                <>
               
                  <Link
                    className="text-sm lg:text-base font-medium"
                    to="/bookreview"
                  >
                    Bookreview
                  </Link>
                  
                </>
              )}

             

              {user && user.role?.toLowerCase() === "user" && (
                <Link
                  className="text-sm lg:text-base font-medium"
                  to="/my-books"
                >
                  My Books
                </Link>
              )}

              {!user && (
                <Link
                  className="text-sm lg:text-base font-medium"
                  to="/signup"
                >
                  Signup
                </Link>
              )}
            </nav>

            {/* Auth button */}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-[#e7edf4] text-sm lg:text-base font-bold"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-[#e7edf4] text-sm lg:text-base font-bold"
              >
                Log in
              </Link>
            )}
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <details className="relative">
              <summary className="list-none cursor-pointer rounded-lg h-10 px-3 flex items-center gap-2 bg-[#e7edf4] text-sm font-semibold select-none">
                Menu
              </summary>
              <div className="absolute right-0 w-48 rounded-xl border border-slate-200 bg-white shadow-lg p-2 z-50">
                <Link
                  className="block px-3 py-2 text-sm hover:bg-slate-50 rounded-lg"
                  to="/browse"
                >
                  Browse
                </Link>

                {user && user.role?.toLowerCase() === "admin" && (
                  <>
                    <Link
                      className="block px-3 py-2 text-sm hover:bg-slate-50 rounded-lg"
                      to="/bookreview"
                    >
                      BookReview
                    </Link>
                  
                  </>
                )}

               

                {user && user.role?.toLowerCase() === "user" && (
                  <Link
                    className="block px-3 py-2 text-sm hover:bg-slate-50 rounded-lg"
                    to="/my-books"
                  >
                    My Books
                  </Link>
                )}

                {!user && (
                  <Link
                    className="block px-3 py-2 text-sm hover:bg-slate-50 rounded-lg"
                    to="/signup"
                  >
                    Signup
                  </Link>
                )}

                {/* Auth button */}
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="mt-2 block w-full h-9 rounded-lg bg-[#e7edf4] text-center leading-9 text-sm font-bold"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="mt-2 block w-full h-9 rounded-lg bg-[#e7edf4] text-center leading-9 text-sm font-bold"
                  >
                    Log in
                  </Link>
                )}
              </div>
            </details>
          </div>
        </header>
      </div>
    </div>
  );
}
