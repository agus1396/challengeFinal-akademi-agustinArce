import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token } = useSelector((state) => state.auth);

  // Si no está autenticado
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // Si hay roles requeridos (uno o varios), validarlos
  if (requiredRole) {
    // Soporte para múltiples roles separados por coma
    const allowedRoles = requiredRole.split(",").map((r) => r.trim());

    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute;
