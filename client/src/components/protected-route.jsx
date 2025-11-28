import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectWriterId } from '../store/slices/authSlice';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const writerId = useSelector(selectWriterId);
  const { writerId: urlWriterId } = useParams();

  // Check if user is authenticated and URL writerId matches authenticated writer
  if (!isAuthenticated || !writerId) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (urlWriterId && urlWriterId !== writerId) {
    // If URL has writerId but it doesn't match the authenticated user, redirect to their own write page
    return <Navigate to={`/blog/${writerId}/write`} replace />;
  }

  return children;
};

export default ProtectedRoute;