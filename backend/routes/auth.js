// routes/auth.js - Updated for Password Reset
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegistration, validateLogin, validatePasswordReset } = require('../middleware/validators');

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', validatePasswordReset, resetPassword);

// Private routes
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

module.exports = router;