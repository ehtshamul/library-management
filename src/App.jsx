// filepath: d:\codecanyon\library-management\src\App.jsx
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import LoginPage from "./components/Login";
import ForgotPassword from "./components/forgetpassword";
import SignupPage from "./components/Siguppage"; // Corrected import path
import Home from "./pages/Home"; // Assuming you have a Home component
import AdminDashboard from "./pages/AdminDashboard";
import AddBookForm from "./pages/Addbook";
import ProtectedRoute from "./components/ProtectedRoute";
import BookGrid from "./pages/Bookesview";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        {/* Corrected element prop */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
          <AdminDashboard />
          </ProtectedRoute>
          } />
          <Route path="/browse" element={<BookGrid />} />
        <Route path="/book/:id/edit" element={<AddBookForm mode='edit' />} />
        <Route path="/book/create" element={<AddBookForm mode='create' />} />

        {/* ...other routes */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
