import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // ✅ correct import
import { Link, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";


function LoginPage() {
  let [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  let [showPassword, setShowPassword] = useState(false);
  let navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    try {
      // api end point 
      const response= await axios.post("http://localhost:7000/api/auth/login",formData);
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 3000);
      } else {
        toast.error("Login failed! Please try again.");
      }

    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred during login. Please try again.");
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
              onChange={handleChange}
              value={formData.email}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              value={formData.password}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
            />

            {showPassword ? (
              <EyeOff
                className="absolute right-3 top-9 cursor-pointer"
                onClick={togglePassword}
              />
            ) : (
              <Eye
                className="absolute right-3 top-9 cursor-pointer"
                onClick={togglePassword}
              />
            )}
          </div>

          {/* Submit button */}
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
    <Footer/>
    </>
  );
}

export default LoginPage;
