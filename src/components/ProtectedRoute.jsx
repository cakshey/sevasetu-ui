// ✅ ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("sevasetu_user");
  return user ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
