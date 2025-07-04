import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../redux/actions/courseActions";
import {
  getMyEnrollments,
  enrollInCourse,
} from "../../redux/actions/enrollmentActions";
import BackToDashboardButton from "../../components/BackToDashboardButton";

const AvailableCourses = () => {
  const dispatch = useDispatch();

  // Estado global
  const { courses, loading } = useSelector((state) => state.course);
  const enrollmentsData = useSelector((state) => state.enrollment.enrollments);
  const enrollments = useMemo(
    () => enrollmentsData?.data || [],
    [enrollmentsData]
  );
  const user = useSelector((state) => state.auth.user);
  const isSuperAdmin = user?.role === "superadmin";

  // Estado local
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

  // Traer cursos y mis inscripciones
  useEffect(() => {
    const filters = {
      page,
      limit: 3,
    };

    if (selectedCategory !== "all") filters.category = selectedCategory;
    if (selectedLevel !== "all") filters.level = selectedLevel;
    if (minPrice !== "") filters.minPrice = minPrice;
    if (maxPrice !== "") filters.maxPrice = maxPrice;

    dispatch(getAllCourses(filters));
    dispatch(getMyEnrollments());
  }, [dispatch, page, selectedCategory, selectedLevel, minPrice, maxPrice]);

  // useEffect adicional para resetear página a 1 cuando se cambia un filtro
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedLevel, minPrice, maxPrice]);

  // Obtener IDs de cursos ya inscritos
  useEffect(() => {
    if (enrollments) {
      const ids = enrollments
        .filter((e) => e?.course && e.course._id)
        .map((e) => e.course._id);
      setEnrolledCourseIds(ids);
    }
  }, [enrollments]);

  const handleEnroll = async (courseId) => {
    if (window.confirm("¿Deseas inscribirte a este curso?")) {
      await dispatch(enrollInCourse(courseId));
      dispatch(getMyEnrollments());
    }
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedLevel("all");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  const allCourses = courses?.data || [];
  const categories = [
    "Programación",
    "Diseño",
    "Marketing",
    "Idiomas",
    "Negocios",
    "Música",
    "Otro",
  ];
  const levels = ["Inicial", "Intermedio", "Avanzado"];

  const handleNextPage = () => {
    if (page < courses.totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="p-6">
      <BackToDashboardButton />
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-800">
        Catálogo de Cursos
      </h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>

        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">Todos los niveles</option>
          {levels.map((level) => (
            <option key={level}>{level}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Precio mínimo"
          min="0"
          className="border px-2 py-1 rounded w-36"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Precio máximo"
          min="0"
          className="border px-2 py-1 rounded w-36"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button
          onClick={clearFilters}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
        >
          Limpiar filtros
        </button>
      </div>

      <hr className="mb-6 border-gray-300" />

      {/* Lista de cursos */}
      {loading ? (
        <p className="text-center text-gray-500">Cargando cursos...</p>
      ) : allCourses.length > 0 ? (
        <>
          <p className="text-end text-sm text-gray-500 mb-2">
            Total de cursos: <strong>{courses.totalItems}</strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allCourses.map((course) => (
              <div key={course._id} className="bg-white p-4 rounded shadow-md">
                <h2 className="text-lg font-bold">{course.title}</h2>
                <p className="text-sm mb-2">{course.description}</p>
                <p>
                  <strong>Categoría:</strong> {course.category}
                </p>
                <p>
                  <strong>Nivel:</strong> {course.level}
                </p>
                <p>
                  <strong>Precio:</strong> ${course.price}
                </p>
                <p>
                  <strong>Cupo Máximo:</strong> {course.maxStudents}
                </p>

                {/* Mostrar botones solo si el usuario NO es superadmin */}
                {isSuperAdmin ? (
                  <p className="text-purple-700 font-semibold mt-2">
                    Vista administrativa
                  </p>
                ) : enrolledCourseIds.includes(course._id) ? (
                  <p className="text-green-600 font-semibold mt-2">
                    Ya inscrito
                  </p>
                ) : course.currentEnrollments >= course.maxStudents ? (
                  <p className="text-red-600 font-semibold mt-2">
                    Cupo completo
                  </p>
                ) : (
                  <button
                    onClick={() => handleEnroll(course._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-3 rounded"
                  >
                    Inscribirse
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Paginación */}
          <div className="flex justify-between items-center mt-8 border-t pt-4">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="text-sm font-semibold">
              Página {courses.currentPage} de {courses.totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={page === courses.totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-600 italic mt-6 text-center">
          No hay cursos que coincidan con los filtros seleccionados.
        </p>
      )}
    </div>
  );
};

export default AvailableCourses;
