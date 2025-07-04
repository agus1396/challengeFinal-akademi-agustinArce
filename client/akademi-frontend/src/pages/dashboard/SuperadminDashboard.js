import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStats } from "../../redux/actions/statsActions";
import LogoutButton from "../../components/LogoutButton";
import { useNavigate } from "react-router-dom";

const SuperadminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, loading, error } = useSelector((state) => state.stats);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Encabezado con logout */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard de Superadmin</h1>
        <LogoutButton />
      </div>
      <hr className="border-gray-300 mb-6" />

      {/* Panel de estadísticas */}
      {loading ? (
        <p className="text-gray-600 text-center">Cargando estadísticas...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Usuarios</h2>
            <p className="text-3xl text-blue-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Cursos</h2>
            <p className="text-3xl text-green-600">{stats.totalCourses}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Inscripciones</h2>
            <p className="text-3xl text-purple-600">{stats.totalEnrollments}</p>
          </div>
        </div>
      ) : null}

      {/* Botonera de navegación */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
        {/* Ver usuarios */}
        <button
          onClick={() => navigate("/superadmin/users")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded"
        >
          Ver Usuarios
        </button>

        {/* Ver listado de cursos (admin) */}
        <button
          onClick={() => navigate("/superadmin/courses")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded"
        >
          Ver Listado de Cursos
        </button>

        {/* Ver catálogo de cursos (como alumno) */}
        <button
          onClick={() => navigate("/courses/available")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded"
        >
          Ver Catálogo de Cursos
        </button>

        {/* Crear nuevo profesor */}
        <button
          onClick={() => navigate("/superadmin/users/create")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded"
        >
          Crear Nuevo Profesor
        </button>
      </div>
    </div>
  );
};

export default SuperadminDashboard;
