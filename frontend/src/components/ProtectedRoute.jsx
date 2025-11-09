import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const ProtectedRoute = ({ children, requiredRole = null, redirectTo = '/auth/login' }) => {
  const { usuario, estaAutenticado } = useAuth();
  const ubicacion = useLocation();
  const { t } = useTranslation();

  if (!estaAutenticado) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: ubicacion }} 
        replace 
      />
    );
  }

  if (requiredRole && usuario?.rol !== requiredRole) {
    if (requiredRole === 'ADMIN') {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;