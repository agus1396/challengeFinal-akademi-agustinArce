const express = require('express')
const auth = require('../middleware/auth')
const checkRole = require('../middleware/role')
const {
  createCourse,
  listCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByProfessor
} = require('../controllers/courseController')

const router = new express.Router()

router.post('/courses', auth, checkRole('profesor'), createCourse)
router.get('/courses', auth, checkRole('alumno', 'superadmin'), listCourses)
router.get('/courses/:id', auth, getCourseById)
router.put('/courses/:id', auth, checkRole('profesor'), updateCourse)
router.delete('/courses/:id', auth, checkRole('profesor'), deleteCourse)
router.get('/courses/professor/me', auth, checkRole('profesor'), getCoursesByProfessor) 
//Cambié el nombre de la ruta courses/professorId porque postman interpreta /professorId como una ruta dinamica

module.exports = router