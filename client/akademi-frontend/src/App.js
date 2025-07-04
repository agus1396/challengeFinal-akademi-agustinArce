import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import SuperadminDashboard from "./pages/dashboard/SuperadminDashboard";
import ProfessorDashboard from "./pages/dashboard/ProfessorDashboard";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import CreateCourse from "./pages/courses/CreateCourse";
import EditCourse from "./pages/courses/EditCourse";
import AvailableCourses from "./pages/courses/AvailableCourses";
import EnrolledCourses from "./pages/courses/EnrolledCourses";
import StudentGrades from "./pages/grades/StudentGrades";
import CourseDetails from "./pages/courses/CourseDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateProfessorPage from "./pages/superadmin/CreateProfessorPage";
import ListUsersPage from "./pages/superadmin/ListUsersPage";
import ListCoursesPage from "./pages/superadmin/ListCoursesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
              <h1 className="text-4xl font-bold mb-8">
                Akademi - Plataforma Educativa
              </h1>
              <div className="flex gap-4">
                <a
                  href="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-semibold"
                >
                  Iniciar Sesión
                </a>
                <a
                  href="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg font-semibold"
                >
                  Registrarse como Alumno
                </a>
              </div>
            </div>
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route
          path="/dashboard/superadmin"
          element={
            <ProtectedRoute requiredRole="superadmin">
              <SuperadminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profesor"
          element={
            <ProtectedRoute requiredRole="profesor">
              <ProfessorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/alumno"
          element={
            <ProtectedRoute requiredRole="alumno">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/create"
          element={
            <ProtectedRoute requiredRole="profesor">
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/edit/:id"
          element={
            <ProtectedRoute requiredRole="profesor">
              <EditCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-courses"
          element={
            <ProtectedRoute requiredRole="alumno">
              <EnrolledCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grades/student"
          element={
            <ProtectedRoute requiredRole="alumno">
              <StudentGrades />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/available"
          element={
            <ProtectedRoute requiredRole="alumno, superadmin">
              <AvailableCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/details/:id"
          element={
            <ProtectedRoute>
              <CourseDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/grades/student"
          element={
            <ProtectedRoute requiredRole="alumno">
              <StudentGrades />
            </ProtectedRoute>
          }
        />

        <Route
          path="/superadmin/users/create"
          element={
            <ProtectedRoute requiredRole="superadmin">
              <CreateProfessorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/users"
          element={
            <ProtectedRoute role="superadmin">
              <ListUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/courses"
          element={
            <ProtectedRoute requiredRole="superadmin">
              <ListCoursesPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
