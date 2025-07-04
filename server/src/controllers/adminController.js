const User = require("../models/user");
const Course = require("../models/course");
const Enrollment = require("../models/enrollment");

// GET /stats - Estadísticas generales (solo superadmin)
const getStats = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).send({ error: "No autorizado" });
    }

    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    res.send({ totalUsers, totalCourses, totalEnrollments });
  } catch (e) {
    res.status(500).send({ error: "Error al obtener estadísticas" });
  }
};

module.exports = { getStats };
