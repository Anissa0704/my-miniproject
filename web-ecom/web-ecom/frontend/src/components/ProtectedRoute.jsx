import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired) {
    if (Array.isArray(roleRequired)) {
      if (!roleRequired.includes(role)) return <Navigate to="/" replace />;
    } else {
      if (role !== roleRequired) return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
