const User = require("../models/user");
const Course = require("../models/course");
const Enrollment = require('../models/enrollment'); 
const Grade = require('../models/grade');

// GET/users/me - Ruta protegida que devuelve los datos del usuario autenticado
const getMyProfile = async (req, res) => {
  res.send(req.user);
};

// GET/users - Listar usuarios (solo superadmin)
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const getAllUsers = async (req, res) => {
  try {
    const {
      pageSuperadmin = 1,
      pageProfesor = 1,
      pageAlumno = 1,
      limit = 5,
    } = req.query;

    const parseLimit = parseInt(limit);

    const roles = ["superadmin", "profesor", "alumno"];
    const results = {};

    for (const role of roles) {
      const page = parseInt(req.query[`page${capitalize(role)}`]) || 1;
      const skip = (page - 1) * parseLimit;

      const total = await User.countDocuments({ role });
      const data = await User.find({ role })
        .skip(skip)
        .limit(parseLimit)
        .sort({ name: 1 });

      results[role] = {
        data,
        totalItems: total,
        totalPages: Math.ceil(total / parseLimit),
        currentPage: page,
      };
    }

    res.send(results);
  } catch (e) {
    res.status(500).send({ error: "Error al obtener usuarios" });
  }
};

// GET/users/:id - Detalle de un usuario (solo superadmin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ error: "Usuario no encontrado" });
    res.send(user);
  } catch (e) {
    res.status(500).send({ error: "Error del servidor" });
  }
};

// PUT/users/:id - Editar usuario (solo superadmin)
const updateUserById = async (req, res) => {
  const updates = Object.keys(req.body); // Campos que el request intenta actualizar
  const allowedUpdates = ["name", "email", "password", "role"]; //Campos permitidos
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Actualización no permitida" });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ error: "Usuario no encontrado" });

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.send(user);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

// DELETE/users/:id - Eliminar usuario (solo superadmin)
const deleteUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ error: "Usuario no encontrado" });

    //No eliminar profesores con cursos asignados
    if (user.role === "profesor") {
      const courses = await Course.find({ professor: user._id });
      if (courses.length > 0) {
        return res.status(400).send({
          error: "No se puede eliminar un profesor con cursos asignados",
        });
      }
    }

    // Eliminamos enrollments y grades si el usuario es alumno
    if (user.role === "alumno") {
      await Enrollment.deleteMany({ student: user._id });
      await Grade.deleteMany({ student: user._id });
    }

    // Intentamos eliminar el usuario y capturamos errores del hook post('deleteOne')
    await user.deleteOne().catch((err) => {
      console.error("Error en el hook post-deleteOne:", err);
      throw new Error("Fallo al eliminar el usuario");
    });

    res.send(user);
  } catch (e) {
    console.error("Error interno al eliminar usuario:", e);
    res.status(500).send({ error: "Error interno al eliminar usuario" });
  }
};

// POST/users - Crear profesor (solo superadmin)
const createUserByAdmin = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    if (e.code === 11000) {
      // Error de clave duplicada (email repetido)
      return res
        .status(400)
        .send({ error: "El correo electrónico ya está registrado" });
    }
    res.status(400).send({ error: e.message });
  }
};

module.exports = {
  getMyProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createUserByAdmin,
};
