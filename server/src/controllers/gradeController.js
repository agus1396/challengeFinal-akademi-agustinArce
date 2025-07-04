const Grade = require("../models/grade");
const Course = require("../models/course");
const Enrollment = require("../models/enrollment");
const mongoose = require("mongoose");

// POST /grades - Cargar calificación (solo profesor)
const createGrade = async (req, res) => {
  try {
    const { student, course, score, observations } = req.body;

    // Verificar que el usuario sea profesor
    if (req.user.role !== "profesor") {
      return res
        .status(403)
        .send({ error: "Solo los profesores pueden cargar calificaciones" });
    }

    // Verificar que el curso exista y lo haya creado el profesor actual
    const courseObj = await Course.findOne({
      _id: course,
      professor: req.user._id,
    });
    if (!courseObj) {
      return res
        .status(403)
        .send({ error: "No autorizado para calificar este curso" });
    }

    // Verificar que el alumno esté inscrito en el curso
    const isEnrolled = await Enrollment.findOne({ student, course });
    if (!isEnrolled) {
      return res
        .status(400)
        .send({ error: "El alumno no está inscrito en este curso" });
    }

    // ✅ Validar que no haya más de 10 notas para este alumno en este curso
    const existingGrades = await Grade.find({ student, course });
    if (existingGrades.length >= 10) {
      return res
        .status(400)
        .send({ error: "Ya hay 10 notas para este alumno en este curso" });
    }

    // Crear la calificación
    const grade = new Grade({ student, course, score, observations });
    await grade.save();
    res.status(201).send(grade);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

// PUT /grades/:id - Editar calificación (solo profesor)
const updateGrade = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["score", "observations"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: "Actualización no permitida" });
  }

  try {
    const grade = await Grade.findById(req.params.id).populate("course");

    if (!grade)
      return res.status(404).send({ error: "Calificación no encontrada" });

    // Verificar que el profesor que intenta editar sea el creador del curso
    if (grade.course.professor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send({ error: "No autorizado para editar esta calificación" });
    }

    updates.forEach((update) => (grade[update] = req.body[update]));
    await grade.save();
    res.send(grade);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

// GET /grades/student/:id - Ver calificaciones de un alumno
const getGradesByStudent = async (req, res) => {
  try {
    const isProfessor = req.user.role === "profesor";
    const isOwnerStudent =
      req.user.role === "alumno" && req.user._id.toString() === req.params.id;

    if (!isProfessor && !isOwnerStudent) {
      return res
        .status(403)
        .send({ error: "No autorizado para ver estas calificaciones" });
    }

    const { page = 1, limit = 2 } = req.query; // paginamos por bloques de cursos
    const studentId = req.params.id;

    // 🔽 Obtener todos los cursos únicos en los que este alumno tiene calificaciones
    const uniqueCourses = await Grade.aggregate([
      { $match: { student: new mongoose.Types.ObjectId(studentId) } },
      {
        $group: {
          _id: "$course",
        },
      },
      // 🔠 Ordenar los cursos por nombre (título del curso)
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "courseInfo",
        },
      },
      { $unwind: "$courseInfo" },
      { $sort: { "courseInfo.title": 1 } }, // orden alfabético por título
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
    ]);

    const courseIds = uniqueCourses.map((c) => c._id);

    // Buscar las calificaciones del alumno en esos cursos
    const grades = await Grade.find({
      student: studentId,
      course: { $in: courseIds },
    })
      .populate("course", "title")
      .populate("student", "name email");

    // Total de cursos únicos del alumno (sin paginar)
    const totalCourses = await Grade.distinct("course", {
      student: studentId,
    });

    // Enviar respuesta paginada y ordenada
    res.send({
      data: grades,
      totalCourses: totalCourses.length,
      totalPages: Math.ceil(totalCourses.length / limit),
      currentPage: parseInt(page),
    });
  } catch (e) {
    res.status(500).send({ error: "Error al obtener calificaciones" });
  }
};

// Enpoints no pedidos en el PDF pero agregados para mejor función

// GET - /grades/course/:id
const getGradesByCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      professor: req.user._id,
    });
    if (!course)
      return res
        .status(403)
        .send({ error: "No autorizado para ver estas calificaciones" });

    const grades = await Grade.find({ course: req.params.id })
      .populate("student", "name email")
      .populate("course", "title");

    res.send(grades);
  } catch (e) {
    res
      .status(500)
      .send({ error: "Error al obtener calificaciones del curso" });
  }
};

// DELETE /grades/:id - Eliminar calificación (solo profesor)
const deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id).populate("course");

    if (!grade) {
      return res.status(404).send({ error: "Calificación no encontrada" });
    }

    // Validar que el curso pertenezca al profesor autenticado
    if (grade.course.professor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send({ error: "No autorizado para eliminar esta calificación" });
    }

    await grade.deleteOne();
    res.send({ message: "Calificación eliminada correctamente" });
  } catch (e) {
    res.status(500).send({ error: "Error al eliminar la calificación" });
  }
};

module.exports = {
  createGrade,
  updateGrade,
  getGradesByStudent,
  getGradesByCourse,
  deleteGrade,
};
