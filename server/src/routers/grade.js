const express = require("express");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/role");
const {
  createGrade,
  updateGrade,
  getGradesByStudent,
  getGradesByCourse,
  deleteGrade,
} = require("../controllers/gradeController");

const router = new express.Router();

router.post("/grades", auth, checkRole("profesor"), createGrade);
router.put("/grades/:id", auth, checkRole("profesor"), updateGrade);
router.get("/grades/student/:id", auth, getGradesByStudent);
router.get("/grades/course/:id", auth, checkRole("profesor"), getGradesByCourse);
router.delete("/grades/:id", auth, checkRole("profesor"), deleteGrade);

module.exports = router;
