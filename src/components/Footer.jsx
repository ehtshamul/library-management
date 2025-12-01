import React from "react";
import { Link } from "react-router-dom";


import { useNavigate } from "react-router-dom";


const Footer = () => {
  const navigate = useNavigate();

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
                  to="/about-us"
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
              {/* social media links */}
              <div className="border-t border-gray-300 my-6 pt-6">
  <div className="flex justify-center space-x-8 mt-4">
    <a
      href="https://www.facebook.com/profile.php?id=61581143049004"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#49709c] hover:text-blue-600 transition-all duration-300 transform hover:scale-150 hover:shadow-md hover:shadow-blue-200 p-3 rounded-full"
    >
      <i className="fab fa-facebook-f fa-lg"></i>
    </a>

    <a
      href="https://x.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#49709c] hover:text-blue-400 transition-all duration-300 transform hover:scale-150 hover:shadow-md hover:shadow-blue-200 p-3 rounded-full"
    >
      <i className="fab fa-twitter fa-lg"></i>
    </a>

    <a
      href="https://www.instagram.com/wonder_stack_library/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#49709c] hover:text-pink-500 transition-all duration-300 transform hover:scale-150 hover:shadow-md hover:shadow-pink-200 p-3 rounded-full"
    >
      <i className="fab fa-instagram fa-lg"></i>
    </a>

    <a
      href="https://www.linkedin.com/in/ehtsham-ul-haq-web-developer/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#49709c] hover:text-blue-700 transition-all duration-300 transform hover:scale-150 hover:shadow-md hover:shadow-blue-300 p-3 rounded-full"
    >
      <i className="fab fa-linkedin-in fa-lg"> </i>
    </a>
  </div>
</div>


              {/* Copyright */}
              <p className="text-[#49709c] text-base font-normal mt-4 text-lg text-underline">
                © {new Date().getFullYear()} Wonder Stack Library. All rights reserved.
              </p>
            </footer>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
