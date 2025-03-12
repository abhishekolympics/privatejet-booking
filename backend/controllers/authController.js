// controllers/authController.js - Updated for Password Reset
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const logger = require('../utils/logger');
const emailService = require('../utils/emailService');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone, company } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    company
  });

  if (user) {
    // Generate token
    const token = user.getSignedJwtToken();
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        company: user.company,
        role: user.role,
        preferences: user.preferences
      }
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Match password
  const isMatch = await user.matchPassword(password);
  
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = user.getSignedJwtToken();
  
  res.status(200).json({
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      company: user.company,
      role: user.role,
      preferences: user.preferences
    }
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    company: user.company,
    role: user.role,
    preferences: user.preferences,
    paymentMethods: user.paymentMethods,
    verificationStatus: user.verificationStatus
  });
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email) {
    res.status(400);
    throw new Error('Please provide an email address');
  }

  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    // For security reasons, we still return a 200 even if the email doesn't exist
    // This prevents email enumeration attacks
    return res.status(200).json({ 
      success: true, 
      message: 'If an account exists with that email, a password reset link has been sent' 
    });
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  // Save the user with the reset token and expiry
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';
  const resetUrl = `${clientURL}/reset-password/${resetToken}`;

  try {
    // Send email with reset link
    await emailService.sendPasswordResetEmail(user.email, resetToken, resetUrl);

    res.status(200).json({ 
      success: true, 
      message: 'Password reset email sent' 
    });
  } catch (error) {
    // If sending email fails, clear the reset fields and return error
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    logger.error(`Password reset email error: ${error.message}`);
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:resetToken
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res) => {
  // Get token from params
  const { resetToken } = req.params;
  const { password } = req.body;

  // Validate input
  if (!resetToken || !password) {
    res.status(400);
    throw new Error('Please provide reset token and new password');
  }

  // Hash token to compare with stored hash
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Find user with token that hasn't expired
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  // Set new password (hashing happens in the pre-save middleware)
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // Save the user
  await user.save();

  // Return success response
  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});

/**
 * @desc    Change password for authenticated user
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validate input
  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new password');
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isMatch = await user.matchPassword(currentPassword);
  
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  // Set new password
  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: 'Password updated successfully' });
});