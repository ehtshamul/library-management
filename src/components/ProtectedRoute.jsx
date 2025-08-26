import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { accessToken, user } = useSelector((state) => state.auth);
  
  // Check if user is authenticated
  if (!accessToken || !user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  // Check if user is admin for admin routes
  if (window.location.pathname.includes('/admin') && (user.role || '').toLowerCase() !== 'admin') {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }
  
  // Render the protected content
  return children;
};

export default ProtectedRoute;
