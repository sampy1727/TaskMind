import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoutes = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user role is allowed
  if (allowedRoles === "admins" && user.role !== "admin") {
    return <Navigate to="/user/dashboard" replace />;
  }

  if (allowedRoles === "users" && user.role !== "user") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;