import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProfessor } from "../../redux/actions/userActions";
import { useNavigate } from "react-router-dom";
import BackToDashboardButton from "../../components/BackToDashboardButton";

const CreateProfessorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "profesor",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    const success = await dispatch(createProfessor(formData));

    if (success) {
      setSuccessMessage("✅ Profesor creado exitosamente");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "profesor",
      });

      setTimeout(() => {
        navigate("/dashboard/superadmin");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Botón alineado a la izquierda */}
      <div className="mb-4">
        <BackToDashboardButton />
      </div>

      {/* Contenedor del formulario centrado */}
      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-md w-96"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Registro de Profesor
          </h2>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre"
            required
            className="mb-4 w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            required
            className="mb-4 w-full p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña (mínimo 6 caracteres)"
            required
            minLength={6}
            className="mb-4 w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
          {loading && <p className="text-gray-500 mb-2 text-sm">Cargando...</p>}
          {successMessage && (
            <p className="text-green-600 font-semibold mb-2 text-sm">
              {successMessage}
            </p>
          )}
          <button
            type="submit"
            className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700"
          >
            Crear Profesor
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfessorPage;
