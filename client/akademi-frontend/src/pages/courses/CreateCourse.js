import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createCourse } from "../../redux/actions/courseActions";
import BackToDashboardButton from "../../components/BackToDashboardButton";

const CreateCourse = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    level: "",
    category: "",
    maxStudents: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validaciones dinámicas en los campos
    if (name === "price") {
      if (value < 0) return; // evita negativos
    }

    if (name === "maxStudents") {
      if (value < 0 || value.includes(".") || value.includes(",")) return; // sin negativos ni decimales
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "El título es obligatorio";
    if (formData.title.length > 100)
      newErrors.title = "El título es demasiado largo";
    if (!formData.description.trim())
      newErrors.description = "La descripción es obligatoria";

    if (
      !formData.price ||
      isNaN(formData.price) ||
      Number(formData.price) <= 0
    ) {
      newErrors.price = "El precio debe ser un número mayor a 0";
    }

    if (
      !formData.maxStudents ||
      isNaN(formData.maxStudents) ||
      parseInt(formData.maxStudents) < 1 ||
      formData.maxStudents.includes(".")
    ) {
      newErrors.maxStudents = "El cupo debe ser un número entero mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(createCourse(formData))
      .then(() => {
        alert("Curso creado con éxito");

        // Limpiar el formulario
        setFormData({
          title: "",
          description: "",
          price: "",
          level: "",
          category: "",
          maxStudents: "",
        });

        setErrors({});
      })
      .catch((err) => {
        console.error("Error al crear el curso:", err);
        alert("Ocurrió un error al crear el curso.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex justify-center items-start">
      <div className="w-full max-w-md">
        <BackToDashboardButton />
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-md mt-4"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Crear Curso</h2>

          <input
            type="text"
            name="title"
            placeholder="Título del curso"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={100}
            className="mb-1 w-full p-2 border rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mb-2">{errors.title}</p>
          )}

          <textarea
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleChange}
            required
            className="mb-1 w-full p-2 border rounded"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mb-2">{errors.description}</p>
          )}

          <input
            type="number"
            step="0.01"
            name="price"
            placeholder="Precio"
            value={formData.price}
            onChange={handleChange}
            required
            className="mb-1 w-full p-2 border rounded"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mb-2">{errors.price}</p>
          )}

          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="mb-4 w-full p-2 border rounded"
            required
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
            className="mb-4 w-full p-2 border rounded"
            required
          >
            <option value="">Selecciona una categoría</option>
            <option value="Programación">Programación</option>
            <option value="Diseño">Diseño</option>
            <option value="Marketing">Marketing</option>
            <option value="Idiomas">Idiomas</option>
            <option value="Negocios">Negocios</option>
            <option value="Música">Música</option>
            <option value="Otro">Otros</option>
          </select>

          <input
            type="number"
            name="maxStudents"
            placeholder="Cupo máximo"
            value={formData.maxStudents}
            onChange={handleChange}
            required
            className="mb-1 w-full p-2 border rounded"
          />
          {errors.maxStudents && (
            <p className="text-red-500 text-sm mb-2">{errors.maxStudents}</p>
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
          >
            Crear Curso
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
