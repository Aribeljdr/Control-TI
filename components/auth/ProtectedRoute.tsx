/**
 * En modo standalone (sin backend) este componente es transparente.
 * Para reactivar autenticación JWT, restaurar la lógica comentada abajo.
 */
import React from 'react';

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => <>{children}</>;

/*
// ── Versión con JWT ──────────────────────────────────────────────────────────
import { Navigate, useLocation } from 'react-router-dom';
import { authStorage } from '../../utils/authStorage';

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  if (!authStorage.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};
*/
