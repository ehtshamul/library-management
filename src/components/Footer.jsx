import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div
      className="relative  flex-col bg-slate-50 overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Placeholder for main content */}
        <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-5"></div>

        {/* Footer */}
        <footer className="flex justify-center">
          <div className="flex w-full max-w-[960px] flex-col">
            <footer className="flex flex-col gap-6 px-4 sm:px-5 py-10 text-center">
              {/* Links */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 md:justify-around">
                <Link
                  className="text-[#49709c] text-base font-normal min-w-[100px]"
                  to="/about"
                >
                  About Us
                </Link>
                <Link
                  className="text-[#49709c] text-base font-normal min-w-[100px]"
                  to="/contact"
                >
                  Contact
                </Link>
                <Link
                  className="text-[#49709c] text-base font-normal min-w-[100px]"
                  to="/privacy-policy"
                >
                  Privacy Policy
                </Link>
              </div>

              {/* Copyright */}
              <p className="text-[#49709c] text-base font-normal">
                © {new Date().getFullYear()} BookReview. All rights reserved.
              </p>
            </footer>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
