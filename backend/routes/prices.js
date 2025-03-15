// routes/prices.js
const express = require('express');
const router = express.Router();
const { 
  getAllPrices, 
  getRoutePrice, 
  triggerPriceUpdate,
  startScheduler,
  stopScheduler
} = require('../controllers/priceController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/empty-legs', getAllPrices);
router.get('/route/:from/:to', getRoutePrice);

// Admin routes
router.post('/update', protect, authorize('admin'), triggerPriceUpdate);
router.post('/scheduler/start', protect, authorize('admin'), startScheduler);
router.post('/scheduler/stop', protect, authorize('admin'), stopScheduler);

module.exports = router;