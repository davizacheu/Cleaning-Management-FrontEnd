// src/component/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check for the auth_token in localStorage
  const auth_token = localStorage.getItem('auth_token');

  // If no auth_token exists, redirect to the home page
  if (!auth_token) {
    console.log("No auth token found, redirecting to home");
    return <Navigate to="/" />;
  }

  // If auth_token exists, render the protected route
  return children;
};

export default ProtectedRoute;