import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../services/api';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const authenticated = isAuthenticated();
  const admin = isAdmin();

  console.log("=== ProtectedRoute Check ===");
  console.log("Authenticated:", authenticated);
  console.log("Is Admin:", admin);
  console.log("Require Admin:", requireAdmin);

  if (!authenticated) {
    console.log("Not authenticated, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !admin) {
    console.log("Not admin, redirecting to /");
    return <Navigate to="/" replace />;
  }

  console.log("Access granted");
  return children;
};

export default ProtectedRoute;
