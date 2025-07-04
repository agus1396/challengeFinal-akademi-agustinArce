const Course = require("../models/course");
const Enrollment = require("../models/enrollment");

// POST/courses - Crear un curso (solo profesores)
const createCourse = async (req, res) => {
  try {
    if (req.user.role !== "profesor") {
      return res
        .status(403)
        .send({ error: "Solo los profesores pueden crear cursos" });
    }

    const course = new Course({
      ...req.body,
      professor: req.user._id,
    });

    await course.save();
    res.status(201).send(course);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

// GET /courses - Listar todos los cursos (alumnos y superadmin)
const listCourses = async (req, res) => {
  try {
    console.log("Usuario autenticado:", req.user);

    // Solo alumnos y superadmin pueden ver cursos
    if (req.user.role !== "alumno" && req.user.role !== "superadmin") {
      return res
        .status(403)
        .send({ error: "No autorizado para ver los cursos" });
    }

    // Extraer filtros desde query params
    const {
      search = "", // Título o descripción
      category,
      level,
      minPrice,
      maxPrice,
      page = 1,
      limit = 3,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construcción dinámica del filtro
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    // Total de cursos filtrados
    const totalItems = await Course.countDocuments(filter);

    // Cursos paginados + filtrados
    const courses = await Course.find(filter)
      .sort({ "professor.name": 1, title: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("professor", "name email")
      .lean(); // 💡 Convertir a objeto JS plano

    // Agregar currentEnrollments a cada curso
    for (const course of courses) {
      course.currentEnrollments = await Enrollment.countDocuments({
        course: course._id,
      });
    }

    // Respuesta completa
    res.send({
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: parseInt(page),
      data: courses,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Error al obtener los cursos" });
  }
};

// GET/courses/:id - Obtener detalle de curso
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "professor",
      "name email"
    );
    if (!course) return res.status(404).send({ error: "Curso no encontrado" });
    res.send(course);
  } catch (e) {
    res.status(500).send({ error: "Error al obtener el curso" });
  }
};

// PUT /courses/:id - Editar curso (solo profesor que lo creó)
const updateCourse = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "title",
    "description",
    "maxStudents",
    "category",
    "price",
    "level",
  ];
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid)
    return res.status(400).send({ error: "Actualización no permitida" });

  try {
    const course = await Course.findOne({
      _id: req.params.id,
      professor: req.user._id,
    });
    if (!course)
      return res
        .status(404)
        .send({ error: "Curso no encontrado o no autorizado" });

    // ⚠️ Validar si se intenta reducir el cupo máximo a menos de los inscriptos actuales
    if (updates.includes("maxStudents")) {
      const currentEnrollments = await Enrollment.countDocuments({
        course: course._id,
      });

      if (req.body.maxStudents < currentEnrollments) {
        return res.status(400).send({
          error: `No se puede establecer un cupo menor a los ${currentEnrollments} alumnos ya inscritos.`,
        });
      }
    }

    // Aplicar actualizaciones permitidas
    updates.forEach((update) => (course[update] = req.body[update]));
    await course.save();

    res.send(course);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

// DELETE/courses/:id - Eliminar curso (solo profesor que lo creó)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).send({ error: "Curso no encontrado" });
    }

    if (course.professor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send({ error: "No estás autorizado para eliminar este curso" });
    }

    //await course.deleteOne();
    await Course.findByIdAndDelete(req.params.id);
    res.send({ message: "Curso eliminado con éxito" });
  } catch (e) {
    res.status(500).send({ error: "Error al eliminar curso" });
  }
};

// GET/courses/professorId - Listado de cursos dados de alta por él (solo profesor)
const getCoursesByProfessor = async (req, res) => {
  try {
    if (req.user.role !== "profesor") {
      return res.status(403).send({ error: "No autorizado" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const totalItems = await Course.countDocuments({ professor: req.user._id });

    // Traer cursos creados por el profesor con paginación
    const courses = await Course.find({ professor: req.user._id })
      .skip(skip)
      .limit(limit)
      .lean(); // lean permite modificar

    // Por cada curso, contar inscriptos
    const coursesWithCounts = await Promise.all(
      courses.map(async (course) => {
        const count = await Enrollment.countDocuments({ course: course._id });
        return { ...course, inscriptionCount: count };
      })
    );

    res.send({
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      data: coursesWithCounts,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Error al obtener cursos del profesor" });
  }
};

module.exports = {
  createCourse,
  listCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByProfessor,
};
