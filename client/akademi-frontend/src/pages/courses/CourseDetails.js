// Página del detalle de curso para profesores
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEnrollmentsByCourse } from "../../redux/actions/enrollmentActions";
import {
  createGrade,
  updateGrade,
  deleteGrade,
  getGradesByCourse,
} from "../../redux/actions/gradeActions";
import BackToDashboardButton from "../../components/BackToDashboardButton";

const CourseDetails = () => {
  const { id: courseId } = useParams();
  const dispatch = useDispatch();

  const { courseEnrollments, loading, error } = useSelector(
    (state) => state.enrollment
  );
  const { grades } = useSelector((state) => state.grade); // grades de todos los alumnos
  const courseGrades = Array.isArray(grades) ? grades : grades?.data || [];

  const [activeForm, setActiveForm] = useState(null); // enrollmentId que se está editando
  const [scoreInputs, setScoreInputs] = useState({});
  const [observationInputs, setObservationInputs] = useState({});
  const [editingGradeId, setEditingGradeId] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 3; // cantidad de alumnos por página

  // Extraemos el array real desde la paginación
  const enrollmentsData = courseEnrollments?.data || [];
  const totalPages = courseEnrollments?.totalPages || 1;

  useEffect(() => {
    dispatch(getEnrollmentsByCourse(courseId, page, limit));
    dispatch(getGradesByCourse(courseId)); // Cargar todas las notas del curso
  }, [dispatch, courseId, page]);

  const handleSubmit = async (e, enrollmentId, studentId) => {
    e.preventDefault();
    const score = scoreInputs[enrollmentId];
    const observations = observationInputs[enrollmentId] || "";

    if (editingGradeId) {
      await dispatch(
        updateGrade(editingGradeId, {
          score,
          observations,
        })
      );
      alert("Calificación actualizada exitosamente");
      setEditingGradeId(null);
    } else {
      await dispatch(
        createGrade({
          student: studentId,
          course: courseId,
          score,
          observations,
        })
      );
      alert("Calificación cargada exitosamente");
    }

    // Refrescar las notas del curso para ver los cambios reflejados
    dispatch(getGradesByCourse(courseId));

    // Limpiar formularios y cerrar
    setScoreInputs((prev) => ({ ...prev, [enrollmentId]: "" }));
    setObservationInputs((prev) => ({ ...prev, [enrollmentId]: "" }));
    setActiveForm(null);
  };

  const handleDelete = async (gradeId) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar esta calificación?")
    ) {
      await dispatch(deleteGrade(gradeId)); // Esperar la acción
      dispatch(getGradesByCourse(courseId)); // Refrescar las notas visibles
    }
  };

  const getGradesForStudent = (studentId) =>
    courseGrades.filter(
      (g) => g.student._id === studentId && g.course._id === courseId
    );

  return (
    <div className="p-5">
      <BackToDashboardButton />
      <h1 className="text-2xl font-bold mb-4">Detalle del Curso</h1>

      {loading ? (
        <p>Cargando alumnos...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-6">
          {enrollmentsData.length === 0 ? (
            <p>No hay alumnos inscritos.</p>
          ) : (
            enrollmentsData.map((enrollment) => {
              // Evita que crashee ante una inscripción "rota"
              if (!enrollment?.student || !enrollment?.student._id) {
                return (
                  <div
                    key={enrollment._id || Math.random()}
                    className="border rounded p-4 text-red-600"
                  >
                    Inscripción inválida: alumno no disponible
                  </div>
                );
              }

              const studentId = enrollment.student._id;
              const studentGrades = getGradesForStudent(studentId);
              const isFormOpen = activeForm === enrollment._id;

              return (
                <div key={enrollment._id} className="border rounded p-4">
                  <p>
                    <strong>Alumno:</strong> {enrollment.student.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {enrollment.student.email}
                  </p>

                  <div className="mt-2">
                    <button
                      className="text-sm text-blue-600 underline"
                      onClick={() => {
                        if (isFormOpen) {
                          setActiveForm(null);
                          setEditingGradeId(null);
                        } else {
                          setActiveForm(enrollment._id);
                        }
                      }}
                    >
                      {isFormOpen ? "Cancelar" : "Calificar"}
                    </button>
                  </div>

                  {isFormOpen && (
                    <form
                      onSubmit={(e) =>
                        handleSubmit(e, enrollment._id, studentId)
                      }
                      className="mt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0"
                    >
                      <input
                        type="number"
                        min="1"
                        max="10"
                        placeholder="Nota"
                        className="border px-2 py-1 w-24"
                        value={scoreInputs[enrollment._id] || ""}
                        onChange={(e) =>
                          setScoreInputs({
                            ...scoreInputs,
                            [enrollment._id]: e.target.value,
                          })
                        }
                        required
                      />
                      <input
                        type="text"
                        placeholder="Observaciones (opcional)"
                        className="border px-2 py-1 flex-grow"
                        value={observationInputs[enrollment._id] || ""}
                        onChange={(e) =>
                          setObservationInputs({
                            ...observationInputs,
                            [enrollment._id]: e.target.value,
                          })
                        }
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                      >
                        {editingGradeId ? "Actualizar" : "Cargar Nota"}
                      </button>
                    </form>
                  )}

                  {studentGrades.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold mb-2">Notas cargadas:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {studentGrades.map((grade) => (
                          <li key={grade._id}>
                            Nota: <strong>{grade.score}</strong>{" "}
                            {grade.observations && `- "${grade.observations}"`}{" "}
                            <button
                              className="text-sm text-blue-600 underline ml-2"
                              onClick={() => {
                                setActiveForm(enrollment._id);
                                setEditingGradeId(grade._id);
                                setScoreInputs((prev) => ({
                                  ...prev,
                                  [enrollment._id]: grade.score,
                                }));
                                setObservationInputs((prev) => ({
                                  ...prev,
                                  [enrollment._id]: grade.observations,
                                }));
                              }}
                            >
                              Editar
                            </button>
                            <button
                              className="text-sm text-red-600 underline ml-2"
                              onClick={() => handleDelete(grade._id)}
                            >
                              Eliminar
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* PAGINACIÓN */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-3 py-1 font-semibold">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
