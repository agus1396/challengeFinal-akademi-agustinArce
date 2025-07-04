import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../redux/actions/courseActions";
//import { useNavigate } from "react-router-dom";
import BackToDashboardButton from "../../components/BackToDashboardButton";

const ListCoursesPage = () => {
  const dispatch = useDispatch();
  //const navigate = useNavigate();

  // Estado local para manejar la página actual
  const [page, setPage] = useState(1);

  // Accedemos al estado global de Redux
  const { courses, loading } = useSelector((state) => state.course);

  // Desestructuramos los datos de paginación
  const courseList = courses?.data || [];
  const totalItems = courses?.totalItems || 0;
  const totalPages = courses?.totalPages || 1;
  const currentPage = courses?.currentPage || 1;

  // Cargar cursos al montar el componente o cambiar de página
  useEffect(() => {
    dispatch(getAllCourses({ page }));
  }, [dispatch, page]);

  // Funciones para cambiar de página
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Ordenamos la lista antes de agrupar
  const orderedCourseList = [...courseList].sort((a, b) => {
    const nameA = a.professor?.name?.toLowerCase() || "";
    const nameB = b.professor?.name?.toLowerCase() || "";

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;

    // Si el nombre de profesor es igual, ordenar por título del curso
    const titleA = a.title?.toLowerCase() || "";
    const titleB = b.title?.toLowerCase() || "";
    return titleA.localeCompare(titleB);
  });

  // Agrupamos los cursos por nombre de profesor usando Map para mantener el orden
  const groupedCoursesMap = new Map();

  orderedCourseList.forEach((course) => {
    const name = course.professor?.name || "Profesor desconocido";
    if (!groupedCoursesMap.has(name)) {
      groupedCoursesMap.set(name, []);
    }
    groupedCoursesMap.get(name).push(course);
  });

  return (
  <div className="min-h-screen bg-gray-100 p-6">
    {/* Botón afuera del contenedor */}
    <div className="mb-4">
      <BackToDashboardButton />
    </div>

    {/* Contenedor blanco central */}
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
      {/* Título */}
      <h2 className="text-center mb-6 text-purple-800 font-bold text-2xl">
        Lista de Cursos
      </h2>

      {/* Estado de carga */}
      {loading ? (
        <div className="text-center my-4">
          <p className="text-gray-500">Cargando cursos...</p>
        </div>
      ) : courseList.length === 0 ? (
        // Sin cursos
        <p className="text-center text-gray-500">
          No hay cursos disponibles para mostrar.
        </p>
      ) : (
        <>
          {/* Total de cursos */}
          <p className="text-right text-sm text-gray-500 mb-6">
            Total de cursos: <span className="font-semibold">{totalItems}</span>
          </p>

          {/* Cursos agrupados por profesor */}
          {[...groupedCoursesMap.entries()].map(([profName, courses]) => (
            <div key={profName} className="mb-6">
              <h4 className="font-bold text-lg mb-3">👨‍🏫 {profName}</h4>
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="border rounded-md p-4 mb-2 bg-white shadow-sm"
                >
                  <strong>{course.title}</strong> —{" "}
                  <span className="text-gray-600">{course.description}</span>
                </div>
              ))}
            </div>
          ))}

          {/* Paginación */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
            <button
              className={`px-4 py-2 rounded text-white ${
                page === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handlePreviousPage}
              disabled={page === 1}
            >
              Anterior
            </button>

            <span className="font-semibold">
              Página {currentPage} de {totalPages}
            </span>

            <button
              className={`px-4 py-2 rounded text-white ${
                page === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleNextPage}
              disabled={page === totalPages}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);

};

export default ListCoursesPage;
