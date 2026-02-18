
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authStorage } from '../../utils/authStorage';

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authStorage.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
