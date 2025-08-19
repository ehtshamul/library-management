import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {login} from "../server/auth";
import { set } from "react-hook-form";


function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Toggle password visibility
  const togglePassword = () => setShowPassword(!showPassword);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    toast.error("Please enter email and password!");
    return;
  }

  try {
    const response = await login(formData);
    console.log("Login response:", response);

    // Ensure success check is more flexible
    if (response.data?.success) {
      const { token, user } = response.data;

      // Save token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful!");

      // Navigate based on role
    setTimeout(() => {
  if (user?.role === "Admin") {
    navigate("/admin-dashboard");
    console.log("Admin logged in, navigating to admin dashboard.");
  } else if (user?.role === "Librarian") {
    navigate("/librarian-dashboard");
    console.log("Librarian logged in, navigating to librarian dashboard.");
  } else {
    navigate("/");
    console.log("User role not recognized, navigating to home.");
  }
}, 3000); // optional delay (1000ms = 1 second)
    } else {
      toast.error("Login failed! Please check your credentials.");}

  } catch (error) {
    console.error("Login error:", error);
    toast.error(error.response?.data?.message || "An error occurred. Try again.");
  }
  
};


  return (
    <>
      <Nav />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ToastContainer position="top-right" autoClose={2000} />
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
                required
              />
              {showPassword ? (
                <EyeOff className="absolute right-3 top-9 cursor-pointer" onClick={togglePassword} />
              ) : (
                <Eye className="absolute right-3 top-9 cursor-pointer" onClick={togglePassword} />
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition"
            >
              Login
            </button>
          </form>

          {/* Links */}
          <p className="text-sm text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <span
              className="text-indigo-500 hover:underline cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
          <p className="text-sm text-center text-gray-600 mt-3">
            Forgot Password?{" "}
            <span
              className="text-indigo-500 hover:underline cursor-pointer"
              onClick={() => navigate("/forgot-password")}
            >
              Reset here
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LoginPage;
