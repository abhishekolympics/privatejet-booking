// routes/contact.js
const express = require('express');
const router = express.Router();
const {
  sendContactMessage,
  subscribeNewsletter
} = require('../controllers/contactController');

// Public routes - no authentication required
router.post('/', sendContactMessage);
router.post('/subscribe', subscribeNewsletter);

module.exports = router;