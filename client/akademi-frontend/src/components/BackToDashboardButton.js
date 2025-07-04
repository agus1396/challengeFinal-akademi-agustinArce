import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const BackToDashboardButton = () => {
  const navigate = useNavigate();

  // Obtenemos el rol del usuario desde Redux
  const { user } = useSelector((state) => state.auth);

  // Armamos la ruta según el rol
  const getDashboardPath = () => {
    if (!user) return "/";
    switch (user.role) {
      case "alumno":
        return "/dashboard/alumno";
      case "profesor":
        return "/dashboard/profesor";
      case "superadmin":
        return "/dashboard/superadmin";
      default:
        return "/";
    }
  };

  return (
    <button
      onClick={() => navigate(getDashboardPath())}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mb-4"
    >
      ⬅ Volver al Dashboard
    </button>
  );
};

export default BackToDashboardButton;

