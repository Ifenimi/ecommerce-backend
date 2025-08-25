const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');




router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', auth.protect, ctrl.getProfile);
router.put('/me', auth.protect, ctrl.updateProfile);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password/:token', ctrl.resetPassword);

module.exports = router;