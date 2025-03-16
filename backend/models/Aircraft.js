// models/Aircraft.js
const mongoose = require('mongoose');

// Image Schema (embedded document)
const ImageSchema = new mongoose.Schema({
  id: Number,
  path: String,
  position: Number,
  tag: String
}, { _id: false });

// Features Schema (embedded document)
const FeaturesSchema = new mongoose.Schema({
  cabinCrew: Boolean,
  lavatory: Boolean,
  hotMeal: Boolean,
  wirelessInternet: Boolean,
  entertainmentSystem: Boolean,
  petsAllowed: Boolean,
  smoking: Boolean,
  luggageVolume: Number,
  shower: Boolean,
  satellitePhone: Boolean,
  sleepingPlaces: Number
}, { _id: false });

// Aircraft Schema
const AircraftSchema = new mongoose.Schema({
  aircraftId: {
    type: Number,
    required: true,
    unique: true
  },
  aircraftType: {
    id: Number,
    name: String,
    icao: String,
    class: {
      id: Number,
      name: String
    }
  },
  company: {
    id: Number,
    name: String
  },
  baseAirport: {
    id: Number,
    name: String,
    city: String,
    country: String,
    icao: String
  },
  passengersMax: Number,
  registrationNumber: String,
  yearOfProduction: Number,
  serialNumber: String,
  isForCharter: {
    type: Boolean,
    default: true
  },
  isForSale: {
    type: Boolean,
    default: false
  },
  description: String,
  features: FeaturesSchema,
  images: [ImageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for faster queries
AircraftSchema.index({ 'aircraftType.class.name': 1 });
AircraftSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Aircraft', AircraftSchema);