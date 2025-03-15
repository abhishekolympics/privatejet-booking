// models/EmptyLeg.js
const mongoose = require("mongoose");

const AirportSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  { _id: false }
);

const AircraftSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      enum: [
        "Light",
        "Midsize",
        "Super Midsize", // This value needs to match exactly
        "Heavy",
        "Ultra long range",
      ],
    },
    capacity: {
      type: Number,
      required: true,
    },
    registration: {
      type: String,
    },
    year: {
      type: Number,
    },
    company: {
      id: Number,
      name: String,
    },
    images: [String],
  },
  { _id: false }
);

const EmptyLegSchema = new mongoose.Schema({
  departureAirport: {
    type: AirportSchema,
    required: true,
  },
  arrivalAirport: {
    type: AirportSchema,
    required: true,
  },
  departureDateTime: {
    type: Date,
    required: true,
  },
  estimatedArrivalTime: {
    type: Date,
  },
  aircraft: {
    type: AircraftSchema,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "USD",
    required: true,
  },
  regularPrice: {
    type: Number,
    required: true,
  },
  savingsPercentage: {
    type: Number,
    required: true,
  },
  availableUntil: {
    type: Date,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  flightDuration: {
    type: Number, // Duration in minutes
    required: true,
  },
  distance: {
    type: Number, // Distance in nautical miles
    required: true,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the timestamp before saving
EmptyLegSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate savings percentage if not provided
EmptyLegSchema.pre("save", function (next) {
  if (!this.savingsPercentage && this.regularPrice && this.price) {
    this.savingsPercentage = Math.round(
      ((this.regularPrice - this.price) / this.regularPrice) * 100
    );
  }
  next();
});

module.exports = mongoose.model("EmptyLeg", EmptyLegSchema);
