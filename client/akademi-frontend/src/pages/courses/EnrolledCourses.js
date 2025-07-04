import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyEnrollments,
  cancelEnrollment,
  clearEnrollmentError,
} from "../../redux/actions/enrollmentActions";
import BackToDashboardButton from "../../components/BackToDashboardButton";

const EnrolledCourses = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const limit = 3; //Cursos por página

  const { enrollments, loading, error } = useSelector(
    (state) => state.enrollment
  );
  const { data = [], totalPages = 1 } = enrollments || {};

  useEffect(() => {
    dispatch(getMyEnrollments({ page, limit }));
  }, [dispatch, page]);

  const handleCancel = (id) => {
    dispatch(clearEnrollmentError()); // limpiamos el error antes de intentar cancelar

    if (window.confirm("¿Estás seguro de cancelar tu inscripción?")) {
      dispatch(cancelEnrollment(id)).then(() => {
        // Si solo quedaba un curso en la página actual y no es la primera página, retrocedemos una página para evitar pantalla vacía.
        const isLastItemOnPage = data.length === 1;
        const isNotFirstPage = page > 1;

        const newPage = isLastItemOnPage && isNotFirstPage ? page - 1 : page;
        setPage(newPage); // Dispara el useEffect automáticamente
      });
    }
  };

  return (
    <div className="p-6">
      <BackToDashboardButton />
      <h1 className="text-2xl font-bold mb-4">Mis Cursos Inscritos</h1>

      {/* Mostrar errores solo si no está cargando */}
      {!loading && error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 font-medium">
          {error.includes("cancelar") ? error : "Error al cargar tus cursos"}
        </div>
      )}

      {loading ? (
        <p>Cargando cursos...</p>
      ) : data.length === 0 ? (
        <p>No estás inscrito en ningún curso aún.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((enrollment) => {
              const course = enrollment.course;
              if (!course) return null;

              return (
                <div
                  key={enrollment._id}
                  className="bg-white shadow-md p-4 rounded-xl"
                >
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <p>{course.description}</p>
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

                  <button
                    onClick={() => handleCancel(enrollment._id)}
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 mt-2 rounded"
                  >
                    Cancelar inscripción
                  </button>
                </div>
              );
            })}
          </div>

          {/* Controles de paginación */}
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-4 py-2">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EnrolledCourses;
