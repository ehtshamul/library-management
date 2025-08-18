// filepath: d:\codecanyon\library-management\src\App.jsx
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import LoginPage from "./components/Login";
import ForgotPassword from "./components/forgetpassword";
import SignupPage from "./components/Siguppage"; // Corrected import path
import Home from "./pages/Home"; // Assuming you have a Home component
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <>
    

      <Routes>
        {/* Corrected element prop */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* ...other routes */}
      </Routes>

    
    </>
  );
}

export default App;
