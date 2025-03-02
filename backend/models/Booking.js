// models/Booking.js - Mongoose model for bookings

const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quoteRequestId: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true,
      default: 'USD'
    }
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'processing', 'paid', 'refunded'],
    default: 'unpaid'
  },
  paymentId: {
    type: String
  },
  flightDetails: {
    legs: [
      {
        departureAirport: {
          id: Number,
          icao: String,
          iata: String,
          name: String,
          city: {
            name: String
          },
          country: {
            name: String
          }
        },
        arrivalAirport: {
          id: Number,
          icao: String,
          iata: String,
          name: String,
          city: {
            name: String
          },
          country: {
            name: String
          }
        },
        departureDateTime: {
          type: Date,
          required: true
        },
        passengers: {
          type: Number,
          required: true
        }
      }
    ]
  },
  aircraft: {
    id: Number,
    registration: String,
    type: String,
    class: String,
    maxPassengers: Number,
    company: {
      id: Number,
      name: String
    },
    images: [String]
  },
  contactInfo: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: String,
    company: String
  },
  specialRequests: {
    type: String
  },
  apiResponses: {
    priceResponse: Object,
    quoteResponse: Object,
    aircraftResponse: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the timestamp before saving
BookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);