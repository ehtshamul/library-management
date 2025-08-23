import React from "react";
import {  useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    let navigate = useNavigate();
  return (
    <div
      className="relative flex size-full  flex-col bg-slate-50 overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Page Content */}
        <div className="px-4 sm:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full sm:w-[512px] max-w-[512px] py-5 flex-1">
            <h2 className="text-[#0d141c] text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Forgot Password
            </h2>
            <p className="text-[#0d141c] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
              Enter the email address associated with your account and we'll send
              you a link to reset your password.
            </p>

            {/* Email Input */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto w-full">
              <label className="flex flex-col min-w-40 flex-1 w-full">
                <p className="text-[#0d141c] text-base font-medium leading-normal pb-2">
                  Email
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg 
                             text-[#0d141c] focus:outline-0 focus:ring-0 border border-[#cedae8] 
                             bg-slate-50 focus:border-[#0d78f2] h-14 placeholder:text-[#49709c] 
                             p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex px-4 py-3">
              <button
                type="button"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center 
                           justify-center overflow-hidden rounded-lg h-12 px-4 flex-1 
                           bg-[#0d78f2] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Send Reset Link</span>
              </button>
            </div>

            {/* Back to Login */}
            <p className="text-[#49709c] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline cursor-pointer" onClick={() => navigate("/login")   }>
              Back to Login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
