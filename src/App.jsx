// filepath: d:\codecanyon\library-management\src\App.jsx
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import LoginPage from "./components/Login";
import ForgotPassword from "./components/forgetpassword";
import SignupPage from "./components/Siguppage";

import AdminDashboard from "./pages/AdminDashboard";
import AddBookForm from "./pages/Addbook";
import ProtectedRoute from "./components/ProtectedRoute";
import BookGrid from "./pages/Bookesview";
import AdminReviews from "./pages/AdminReviews";
import BookDetail from "./pages/BookDetail";
import AdminRevbooks from "./pages/Adminbooks";
import BorrowedBooks from "./pages/retureborrow"
import BorrowTrend from "./chart/borrowtre";


function App() {
  return (
    <>
      <Nav />
      <Routes>
        {/* Corrected element prop */}
        <Route path="/" element={<BookGrid/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute adminOnly>
          <AdminDashboard />
          </ProtectedRoute>
          } />
         
        <Route path="/book/:id/edit" element={
          <ProtectedRoute adminOnly>
            <AddBookForm mode='edit' />
          </ProtectedRoute>
        } />
        <Route path="/book/create" element={
          <ProtectedRoute adminOnly>
            <AddBookForm mode='create' />
          </ProtectedRoute>
        } />
        <Route path="/admin/reviews" element={
          <ProtectedRoute adminOnly>
            <AdminReviews />
          </ProtectedRoute>
        } />
         <Route path="/admin/reviews/books" element={
          <ProtectedRoute adminOnly>
            <AdminRevbooks />
          </ProtectedRoute>
        } />



        {/* bookd Details */}
        <Route path ='/book/:slug/bookdetails' element={<BookDetail/>}/>
        <Route path ='/book/returebooks' element={<BorrowedBooks/>}/>
        <Route path ='/book/Analytics' element={<BorrowTrend/>}/>

       
      </Routes>
      <Footer />
    </>
  );
}

export default App;
