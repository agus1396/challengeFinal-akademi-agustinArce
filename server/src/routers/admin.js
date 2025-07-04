const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');
const { getStats } = require('../controllers/adminController');

router.get('/stats', auth, checkRole('superadmin'), getStats);

module.exports = router;