import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { currentUser, checkingSession } = useAuth();
  const location = useLocation();

  if (checkingSession) return null; // avoid flicker while session is restored

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && currentUser.role !== role) {
    // Signed in, but as the wrong role for this page — send them somewhere valid.
    return <Navigate to={currentUser.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return children;
}
