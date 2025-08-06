// src/PrivateRoute.jsx
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';  // Import useSelector from react-redux

const PrivateRoute = ({ children, role }) => {
  // Get the token and userRole from Redux store
  const token = useSelector((state) => state.auth.token);  // Get token from Redux store
  const userRole = useSelector((state) => state.auth.userRole);  // Get user role from Redux store

  // Check if the user is authenticated and has the required role
  if (!token || userRole !== role) {
    // Redirect to login if not authenticated or role doesn't match
    return <Navigate to="/login" />;
  }

  // If authenticated and role matches, render the children (protected route content)
  return children;
};

// Adding PropTypes to validate the props
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,  // Children can be any type of React node (e.g., components, elements)
  role: PropTypes.string.isRequired,  // Role should be a string (e.g., "admin", "user", etc.)
};

export default PrivateRoute;
