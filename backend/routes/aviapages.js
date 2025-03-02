// routes/aviapages.js - Routes for Aviapages API

const express = require('express');
const router = express.Router();
const { 
  getCharterPrice, 
  searchAircraft, 
  createQuoteRequest, 
  searchAirports, 
  getAircraftClasses, 
  getAircraftDetails 
} = require('../controllers/aviapagesController');
const { protect } = require('../middleware/auth');

// All routes are protected with auth middleware
router.use(protect);

// Charter price endpoint
router.post('/charter-price', getCharterPrice);

// Aircraft search endpoint
router.post('/search-aircraft', searchAircraft);

// Quote request endpoint
router.post('/create-quote', createQuoteRequest);

// Airports search endpoint
router.get('/airports', searchAirports);

// Aircraft classes endpoint
router.get('/aircraft-classes', getAircraftClasses);

// Aircraft details endpoint
router.get('/aircraft/:id', getAircraftDetails);

module.exports = router;