const express = require('express')
const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController')
const router = new express.Router()

router.post('/auth/register', registerUser)
router.post('/auth/login', loginUser)
router.post('/auth/forgot-password', forgotPassword)
router.post('/auth/reset-password', resetPassword)

module.exports = router