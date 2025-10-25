import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

/**
 * Simple route guard that checks Firebase auth
 */
const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser;

  // If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise render the requested component
  return children;
};

export default ProtectedRoute;
