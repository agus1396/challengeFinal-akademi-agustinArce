import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentGrades } from "../../redux/actions/gradeActions";
import BackToDashboardButton from "../../components/BackToDashboardButton";

const StudentGrades = () => {
  const dispatch = useDispatch();
  const { grades, loading, error, totalPages, currentPage } = useSelector(
    (state) => state.grade
  );
  const { user } = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);

  // Agrupar calificaciones por curso
  const groupedGrades = (grades?.data || []).reduce((acc, grade) => {
    const courseTitle = grade.course?.title || "Curso eliminado";
    if (!acc[courseTitle]) acc[courseTitle] = [];
    acc[courseTitle].push(grade);
    return acc;
  }, {});

  useEffect(() => {
    if (user?._id) {
      dispatch(getStudentGrades(user._id, page));
    }
  }, [dispatch, user, page]);

  return (
    <div className="p-6">
      <BackToDashboardButton />
      <h1 className="text-2xl font-bold mb-4">Mis Calificaciones</h1>
      {loading ? (
        <p>Cargando calificaciones...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : grades?.data?.length === 0 ? (
        <p>No tienes calificaciones aún.</p>
      ) : (
        <>
          <div className="space-y-6">
            {Object.entries(groupedGrades).map(([courseTitle, grades]) => (
              <div
                key={courseTitle}
                className="bg-white shadow-md p-4 rounded-xl"
              >
                <h2 className="text-xl font-semibold mb-2">{courseTitle}</h2>
                <div className="space-y-2">
                  {grades.map((grade) => (
                    <div key={grade._id} className="border-t pt-2">
                      <p>
                        <strong>Nota:</strong> {grade.score}
                      </p>
                      {grade.observations && (
                        <p>
                          <strong>Observaciones:</strong> {grade.observations}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-4 py-2">{`Página ${page} de ${totalPages}`}</span>
            <button
              onClick={() => setPage(page + 1)}
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

export default StudentGrades;
