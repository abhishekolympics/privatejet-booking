// controllers/aviapagesController.js - Controller for Aviapages API routes

const aviapagesService = require('../services/aviapagesService');
const asyncHandler = require('express-async-handler');
const logger = require('../utils/logger');

/**
 * @desc    Get charter price
 * @route   POST /api/aviapages/charter-price
 * @access  Private
 */
const getCharterPrice = asyncHandler(async (req, res) => {
  const { legs, aircraft, currency_code } = req.body;
  
  if (!legs || !legs.length) {
    res.status(400);
    throw new Error('Flight legs information is required');
  }

  try {
    const priceData = await aviapagesService.getChapterPrice({
      legs,
      aircraft,
      currency_code: currency_code || 'USD'
    });
    res.json(priceData);
  } catch (error) {
    logger.error(`Charter price error: ${error.message}`);
    res.status(500);
    throw new Error('Error getting charter price');
  }
});

/**
 * @desc    Search available aircraft
 * @route   POST /api/aviapages/search-aircraft
 * @access  Private
 */
const searchAircraft = asyncHandler(async (req, res) => {
  const { legs } = req.body;

  if (!legs || !legs.length) {
    res.status(400);
    throw new Error('Flight legs information is required');
  }

  try {
    const searchResults = await aviapagesService.searchAircraft({
      legs
    });
    res.json(searchResults);
  } catch (error) {
    logger.error(`Aircraft search error: ${error.message}`);
    res.status(500);
    throw new Error('Error searching for aircraft');
  }
});

/**
 * @desc    Create quote request
 * @route   POST /api/aviapages/create-quote
 * @access  Private
 */
const createQuoteRequest = asyncHandler(async (req, res) => {
  const { legs, aircraft, comment, post_to_trip_board, channels } = req.body;
  const { firstName, lastName, email, phone, company } = req.body.account || {};

  if (!legs || !legs.length) {
    res.status(400);
    throw new Error('Flight legs information is required');
  }

  if (!firstName || !lastName) {
    res.status(400);
    throw new Error('First name and last name are required');
  }

  // Prepare the account information for the API
  const account = {
    given_name: firstName,
    family_name: lastName,
    email: email || req.user.email,
    phone: phone || null,
    company: company || null
  };

  try {
    const quoteData = await aviapagesService.createQuoteRequest({
      legs,
      aircraft,
      comment,
      post_to_trip_board: post_to_trip_board || true,
      channels: channels || ["Email"],
      account
    });
    res.json(quoteData);
  } catch (error) {
    logger.error(`Quote request error: ${error.message}`);
    res.status(500);
    throw new Error('Error creating quote request');
  }
});

/**
 * @desc    Search airports
 * @route   GET /api/aviapages/airports
 * @access  Private
 */
const searchAirports = asyncHandler(async (req, res) => {
  const { term } = req.query;

  if (!term || term.length < 2) {
    res.status(400);
    throw new Error('Search term must be at least 2 characters');
  }

  try {
    const airports = await aviapagesService.searchAirports(term);
    res.json(airports);
  } catch (error) {
    logger.error(`Airport search error: ${error.message}`);
    res.status(500);
    throw new Error('Error searching airports');
  }
});

/**
 * @desc    Get aircraft classes
 * @route   GET /api/aviapages/aircraft-classes
 * @access  Private
 */
const getAircraftClasses = asyncHandler(async (req, res) => {
  try {
    const classes = await aviapagesService.getAircraftClasses();
    res.json(classes);
  } catch (error) {
    logger.error(`Aircraft classes error: ${error.message}`);
    res.status(500);
    throw new Error('Error fetching aircraft classes');
  }
});

/**
 * @desc    Get aircraft details
 * @route   GET /api/aviapages/aircraft/:id
 * @access  Private
 */
const getAircraftDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const aircraft = await aviapagesService.getAircraftDetails(id);
    res.json(aircraft);
  } catch (error) {
    logger.error(`Aircraft details error: ${error.message}`);
    res.status(500);
    throw new Error('Error fetching aircraft details');
  }
});

module.exports = {
  getCharterPrice,
  searchAircraft,
  createQuoteRequest,
  searchAirports,
  getAircraftClasses,
  getAircraftDetails
};