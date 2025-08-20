import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

import { useState, useEffect } from "react";
import LoadingPage from "./LoadingPage";

function ProtectedRoute({ children, role }) {
  const location = useLocation();
  const isLoggedIn =
    localStorage.getItem("user_logged_in") ||
    localStorage.getItem("admin_logged_in");
  const isAdmin = localStorage.getItem("admin_logged_in");
  const isTeacher = localStorage.getItem("user_logged_in");
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status == 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <LoadingPage />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based restriction
  if (role === "admin" && !isAdmin) {
    return <Navigate to="/dashboard_instructor" replace />;
  }
  if (role === "teacher" && !isTeacher) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;