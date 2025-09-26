import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";

function AuthRedirect({ children }) {
  // Check if user is logged in
  const isLoggedIn =
    localStorage.getItem("user_logged_in") ||
    localStorage.getItem("admin_logged_in");
  
  const isAdmin = localStorage.getItem("admin_logged_in");
  const isTeacher = localStorage.getItem("user_logged_in");

  // If user is logged in, check if their token is still valid
  if (isLoggedIn) {
    const token = localStorage.getItem(ACCESS_TOKEN);
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        // If token is still valid, redirect to appropriate dashboard
        if (tokenExpiration >= now) {
          if (isAdmin) {
            return <Navigate to="/dashboard" replace />;
          } else if (isTeacher) {
            return <Navigate to="/dashboard_instructor" replace />;
          }
        } else {
          // Token expired, clear localStorage
          localStorage.clear();
        }
      } catch (error) {
        // Invalid token, clear localStorage
        console.error('Error decoding token:', error);
        localStorage.clear();
      }
    } else {
      // No token but login flag exists, clear localStorage
      localStorage.clear();
    }
  }

  // If not logged in or token invalid, show the login page
  return children;
}

export default AuthRedirect;