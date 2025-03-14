// routes/partners.js - Backend routes for partners functionality
const express = require('express');
const router = express.Router();
const { 
  getPartners, 
  getPartnerById, 
  searchPartners,
  contactPartner 
} = require('../controllers/partnerController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getPartners);
router.get('/search', searchPartners);
router.get('/:id', getPartnerById);

// Protected routes
router.post('/:id/contact', protect, contactPartner);

module.exports = router;