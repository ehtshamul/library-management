import React, { useState, useRef } from 'react';
import { Mail, Lock, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';
import { forgetpassword, resetPassword } from '../store/authSlice';
import { ToastContainer, toast } from 'react-toastify';

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return { minLength, hasUpper, hasLower, hasNumber, hasSpecial, isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial };
  };

  // Step 1: Send OTP
  const handleEmailSubmit = async () => {
    setError('');
    if (!email) return setError('Email is required');
    if (!validateEmail(email)) return setError('Invalid email');

    setIsLoading(true);
    try {
      const response = await dispatch(forgetpassword({ email }));
      if (response.error) return setError(response.error.message || 'Failed to send OTP');

      toast.success('OTP sent to your email!');
      setCurrentStep(2);
    } catch {
      setError('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: OTP Input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOtpSubmit = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) return setError('Enter all 6 digits');
    setCurrentStep(3);
  };

  // Step 3: Reset Password
  const handlePasswordSubmit = async () => {
    setError('');
    const validation = validatePassword(newPassword);
    if (!validation.isValid) return setError('Password does not meet requirements');
    if (newPassword !== confirmPassword) return setError('Passwords do not match');

    setIsLoading(true);
    try {
      const otpString = otp.join('');
      const response = await dispatch(resetPassword({ email, otp: otpString, newPassword, confirmPassword }));
      if (response.error) {
        setError(response.error.message || 'Failed to reset password');
        setIsLoading(false);
        return;
      }

      toast.success('Password reset successful!');
      setCurrentStep(4);

      // Clear local storage / state for old login credentials
      localStorage.removeItem('authToken'); 
      localStorage.removeItem('user');
    } catch {
      setError('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    toast.info('OTP resent!');
  };

  const goBack = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : 1));
  const handleBackToLogin = () => navigate('/login');
  const handleStartOver = () => {
    setCurrentStep(1);
    setEmail('');
    setOtp(['', '', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="w-full max-w-md">

        {/* Step 1: Email */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-xl border p-8 space-y-6">
            <Mail className="w-8 h-8 mx-auto text-blue-600 mb-2"/>
            <h1 className="text-2xl font-bold text-center">Forgot Password?</h1>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="Email Address"
              className={`w-full border px-4 py-3 rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
            <button onClick={handleEmailSubmit} className="w-full bg-blue-600 text-white py-3 rounded-lg mt-2">
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        )}

        {/* Step 2: OTP */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-xl border p-8 space-y-6 text-center">
            <Shield className="w-8 h-8 mx-auto text-purple-600 mb-2"/>
            <h2 className="text-2xl font-bold">Enter OTP</h2>
            <p>We sent a 6-digit code to {email}</p>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-12 text-center border rounded-lg"
                />
              ))}
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button onClick={handleOtpSubmit} className="w-full bg-purple-600 text-white py-3 rounded-lg mt-2">Verify OTP</button>
            <button onClick={resendOtp} className="w-full mt-2 text-purple-600">Resend OTP</button>
            <button onClick={goBack} className="w-full mt-2 text-gray-600">Go Back</button>
          </div>
        )}

        {/* Step 3: New Password */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-xl border p-8 space-y-6">
            <Lock className="w-8 h-8 mx-auto text-green-600 mb-2"/>
            <h2 className="text-2xl font-bold text-center">Reset Password</h2>
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full border px-4 py-3 rounded-lg mb-2"
            />
            <button onClick={() => setShowNewPassword(!showNewPassword)}>Show/Hide</button>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full border px-4 py-3 rounded-lg mb-2"
            />
            <button onClick={() => setShowConfirmPassword(!showConfirmPassword)}>Show/Hide</button>
            {error && <p className="text-red-500">{error}</p>}
            <button onClick={handlePasswordSubmit} className="w-full bg-green-600 text-white py-3 rounded-lg mt-2">
              Reset Password
            </button>
            <button onClick={goBack} className="w-full mt-2 text-gray-600">Go Back</button>
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl shadow-xl border p-8 text-center space-y-6">
            <CheckCircle className="w-10 h-10 mx-auto text-green-600 mb-2"/>
            <h2 className="text-2xl font-bold">Password Updated!</h2>
            <p>You can now login with your new password.</p>
            <button onClick={handleBackToLogin} className="w-full bg-blue-600 text-white py-3 rounded-lg">Go to Login</button>
            <button onClick={handleStartOver} className="w-full mt-2 text-gray-600">Reset Another Password</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
