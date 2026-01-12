import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated using user object in localStorage
  const user = localStorage.getItem('user');
  
  const isLoggedIn = user !== null && user !== 'null' && user !== 'undefined';
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;