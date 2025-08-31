import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signupUser } from "../store/authSlice";
import { useDispatch } from "react-redux";

function SignupPage() {
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [strongPassword, setStrongPassword] = useState(0);

  // ✅ Password strength check
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
  };

  // ✅ Validation
  const validateForm = () => {
    let error = {};

    if (!formdata.name) {
      error.name = "Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formdata.name)) {
      error.name = "Name should only contain letters and spaces";
    } else if (formdata.name.length < 3) {
      error.name = "Name should be at least 3 characters long";
    }

    if (!formdata.email) {
      error.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formdata.email)
    ) {
      error.email = "Invalid email format";
    }

    if (!formdata.password) {
      error.password = "Password is required";
    } else if (formdata.password.length < 6) {
      error.password = "Password should be at least 6 characters long";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(formdata.password)
    ) {
      error.password =
        "Password should contain at least one uppercase, one lowercase, and one number";
    }

    if (formdata.confirmPassword !== formdata.password) {
      error.confirmPassword = "Passwords do not match";
    }

    if (!formdata.role) {
      error.role = "Role is required";
    }

    return error;
  };

  const onchange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "password") {
      setStrongPassword(checkPasswordStrength(e.target.value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // 2. Call Redux action
    dispatch(signupUser({ formData: formdata, navigate, toast }));

    // reset form
    setFormdata({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    });
    setErrors({});
    setStrongPassword(0);
  };

  // ✅ Password strength label
  const strengthLabel = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["red", "orange", "yellow", "blue", "green"];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <InputField
            label="Full Name"
            type="text"
            name="name"
            value={formdata.name}
            onChange={onchange}
            error={errors.name}
          />

          {/* Email */}
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formdata.email}
            onChange={onchange}
            error={errors.email}
          />

          {/* Password */}
          <PasswordField
            label="Password"
            name="password"
            value={formdata.password}
            onChange={onchange}
            show={showPassword}
            setShow={setShowPassword}
            error={errors.password}
          />

          {/* Password Strength */}
          {formdata.password && strongPassword > 0 && (
            <p
              className={`text-xs mt-1 font-semibold text-${
                strengthColor[strongPassword - 1]
              }-500`}
            >
              Strength: {strengthLabel[strongPassword - 1]}
            </p>
          )}

          {/* Confirm Password */}
          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            value={formdata.confirmPassword}
            onChange={onchange}
            show={showConfirmPassword}
            setShow={setShowConfirmPassword}
            error={errors.confirmPassword}
          />

          {/* Role Selection */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Select Role
            </label>
            <select
              name="role"
              value={formdata.role}
              onChange={onchange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">-- Select Role --</option>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <span
            className="text-indigo-500 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

// ✅ Reusable Input Field
function InputField({ label, type, name, value, onChange, error }) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ✅ Reusable Password Field
function PasswordField({ label, name, value, onChange, show, setShow, error }) {
  return (
    <div className="relative">
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
      />
      <span
        className="absolute right-3 top-9 cursor-pointer text-gray-500"
        onClick={() => setShow(!show)}
      >
        {show ? <EyeOff /> : <Eye />}
      </span>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default SignupPage;
