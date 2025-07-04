import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/actions/authActions";
import { useNavigate, Link } from "react-router-dom";
import BackToHomeButton from "../../components/BackToHomeButton";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user, token } = useSelector((state) => state.auth);
  console.log(token);

  const handleSubmit = (e) => {
    e.preventDefault(); //Evita que se recargue la página
    dispatch(login(email, password));
  };

  // Redirección solo cuando haya usuario autenticado
  useEffect(() => {
    if (user && token) {
      if (user.role === "superadmin") {
        navigate("/dashboard/superadmin");
      } else if (user.role === "profesor") {
        navigate("/dashboard/profesor");
      } else {
        navigate("/dashboard/alumno");
      }
    }
  }, [user, token, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <BackToHomeButton />
      <div className="flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-80"
        >
          <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-3 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-3 border rounded"
            required
          />
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
          <p className="mt-4 text-sm text-center">
            ¿Olvidaste tu contraseña?{" "}
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline font-medium"
            >
              Recuperarla
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
