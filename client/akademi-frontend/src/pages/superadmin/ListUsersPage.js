import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteUser } from "../../redux/actions/userActions";
import BackToDashboardButton from "../../components/BackToDashboardButton";

const ListUsersPage = () => {
  const dispatch = useDispatch();

  // Accedemos al estado global de Redux
  const { users, loading, error } = useSelector((state) => state.user);

  // Estados locales para cada página por rol
  const [pageSuperadmin, setPageSuperadmin] = useState(1);
  const [pageProfesor, setPageProfesor] = useState(1);
  const [pageAlumno, setPageAlumno] = useState(1);
  const limit = 3; // Cantidad de usuarios por página

  // Cuando cambia alguna página, volvemos a pedir datos
  useEffect(() => {
    dispatch(getAllUsers({ pageSuperadmin, pageProfesor, pageAlumno, limit }));
  }, [dispatch, pageSuperadmin, pageProfesor, pageAlumno]);

  // Manejo del borrado
  const handleDelete = (userId, userName) => {
    const confirmDelete = window.confirm(
      `¿Seguro que quieres eliminar a ${userName}? Esta acción no se puede deshacer.`
    );
    if (confirmDelete) {
      dispatch(deleteUser(userId));
    }
  };

  // Corrección automática de paginación si se eliminó el último usuario de una página
  useEffect(() => {
    if (users?.alumno?.data?.length === 0 && pageAlumno > 1 && !loading) {
      setPageAlumno(pageAlumno - 1);
    }
  }, [users?.alumno?.data, pageAlumno, loading]);

  // Función genérica para renderizar cada grupo de usuarios
  const renderUserGroup = (title, role, page, setPage) => {
    const data = users?.[role]?.data || [];
    const currentPage = users?.[role]?.currentPage || 1;
    const totalPages = users?.[role]?.totalPages || 1;

    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>

        <ul className="border border-gray-300 rounded divide-y divide-gray-200">
          {data.map((user) => (
            <li
              key={user._id}
              className="p-3 flex justify-between items-center"
            >
              <div>
                <span className="font-medium">{user.name}</span> -{" "}
                <span className="text-gray-600">{user.email}</span>
              </div>

              {/* Mostrar botón de eliminar para alumnos y profesores */}
              {role === "alumno" || role === "profesor" ? (
                <button
                  onClick={() => handleDelete(user._id, user.name)}
                  className="ml-2 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              ) : null}
            </li>
          ))}
        </ul>

        {/* Paginación específica para este grupo */}
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded text-sm text-white ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Anterior
          </button>
          <span className="text-sm font-medium">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded text-sm text-white ${
              page === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Botón para volver */}
      <div className="mb-4">
        <BackToDashboardButton />
      </div>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">
          Lista de Usuarios
        </h2>

        {/* Mensajes de estado */}
        {loading && <p className="text-gray-500 mb-2 text-sm">Cargando...</p>}
        {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}

        {/* Renderizado de grupos de usuarios con paginación por rol */}
        {!loading && !error && (
          <>
            {renderUserGroup(
              "👑 Superadmins",
              "superadmin",
              pageSuperadmin,
              setPageSuperadmin
            )}
            {renderUserGroup(
              "👨‍🏫 Profesores",
              "profesor",
              pageProfesor,
              setPageProfesor
            )}
            {renderUserGroup("👨‍🎓 Alumnos", "alumno", pageAlumno, setPageAlumno)}
          </>
        )}
      </div>
    </div>
  );
};

export default ListUsersPage;
