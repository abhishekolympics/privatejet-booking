// controllers/emptyLegController.js
const EmptyLeg = require('../models/EmptyLeg');
const FlightAlert = require('../models/FlightAlert');
const Booking = require('../models/Booking');
const asyncHandler = require('express-async-handler');
const logger = require('../utils/logger');
const emailService = require('../utils/emailService');
const emptyLegPriceService = require('../services/emptyLegPriceService');

/**
 * @desc    Get all empty leg flights with automatic price update
 * @route   GET /api/empty-legs
 * @access  Public
 */
exports.getEmptyLegs = asyncHandler(async (req, res) => {
  try {
    logger.info('Getting all empty leg flights with automatic price update');
    
    // First, update prices for all routes to ensure we have the latest data
    try {
      // We'll update this asynchronously - don't await, to avoid slowing down the response
      emptyLegPriceService.updateAllRoutePrices()
        .then(result => {
          logger.info(`Auto price update completed: ${result.updated} updated, ${result.added} added`);
        })
        .catch(err => {
          logger.error(`Auto price update error: ${err.message}`);
        });
    } catch (updateError) {
      logger.error(`Error initiating price update: ${updateError.message}`);
      // Continue with the existing data even if the update fails
    }
    
    // Get available empty legs (those that are active and not booked)
    const emptyLegs = await EmptyLeg.find({ 
      isActive: true, 
      isBooked: false,
      departureDateTime: { $gt: new Date() } // Only future flights
    }).sort({ departureDateTime: 1 });
    
    res.status(200).json(emptyLegs);
  } catch (error) {
    logger.error(`Error fetching empty legs: ${error.message}`);
    res.status(500);
    throw new Error('Error fetching empty legs');
  }
});

/**
 * @desc    Search empty legs by criteria with optional price update
 * @route   GET /api/empty-legs/search
 * @access  Public
 */
exports.searchEmptyLegs = asyncHandler(async (req, res) => {
  try {
    const { departure, arrival, date, updatePrices } = req.query;
    
    // If explicitly requested, update prices first
    if (updatePrices === 'true') {
      try {
        // Update prices in the background
        emptyLegPriceService.updateAllRoutePrices()
          .then(result => {
            logger.info(`Manual price update completed for search: ${result.updated} updated, ${result.added} added`);
          })
          .catch(err => {
            logger.error(`Manual price update error during search: ${err.message}`);
          });
      } catch (updateError) {
        logger.error(`Error initiating manual price update: ${updateError.message}`);
        // Continue with search even if update fails
      }
    }
    
    // Build search query
    const query = { 
      isActive: true, 
      isBooked: false,
      departureDateTime: { $gt: new Date() }
    };
    
    // Add search criteria if provided
    if (departure) {
      query.$or = [
        { 'departureAirport.code': { $regex: departure, $options: 'i' } },
        { 'departureAirport.city': { $regex: departure, $options: 'i' } },
        { 'departureAirport.name': { $regex: departure, $options: 'i' } }
      ];
    }
    
    if (arrival) {
      query.$or = query.$or || [];
      query.$or.push(
        { 'arrivalAirport.code': { $regex: arrival, $options: 'i' } },
        { 'arrivalAirport.city': { $regex: arrival, $options: 'i' } },
        { 'arrivalAirport.name': { $regex: arrival, $options: 'i' } }
      );
    }
    
    if (date) {
      // Search flights on or after the provided date
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.departureDateTime = { 
        $gte: searchDate,
        $lt: nextDay
      };
    }
    
    // Execute search
    const emptyLegs = await EmptyLeg.find(query).sort({ departureDateTime: 1 });
    
    res.status(200).json(emptyLegs);
  } catch (error) {
    logger.error(`Error searching empty legs: ${error.message}`);
    res.status(500);
    throw new Error('Error searching empty legs');
  }
});

/**
 * @desc    Get empty leg by ID with price check
 * @route   GET /api/empty-legs/:id
 * @access  Public
 */
exports.getEmptyLegById = asyncHandler(async (req, res) => {
  try {
    const emptyLeg = await EmptyLeg.findById(req.params.id);
    
    if (!emptyLeg) {
      res.status(404);
      throw new Error('Empty leg flight not found');
    }
    
    // Check if the price needs to be updated
    const lastUpdate = new Date(emptyLeg.updatedAt);
    const hoursSinceUpdate = (Date.now() - lastUpdate) / (1000 * 60 * 60);
    
    // Update price if it's been more than 6 hours since the last update
    if (hoursSinceUpdate > 6) {
      try {
        // Get updated price data
        const newPriceData = await emptyLegPriceService.getRoutePrice(
          emptyLeg.departureAirport.code,
          emptyLeg.arrivalAirport.code
        );
        
        // Update only the price-related fields
        emptyLeg.price = newPriceData.price;
        emptyLeg.regularPrice = newPriceData.regularPrice;
        emptyLeg.savingsPercentage = newPriceData.savingsPercentage;
        emptyLeg.updatedAt = new Date();
        
        await emptyLeg.save();
        logger.info(`Updated price for empty leg ${emptyLeg._id}`);
      } catch (updateError) {
        logger.error(`Error updating price for empty leg ${emptyLeg._id}: ${updateError.message}`);
        // Continue with the existing data even if the update fails
      }
    }
    
    res.status(200).json(emptyLeg);
  } catch (error) {
    logger.error(`Error fetching empty leg by ID: ${error.message}`);
    if (error.message === 'Empty leg flight not found') {
      res.status(404);
      throw error;
    } else {
      res.status(500);
      throw new Error('Error fetching empty leg details');
    }
  }
});

/**
 * @desc    Book an empty leg flight
 * @route   POST /api/empty-legs/:id/book
 * @access  Private
 */
exports.bookEmptyLeg = asyncHandler(async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      passengers, 
      specialRequests 
    } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !passengers) {
      res.status(400);
      throw new Error('Please provide all required booking information');
    }
    
    // Check if the empty leg exists and is available
    const emptyLeg = await EmptyLeg.findById(req.params.id);
    
    if (!emptyLeg) {
      res.status(404);
      throw new Error('Empty leg flight not found');
    }
    
    if (emptyLeg.isBooked) {
      res.status(400);
      throw new Error('This flight is already booked');
    }
    
    if (!emptyLeg.isActive) {
      res.status(400);
      throw new Error('This flight is no longer available');
    }
    
    if (emptyLeg.departureDateTime < new Date()) {
      res.status(400);
      throw new Error('Cannot book a flight in the past');
    }
    
    if (passengers > emptyLeg.aircraft.capacity) {
      res.status(400);
      throw new Error(`Maximum ${emptyLeg.aircraft.capacity} passengers allowed`);
    }
    
    // Calculate total price
    const totalPrice = emptyLeg.price * passengers;
    
    // Create a new booking
    const booking = await Booking.create({
      user: req.user.id,
      emptyLegId: emptyLeg._id,
      flightDetails: {
        legs: [{
          departureAirport: emptyLeg.departureAirport,
          arrivalAirport: emptyLeg.arrivalAirport,
          departureDateTime: emptyLeg.departureDateTime,
          passengers
        }]
      },
      aircraft: emptyLeg.aircraft,
      price: {
        amount: totalPrice,
        currency: emptyLeg.currency
      },
      contactInfo: {
        firstName,
        lastName,
        email,
        phone
      },
      specialRequests,
      status: 'confirmed', // Auto-confirm for empty legs
      paymentStatus: 'paid' // For simplicity, mark as paid immediately
    });
    
    // Update the empty leg status
    emptyLeg.isBooked = true;
    emptyLeg.bookedBy = req.user.id;
    await emptyLeg.save();
    
    // Send confirmation email to the user
    try {
      await emailService.sendEmail({
        to: email,
        subject: 'Empty Leg Flight Booking Confirmation',
        text: `
          Dear ${firstName} ${lastName},
          
          Thank you for booking your empty leg flight with PrivateJet!
          
          Booking Details:
          - From: ${emptyLeg.departureAirport.code} (${emptyLeg.departureAirport.city})
          - To: ${emptyLeg.arrivalAirport.code} (${emptyLeg.arrivalAirport.city})
          - Date: ${new Date(emptyLeg.departureDateTime).toLocaleDateString()}
          - Time: ${new Date(emptyLeg.departureDateTime).toLocaleTimeString()}
          - Aircraft: ${emptyLeg.aircraft.type}
          - Passengers: ${passengers}
          - Total Price: ${emptyLeg.currency} ${totalPrice}
          
          Your booking is confirmed. We will contact you shortly with more details about your flight.
          
          Thank you for choosing PrivateJet!
        `,
        html: `
          <h2>Empty Leg Flight Booking Confirmation</h2>
          <p>Dear ${firstName} ${lastName},</p>
          <p>Thank you for booking your empty leg flight with PrivateJet!</p>
          
          <h3>Booking Details:</h3>
          <ul>
            <li><strong>From:</strong> ${emptyLeg.departureAirport.code} (${emptyLeg.departureAirport.city})</li>
            <li><strong>To:</strong> ${emptyLeg.arrivalAirport.code} (${emptyLeg.arrivalAirport.city})</li>
            <li><strong>Date:</strong> ${new Date(emptyLeg.departureDateTime).toLocaleDateString()}</li>
            <li><strong>Time:</strong> ${new Date(emptyLeg.departureDateTime).toLocaleTimeString()}</li>
            <li><strong>Aircraft:</strong> ${emptyLeg.aircraft.type}</li>
            <li><strong>Passengers:</strong> ${passengers}</li>
            <li><strong>Total Price:</strong> ${emptyLeg.currency} ${totalPrice}</li>
          </ul>
          
          <p>Your booking is confirmed. We will contact you shortly with more details about your flight.</p>
          
          <p>Thank you for choosing PrivateJet!</p>
        `
      });
    } catch (emailError) {
      logger.error(`Error sending booking confirmation email: ${emailError.message}`);
      // Don't throw here, as the booking was successful
    }
    
    res.status(201).json(booking);
  } catch (error) {
    logger.error(`Error booking empty leg: ${error.message}`);
    if (error.message === 'Empty leg flight not found') {
      res.status(404);
    } else if (
      error.message.includes('already booked') ||
      error.message.includes('no longer available') ||
      error.message.includes('in the past') ||
      error.message.includes('Maximum')
    ) {
      res.status(400);
    } else {
      res.status(500);
    }
    throw error;
  }
});

/**
 * @desc    Create a flight alert
 * @route   POST /api/empty-legs/alerts
 * @access  Private
 */
exports.createFlightAlert = asyncHandler(async (req, res) => {
  try {
    const { 
      departure, 
      arrival, 
      dateFrom, 
      dateTo, 
      email, 
      notificationType,
      phone
    } = req.body;
    
    // Validate required fields
    if (!departure || !arrival || !dateFrom || !dateTo || !email) {
      res.status(400);
      throw new Error('Please provide all required alert information');
    }
    
    // Validate notification type and phone if SMS notifications are enabled
    if ((notificationType === 'sms' || notificationType === 'both') && !phone) {
      res.status(400);
      throw new Error('Phone number is required for SMS notifications');
    }
    
    // Create flight alert
    const alert = await FlightAlert.create({
      user: req.user.id,
      departure,
      arrival,
      dateFrom: new Date(dateFrom),
      dateTo: new Date(dateTo),
      email,
      notificationType,
      phone,
      isActive: true
    });
    
    res.status(201).json({
      success: true,
      alert
    });
  } catch (error) {
    logger.error(`Error creating flight alert: ${error.message}`);
    if (error.message.includes('Please provide')) {
      res.status(400);
    } else {
      res.status(500);
    }
    throw error;
  }
});

/**
 * @desc    Get user's flight alerts
 * @route   GET /api/empty-legs/alerts
 * @access  Private
 */
exports.getUserFlightAlerts = asyncHandler(async (req, res) => {
  try {
    const alerts = await FlightAlert.find({ 
      user: req.user.id,
      isActive: true
    }).sort({ createdAt: -1 });
    
    res.status(200).json(alerts);
  } catch (error) {
    logger.error(`Error fetching user flight alerts: ${error.message}`);
    res.status(500);
    throw new Error('Error fetching flight alerts');
  }
});

/**
 * @desc    Delete a flight alert
 * @route   DELETE /api/empty-legs/alerts/:id
 * @access  Private
 */
exports.deleteFlightAlert = asyncHandler(async (req, res) => {
  try {
    const alert = await FlightAlert.findById(req.params.id);
    
    if (!alert) {
      res.status(404);
      throw new Error('Flight alert not found');
    }
    
    // Check ownership
    if (alert.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to delete this alert');
    }
    
    // Delete (or deactivate) the alert
    alert.isActive = false;
    await alert.save();
    
    res.status(200).json({
      success: true,
      message: 'Flight alert deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting flight alert: ${error.message}`);
    if (error.message === 'Flight alert not found') {
      res.status(404);
    } else if (error.message.includes('Not authorized')) {
      res.status(401);
    } else {
      res.status(500);
    }
    throw error;
  }
});