import React from "react";
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <div
      // className="relative mb-36 flex flex-col bg-slate-50 overflow-x-hidden"
      // style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7edf4] px-4 md:px-6 lg:px-10 xl:px-12 py-3">
          {/* Brand */}
          <div className="flex items-center gap-2 md:gap-3 lg:gap-4 text-[#0d141c]">
            <div className="size-5 md:size-6 lg:size-7">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-base md:text-lg lg:text-xl font-bold leading-tight tracking-[-0.015em]">
              BookReview
            </h2>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex flex-1 justify-end gap-6 lg:gap-8 xl:gap-10">
            <nav className="flex items-center gap-6 lg:gap-9 xl:gap-12">
              <Link className="text-sm lg:text-base font-medium" to="/browse">
                Browse
              </Link>
              <Link className="text-sm lg:text-base font-medium" to="/signup">
                Signup
              </Link>
            </nav>
            <Link
              to="/login"
              className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-[#e7edf4] text-sm lg:text-base font-bold"
            >
              <span className="truncate">Log in</span>
            </Link>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <details className="relative">
              <summary className="list-none cursor-pointer rounded-lg h-10 px-3 flex items-center gap-2 bg-[#e7edf4] text-sm font-semibold select-none">
                Menu
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="size-4"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </summary>
              <div className="absolute right-0  w-48 rounded-xl border border-slate-200 bg-white shadow-lg p-2 z-50">
                <Link
                  className="block px-3 py-2 text-sm hover:bg-slate-50 rounded-lg"
                  to="/browse"
                >
                  Browse
                </Link>
                <Link
                  className="block px-3 py-2 text-sm hover:bg-slate-50 rounded-lg"
                  to="/signup"
                >
                  Signup
                </Link>
                <Link
                  to="/login"
                  className="mt-2 block w-full h-9 rounded-lg bg-[#e7edf4] text-center leading-9 text-sm font-bold"
                >
                  Log in
                </Link>
              </div>
            </details>
          </div>
        </header>
      </div>
      
    </div>
  );
}
