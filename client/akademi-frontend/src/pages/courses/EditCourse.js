import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, updateCourse } from "../../redux/actions/courseActions";
import BackToDashboardButton from "../../components/BackToDashboardButton";

const EditCourse = () => {
  const { id } = useParams(); // Obtenemos el ID del curso desde la URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { course, loading } = useSelector((state) => state.course);

  // Estado local del formulario
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    level: "",
    category: "",
    maxStudents: "",
  });

  // 1. Obtener los datos del curso al montar el componente
  useEffect(() => {
    dispatch(getCourseById(id));
  }, [dispatch, id]);

  // 2. Rellenar el formulario cuando tengamos el curso correcto
  useEffect(() => {
    if (course && course._id === id) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        price: course.price || "",
        level: course.level || "",
        category: course.category || "",
        maxStudents: course.maxStudents || "",
      });
    }
  }, [course, id]);

  // 3. Limpieza opcional al desmontar (evita datos viejos si cambiás de curso)
  useEffect(() => {
    return () => {
      dispatch({ type: "GET_COURSE_BY_ID_SUCCESS", payload: null });
    };
  }, [dispatch]);

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price" && value < 0) return;
    if (
      name === "maxStudents" &&
      (value < 0 || value.includes(".") || value.includes(","))
    )
      return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentEnrollments = course.currentEnrollments || 0;
    const newMax = parseInt(formData.maxStudents);

    if (newMax < currentEnrollments) {
      alert(
        `No puedes reducir el cupo máximo a menos de ${currentEnrollments} estudiantes ya inscritos.`
      );
      return;
    }

    try {
      await dispatch(updateCourse(id, formData));
      alert("Curso actualizado con éxito");
      navigate("/dashboard/profesor");
    } catch (err) {
      alert(err.message);
    }
  };

  // Mientras carga, mostramos mensaje
  if (loading || !course || course._id !== id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando curso...</p>
      </div>
    );
  }

  // Formulario
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Botón de volver arriba a la izquierda */}
      <BackToDashboardButton />

      {/* Contenedor centrado del formulario */}
      <div className="flex justify-center items-start mt-4">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded shadow-md"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              Editar Curso
            </h2>

            <input
              type="text"
              name="title"
              placeholder="Título del curso"
              value={formData.title}
              onChange={handleChange}
              required
              className="mb-2 w-full p-2 border rounded"
            />

            <textarea
              name="description"
              placeholder="Descripción"
              value={formData.description}
              onChange={handleChange}
              required
              className="mb-2 w-full p-2 border rounded"
            />

            <input
              type="number"
              step="0.1"
              name="price"
              placeholder="Precio"
              value={formData.price}
              onChange={handleChange}
              required
              className="mb-2 w-full p-2 border rounded"
            />

            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
              className="mb-2 w-full p-2 border rounded"
            >
              <option value="">Selecciona un nivel</option>
              <option value="Inicial">Inicial</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mb-2 w-full p-2 border rounded"
            >
              <option value="">Selecciona una categoría</option>
              <option value="Programación">Programación</option>
              <option value="Diseño">Diseño</option>
              <option value="Marketing">Marketing</option>
              <option value="Idiomas">Idiomas</option>
              <option value="Negocios">Negocios</option>
              <option value="Música">Música</option>
              <option value="Otro">Otro</option>
            </select>

            <input
              type="number"
              name="maxStudents"
              placeholder="Cupo máximo"
              value={formData.maxStudents}
              onChange={handleChange}
              required
              className="mb-4 w-full p-2 border rounded"
            />

            <button
              type="submit"
              className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
            >
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
