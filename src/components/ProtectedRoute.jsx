import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  // For debugging - allow bypass in development environment
  // Set to false in production
  const bypassAuth = false;
  
  // Check if we have a user in the auth context
  console.log("ProtectedRoute - User:", user?.email || "No user object");
  console.log("ProtectedRoute - Auth bypass:", bypassAuth ? "Enabled" : "Disabled");
  
  // Only redirect if we don't have a user object and bypass is disabled
  return (user || bypassAuth) ? children : <Navigate to="/login" />;
};

// Add PropTypes validation for `children`
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
