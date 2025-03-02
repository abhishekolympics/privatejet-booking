// utils/helpers.js
const crypto = require('crypto');

/**
 * Generate a random string
 * @param {number} length - Length of the random string
 * @returns {string} - Random string
 */
exports.generateRandomString = (length = 20) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date
 */
exports.formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Format price with currency
 * @param {number} price - Price to format
 * @param {string} currency - Currency code
 * @returns {string} - Formatted price
 */
exports.formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(price);
};

/**
 * Calculate flight duration in minutes
 * @param {string} departureDateTime - Departure date and time
 * @param {string} arrivalDateTime - Arrival date and time
 * @returns {number} - Duration in minutes
 */
exports.calculateFlightDuration = (departureDateTime, arrivalDateTime) => {
  const departure = new Date(departureDateTime);
  const arrival = new Date(arrivalDateTime);
  
  const durationMs = arrival - departure;
  return Math.round(durationMs / (1000 * 60));
};

/**
 * Check if a booking can be cancelled
 * @param {Object} booking - Booking object
 * @returns {boolean} - Whether booking can be cancelled
 */
exports.canCancelBooking = (booking) => {
  // Can't cancel completed bookings
  if (booking.status === 'completed') return false;
  
  // Check if departure date is within 24 hours
  const departureDate = new Date(booking.flightDetails.legs[0].departureDateTime);
  const now = new Date();
  const hoursUntilDeparture = (departureDate - now) / (1000 * 60 * 60);
  
  // Can't cancel if less than 24 hours until departure
  return hoursUntilDeparture >= 24;
};

/**
 * Generate a slug from a string
 * @param {string} text - Text to convert to slug
 * @returns {string} - Slug
 */
exports.generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
exports.isValidEmail = (email) => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(String(email).toLowerCase());
};

/**
 * Mask a credit card number
 * @param {string} cardNumber - Credit card number to mask
 * @returns {string} - Masked credit card number
 */
exports.maskCardNumber = (cardNumber) => {
  return cardNumber.replace(/\s/g, '').replace(/\d(?=\d{4})/g, '*');
};