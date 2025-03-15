// routes/emptyLegs.js - Backend routes for empty legs functionality
const express = require('express');
const router = express.Router();
const { 
  getEmptyLegs, 
  searchEmptyLegs, 
  getEmptyLegById,
  bookEmptyLeg,
  createFlightAlert,
  getUserFlightAlerts,
  deleteFlightAlert
} = require('../controllers/emptyLegController');
const { protect } = require('../middleware/auth');

// Public routes - can be accessed without authentication
router.get('/', getEmptyLegs);
router.get('/search', searchEmptyLegs);
router.get('/:id', getEmptyLegById);

// Protected routes - require authentication
router.post('/:id/book', protect, bookEmptyLeg);
router.post('/alerts', protect, createFlightAlert);
router.get('/alerts', protect, getUserFlightAlerts);
router.delete('/alerts/:id', protect, deleteFlightAlert);

module.exports = router;