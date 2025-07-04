import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Dummy authentication and role check (replace with your real logic)
const useAuth = () => {
  // Example: get user from localStorage or context
  const user = JSON.parse(localStorage.getItem("user"));
  return user;
};

const PrivateRoutes = ({ allowedRoles }) => {
  const user = useAuth();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  // Check if allowedRoles matches user's role(s)
  if (
    (Array.isArray(allowedRoles) && allowedRoles.includes(user.role)) ||
    allowedRoles === user.role
  ) {
    return <Outlet />;
  }

  // Not authorized
  return <Navigate to="/login" replace />;
};

export default PrivateRoutes;