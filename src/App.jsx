// filepath: d:\codecanyon\library-management\src\App.jsx
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import LoginPage from "./components/Login";
import ForgotPassword from "./components/forgetpassword";
import SignupPage from "./components/Siguppage";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AddBookForm from "./pages/Addbook";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} /> {/* Changed path */}
        <Route path="/book/:id/edit" element={<AddBookForm mode='edit' />} />
        <Route path="/book/create" element={<AddBookForm mode='create' />} />
      </Routes>
    </>
  );
}

export default App;