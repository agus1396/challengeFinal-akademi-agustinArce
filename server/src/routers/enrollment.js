const express = require('express')
const auth = require('../middleware/auth')
const checkRole = require('../middleware/role')
const {
  enrollInCourse,
  getMyEnrollments,
  cancelEnrollment,
  getEnrollmentsByCourse,
  getEnrollmentsByCourseId,
  getAllEnrollments
} = require('../controllers/enrollmentController')

const router = new express.Router()

router.post('/enrollments', auth, checkRole('alumno'), enrollInCourse)
router.get('/enrollments/me', auth, checkRole('alumno'), getMyEnrollments)
router.delete('/enrollments/:id', auth, checkRole('alumno'), cancelEnrollment) 
router.get('/enrollments/course/me', auth, checkRole('profesor'), getEnrollmentsByCourse)
router.get('/enrollments/course/:id', auth, checkRole('profesor'), getEnrollmentsByCourseId);
router.get('/enrollments/all', auth, checkRole('superadmin'), getAllEnrollments)

module.exports = router