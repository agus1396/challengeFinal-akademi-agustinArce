const Enrollment = require("../models/enrollment");
const Course = require("../models/course");

// POST /enrollments - Inscribirse a un curso (solo alumno)
const enrollInCourse = async (req, res) => {
  try {
    if (req.user.role !== "alumno") {
      return res
        .status(403)
        .send({ error: "Solo los alumnos pueden inscribirse" });
    }

    const course = await Course.findById(req.body.course);
    if (!course) {
      return res.status(404).send({ error: "Curso no encontrado" });
    }

    // Verificar cuántos alumnos ya están inscritos
    const currentEnrollments = await Enrollment.countDocuments({
      course: course._id,
    });

    // Si se alcanzó el cupo máximo, no permitir la inscripción
    if (currentEnrollments >= course.maxStudents) {
      return res.status(400).send({ error: "Cupo completo para este curso" });
    }

    // Crear inscripción
    const enrollment = new Enrollment({
      student: req.user._id,
      course: req.body.course,
    });

    await enrollment.save();
    res.status(201).send(enrollment);
  } catch (e) {
    if (e.code === 11000) {
      res.status(400).send({ error: "Ya estás inscrito en este curso" });
    } else {
      res.status(400).send({ error: e.message });
    }
  }
};

// GET /enrollments/me - Listar mis inscripciones (solo alumno)
const getMyEnrollments = async (req, res) => {
  try {
    if (req.user.role !== "alumno") {
      return res
        .status(403)
        .send({ error: "Solo los alumnos pueden ver sus inscripciones" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const totalItems = await Enrollment.countDocuments({
      student: req.user._id,
    });

    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate("course")
      .skip(skip)
      .limit(limit);

    res.send({
      data: enrollments,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    });
  } catch (e) {
    res.status(500).send({ error: "Error al obtener las inscripciones" });
  }
};

// DELETE /enrollments/:id - Cancelar inscripción (solo alumno)
const cancelEnrollment = async (req, res) => {
  try {
    if (req.user.role !== "alumno") {
      return res
        .status(403)
        .send({ error: "Solo los alumnos pueden cancelar inscripciones" });
    }

    const enrollment = await Enrollment.findOneAndDelete({
      _id: req.params.id,
      student: req.user._id,
    });

    if (!enrollment) {
      return res
        .status(404)
        .send({ error: "Inscripción no encontrada o no autorizada" });
    }

    res.send(enrollment);
  } catch (e) {
    res.status(500).send({ error: "Error al cancelar la inscripción" });
  }
};

// GET /enrollments/course/me - Ver todas las inscripciones de mis cursos (solo profesor)
const getEnrollmentsByCourse = async (req, res) => {
  try {
    if (req.user.role !== "profesor") {
      return res.status(403).send({
        error: "Solo los profesores pueden ver inscripciones de sus cursos",
      });
    }

    const enrollments = await Enrollment.find()
      .populate({
        path: "course",
        match: { professor: req.user._id },
      })
      .populate("student", "name email");

    const filtered = enrollments.filter((e) => e.course !== null);

    res.send(filtered);
  } catch (e) {
    res.status(500).send({ error: "Error al obtener inscripciones de cursos" });
  }
};

// GET /enrollments/course/:id - Ver inscripciones de un curso puntual
const getEnrollmentsByCourseId = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).send({ error: "Curso no encontrado" });
    }

    if (course.professor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send({ error: "No autorizado para ver este curso" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalItems = await Enrollment.countDocuments({ course: courseId });
    const enrollments = await Enrollment.find({ course: courseId })
      .populate("student", "name email")
      .skip(skip)
      .limit(limit);

    res.send({
      data: enrollments,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    });
  } catch (e) {
    res.status(500).send({ error: "Error al obtener inscripciones del curso" });
  }
};

// GET /enrollments/all - Listar todas las inscripciones (solo superadmin)
const getAllEnrollments = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).send({
        error: "Solo el superadmin puede ver todas las inscripciones",
      });
    }

    const enrollments = await Enrollment.find({})
      .populate("student", "name email")
      .populate("course", "title");

    res.send(enrollments);
  } catch (e) {
    res.status(500).send({ error: "Error al obtener inscripciones" });
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  cancelEnrollment,
  getEnrollmentsByCourse,
  getEnrollmentsByCourseId,
  getAllEnrollments,
};
