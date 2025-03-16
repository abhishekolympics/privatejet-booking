// routes/aircraft.js
const express = require('express');
const router = express.Router();
const {
  getAircraftByClassFromDb,
  getAircraftByClassFromApi,
  getAircraftById
} = require('../controllers/aircraftController');

// Get aircraft by class from database (quick load)
router.get('/class/:className', getAircraftByClassFromDb);

// Get aircraft by class from API and update db
router.get('/class/:className/api', getAircraftByClassFromApi);

// Get aircraft by ID
router.get('/:id', getAircraftById);

module.exports = router;