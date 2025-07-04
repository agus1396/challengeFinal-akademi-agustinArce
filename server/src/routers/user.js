const express = require('express')
const auth = require('../middleware/auth')
const checkRole = require('../middleware/role')
const {
    getMyProfile,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    createUserByAdmin
} = require('../controllers/userController')

const router = new express.Router()

router.get('/users/me', auth, getMyProfile)
router.get('/users', auth, checkRole('superadmin'), getAllUsers)
router.get('/users/:id', auth, checkRole('superadmin'), getUserById)
router.put('/users/:id', auth, checkRole('superadmin'), updateUserById)
router.delete('/users/:id', auth, checkRole('superadmin'), deleteUserById)
router.post('/users', auth, checkRole('superadmin'), createUserByAdmin)

module.exports = router