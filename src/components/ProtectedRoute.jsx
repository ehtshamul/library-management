import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { accessToken, user } = useSelector((state) => state.auth);

  // Require authentication
  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  // Require admin role when needed
  if (adminOnly && (user.role || '').toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
