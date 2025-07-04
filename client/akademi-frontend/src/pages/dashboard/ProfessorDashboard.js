import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyCourses, deleteCourse } from "../../redux/actions/courseActions";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";

const ProfessorDashboard = () => {
  const dispatch = useDispatch();
  const { myCourses, loading, error } = useSelector((state) => state.course);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const courses = myCourses?.data || [];
  const totalPages = myCourses?.totalPages || 1;

  useEffect(() => {
    dispatch(getMyCourses({ page, limit: 3 }));
  }, [dispatch, page]);

  const handleEdit = (id) => {
    navigate(`/courses/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro que deseas eliminar este curso?")) {
      dispatch(deleteCourse(id)).then(() => {
        alert("Curso eliminado con éxito");
        dispatch(getMyCourses({ page, limit: 3 })); //recarga la página
      });
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Mis Cursos</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate("/courses/create")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
            >
              + Crear Curso
            </button>
            <LogoutButton />
          </div>
        </div>
        <hr className="border-gray-300" />
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin h-6 w-6 mx-auto border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-500 mt-2">Cargando cursos...</p>
        </div>
      )}

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {!loading && Array.isArray(courses) && courses.length === 0 && (
        <p className="text-center text-gray-600">
          No has creado ningún curso todavía.
        </p>
      )}

      {!loading && Array.isArray(courses) && courses.length > 0 && (
        <>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <li
                key={course._id}
                className="p-4 border rounded shadow bg-white"
              >
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-700">{course.description}</p>
                <p className="mt-2 text-sm text-gray-500">
                  <strong>Categoría:</strong> {course.category}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Nivel:</strong> {course.level}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Precio:</strong> ${course.price}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Cupo Máximo:</strong> {course.maxStudents}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Inscriptos:</strong> {course.inscriptionCount ?? 0}
                </p>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(course._id)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded mr-2"
                    onClick={() => navigate(`/courses/details/${course._id}`)}
                  >
                    Ver Calificaciones
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Paginación */}
          <div className="flex justify-between items-center mt-8 border-t pt-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="text-sm font-semibold">
              Página {page} de {totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfessorDashboard;
