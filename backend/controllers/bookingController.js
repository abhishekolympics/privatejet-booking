// controllers/bookingController.js
const Booking = require('../models/Booking');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const logger = require('../utils/logger');
const aviapagesService = require('../services/aviapagesService');

/**
 * @desc    Get all bookings for logged in user
 * @route   GET /api/bookings
 * @access  Private
 */
exports.getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.status(200).json(bookings);
});

/**
 * @desc    Get single booking
 * @route   GET /api/bookings/:id
 * @access  Private
 */
exports.getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Make sure user owns booking
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to access this booking');
  }

  res.status(200).json(booking);
});

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Private
 */
exports.createBooking = asyncHandler(async (req, res) => {
  try {
    const {
      flightDetails,
      aircraft,
      price,
      contactInfo,
      paymentInfo,
      specialRequests
    } = req.body;

    // Validate required fields
    if (!flightDetails || !aircraft || !price || !contactInfo) {
      res.status(400);
      throw new Error('Please provide all required booking details');
    }

    // Create booking in database
    const booking = await Booking.create({
      user: req.user.id,
      quoteRequestId: flightDetails.quoteRequestId || Date.now(), // Use quote ID if available or generate a temporary one
      status: 'pending',
      price: {
        amount: price.price || price.amount,
        currency: price.currency_code || price.currency
      },
      paymentStatus: 'unpaid',
      flightDetails: {
        legs: flightDetails.legs.map(leg => ({
          departureAirport: leg.departure_airport,
          arrivalAirport: leg.arrival_airport,
          departureDateTime: leg.departure_datetime,
          passengers: leg.pax
        }))
      },
      aircraft: {
        id: aircraft.id,
        registration: aircraft.registration_number || aircraft.tail_number,
        type: aircraft.aircraft_type,
        class: aircraft.aircraft_class,
        maxPassengers: aircraft.passengers_max,
        company: aircraft.company,
        images: aircraft.images ? 
          aircraft.images.map(img => typeof img === 'string' ? img : img.url || img.path) : []
      },
      contactInfo: {
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        company: contactInfo.company
      },
      specialRequests: specialRequests,
      apiResponses: {
        priceResponse: price,
        quoteResponse: flightDetails,
        aircraftResponse: aircraft
      }
    });

    if (booking) {
      // TODO: Handle payment processing

      // For demo purposes, mark as confirmed
      booking.status = 'confirmed';
      booking.paymentStatus = 'paid';
      booking.paymentId = 'demo_payment_' + Date.now();
      await booking.save();
      
      res.status(201).json(booking);
    } else {
      res.status(400);
      throw new Error('Invalid booking data');
    }
  } catch (error) {
    logger.error(`Booking creation error: ${error.message}`);
    res.status(400);
    throw new Error(error.message || 'Error creating booking');
  }
});

/**
 * @desc    Update booking status
 * @route   PATCH /api/bookings/:id
 * @access  Private
 */
exports.updateBooking = asyncHandler(async (req, res) => {
  const { status, paymentStatus, specialRequests } = req.body;

  // Find booking
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check ownership
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this booking');
  }

  // Update fields if provided
  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;
  if (specialRequests) booking.specialRequests = specialRequests;

  // Save updated booking
  await booking.save();

  res.status(200).json(booking);
});

/**
 * @desc    Cancel booking
 * @route   DELETE /api/bookings/:id
 * @access  Private
 */
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check ownership
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to cancel this booking');
  }

  // Check if booking can be cancelled
  if (booking.status === 'completed') {
    res.status(400);
    throw new Error('Completed bookings cannot be cancelled');
  }

  // Update booking status to cancelled
  booking.status = 'cancelled';
  await booking.save();

  res.status(200).json({ success: true, message: 'Booking cancelled' });
});