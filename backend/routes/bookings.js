// routes/bookings.js
const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validators');

// All routes require authentication
router.use(protect);

// Get all bookings & create new booking
router.route('/')
  .get(getBookings)
  .post(validateBooking, createBooking);

// Get, update and cancel specific booking
router.route('/:id')
  .get(getBooking)
  .patch(updateBooking)
  .delete(cancelBooking);

module.exports = router;