import { useNavigate } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Encabezado con logout */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard de Alumno</h1>
        <LogoutButton />
      </div>
      <hr className="border-gray-300 mb-6" />

      {/* Botones de navegación */}
      <div className="flex flex-wrap gap-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/courses/available")}
        >
          Ver Catálogo de Cursos
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => navigate("/my-courses")}
        >
          Ver Mis Cursos
        </button>
        <button
          onClick={() => navigate("/grades/student")}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Mis Calificaciones
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
