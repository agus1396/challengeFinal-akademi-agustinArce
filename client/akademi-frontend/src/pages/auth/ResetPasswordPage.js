import React, { useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const { token } = useParams(); 
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("/auth/reset-password", {
        token,
        newPassword,
      });
      setMessage(response.data.message);
    } catch (err) {
      setError(
        err.response?.data?.error || "Error al restablecer la contraseña."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">
          Restablecer Contraseña
        </h2>

        {message && <p className="text-green-600 mb-3">{message}</p>}
        {error && <p className="text-red-600 mb-3">{error}</p>}

        <label className="block mb-2 font-semibold">Nueva Contraseña</label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
        >
          Cambiar Contraseña
        </button>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-600 hover:underline text-sm">
            Volver al login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
