// middleware/validators.js
const { check, validationResult } = require('express-validator');

/**
 * Registration validation
 */
exports.validateRegistration = [
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Login validation
 */
exports.validateLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Profile update validation
 */
exports.validateProfileUpdate = [
  check('firstName', 'First name cannot be empty if provided').optional().not().isEmpty(),
  check('lastName', 'Last name cannot be empty if provided').optional().not().isEmpty(),
  check('phone', 'Phone number format is invalid').optional().isMobilePhone(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Booking creation validation
 */
exports.validateBooking = [
  check('flightDetails', 'Flight details are required').not().isEmpty(),
  check('flightDetails.legs', 'At least one flight leg is required').isArray({ min: 1 }),
  check('aircraft', 'Aircraft details are required').not().isEmpty(),
  check('price', 'Price information is required').not().isEmpty(),
  check('contactInfo', 'Contact information is required').not().isEmpty(),
  check('contactInfo.firstName', 'First name is required').not().isEmpty(),
  check('contactInfo.lastName', 'Last name is required').not().isEmpty(),
  check('contactInfo.email', 'Valid email is required').isEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Payment method validation
 */
exports.validatePaymentMethod = [
  check('type', 'Payment method type is required').not().isEmpty(),
  check('cardNumber', 'Valid card number is required').if(body => body.type === 'card').isLength({ min: 13, max: 19 }),
  check('expiryDate', 'Valid expiry date is required in format MM/YY').if(body => body.type === 'card').matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/),
  check('nameOnCard', 'Name on card is required').if(body => body.type === 'card').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];