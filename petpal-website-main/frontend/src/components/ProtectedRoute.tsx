import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  const { state } = useApp();
  const location = useLocation();

  if (!state.user) {
    // Redirect to login with return URL
    return <Navigate to={`${redirectTo}?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
}

