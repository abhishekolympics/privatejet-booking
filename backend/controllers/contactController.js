// controllers/contactController.js
const asyncHandler = require('express-async-handler');
const logger = require('../utils/logger');

/**
 * @desc    Send contact form message
 * @route   POST /api/contact
 * @access  Public
 */
exports.sendContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, message, subject } = req.body;

  // Validate request
  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Please provide name, email and message');
  }

  // Log the contact request
  logger.info(`Contact form submission from ${name} (${email})`);

  // TODO: In a production environment, you would:
  // 1. Store the message in the database
  // 2. Send notification email to admin
  // 3. Send confirmation email to user

  // For demo purposes, we'll just simulate a successful submission
  res.status(200).json({
    success: true,
    message: 'Your message has been sent successfully! We will get back to you soon.'
  });
});

/**
 * @desc    Subscribe to newsletter
 * @route   POST /api/contact/subscribe
 * @access  Public
 */
exports.subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Validate request
  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  // Log the subscription
  logger.info(`Newsletter subscription from ${email}`);

  // TODO: Add email to newsletter list
  
  res.status(200).json({
    success: true,
    message: 'Thank you for subscribing to our newsletter!'
  });
});