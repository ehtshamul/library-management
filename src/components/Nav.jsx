// Nav.jsx
import React, { useState, useEffect, useRef } from "react";
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
  const menuRef = useRef(null);

  const handleLogout = () => {
    dispatch(logoutUser({ navigate, toast }));
    setMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent scroll on mobile when menu is open
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  // Close menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-2xl border-b border-blue-800/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo with enhanced styling - Responsive */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
              BookReview
            </h2>
          </div>

          {/* Desktop Nav - Hidden on mobile/tablet */}
          <nav className="hidden lg:flex gap-4 xl:gap-8 items-center">
            <Link 
              className="text-gray-300 hover:text-white transition-all duration-300 font-medium relative group text-sm xl:text-base whitespace-nowrap" 
              to="/"
            >
              Browse
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            

            {role === "admin" && (
              <>
                <Link 
                  className="text-gray-300 hover:text-white transition-all duration-300 font-medium relative group text-sm xl:text-base whitespace-nowrap" 
                  to="/admin-dashboard"
                >
                  Admin Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  className="text-gray-300 hover:text-white transition-all duration-300 font-medium relative group text-sm xl:text-base whitespace-nowrap" 
                  to="/admin/reviews"
                >
                  Admin Reviews
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  className="text-gray-300 hover:text-white transition-all duration-300 font-medium relative group text-sm xl:text-base whitespace-nowrap" 
                  to="/admin/reviews/books"
                >
                  Books Review
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            )}

            {role === "user" && (
              <Link 
                className="text-gray-300 hover:text-white transition-all duration-300 font-medium relative group text-sm xl:text-base whitespace-nowrap" 
                to="/book/returebooks"
              >
                My Books
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}

            {!user && (
              <Link 
                className="text-gray-300 hover:text-white transition-all duration-300 font-medium relative group text-sm xl:text-base whitespace-nowrap" 
                to="/signup"
              >
                Signup
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 xl:px-6 py-2 xl:py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium shadow-lg hover:shadow-red-500/25 transform hover:scale-105 text-sm xl:text-base whitespace-nowrap"
              >
                Logout
              </button>
            ) : (
              <Link
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 xl:px-6 py-2 xl:py-2.5 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 text-sm xl:text-base whitespace-nowrap"
                to="/login"
              >
                Log in
              </Link>
            )}
          </nav>

          {/* Mobile/Tablet Nav Toggle - Show on mobile and tablet */}
          <div className="lg:hidden relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 sm:px-4 sm:py-2 bg-gray-800/50 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-300 border border-gray-600/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <svg 
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Mobile/Tablet Menu */}
            <div className={`absolute right-0 mt-3 w-64 sm:w-72 bg-slate-800/95 backdrop-blur-lg border border-gray-600/30 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden transition-all duration-300 ${
              menuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }`}>
              <div className="p-2">
                <Link
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 group"
                  to="/"
                >
                  <svg className="w-5 h-5 mr-3 text-blue-400 group-hover:text-blue-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                  <span className="truncate">Browse</span>
                </Link>

                {role === "admin" && (
                  <>
                    <Link
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 group"
                      to="/admin-dashboard"
                    >
                      <svg className="w-5 h-5 mr-3 text-purple-400 group-hover:text-purple-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                      </svg>
                      <span className="truncate">Admin Dashboard</span>
                    </Link>
                    <Link
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 group"
                      to="/admin/reviews"
                    >
                      <svg className="w-5 h-5 mr-3 text-green-400 group-hover:text-green-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span className="truncate">Admin Reviews</span>
                    </Link>
                    <Link
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 group"
                      to="/admin/reviews/books"
                    >
                      <svg className="w-5 h-5 mr-3 text-yellow-400 group-hover:text-yellow-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                      </svg>
                      <span className="truncate">Books Review</span>
                    </Link>
                  </>
                )}

                {role === "user" && (
                  <Link
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 group"
                    to="/book/returebooks"
                  >
                    <svg className="w-5 h-5 mr-3 text-indigo-400 group-hover:text-indigo-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    <span className="truncate">My Books</span>
                  </Link>
                )}

                {!user && (
                  <Link
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 group"
                    to="/signup"
                  >
                    <svg className="w-5 h-5 mr-3 text-emerald-400 group-hover:text-emerald-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z"/>
                    </svg>
                    <span className="truncate">Signup</span>
                  </Link>
                )}

                <div className="border-t border-gray-600/30 mt-2 pt-2">
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-red-900/30 rounded-xl transition-all duration-200 w-full group"
                    >
                      <svg className="w-5 h-5 mr-3 text-red-400 group-hover:text-red-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 01-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
                      </svg>
                      <span className="truncate">Logout</span>
                    </button>
                  ) : (
                    <Link
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center px-4 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl transition-all duration-200 group font-medium shadow-lg"
                      to="/login"
                    >
                      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 01-1-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      <span className="truncate">Log in</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop - Only show on mobile/tablet */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Animated bottom border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60"></div>
    </header>
  );
}