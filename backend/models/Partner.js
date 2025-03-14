// models/Partner.js
const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Partner name is required'],
    trim: true
  },
  partnerType: {
    type: String,
    enum: [
      'Aircraft Operator',
      'Broker',
      'FBO Services',
      'MRO Provider',
      'Technology Provider',
      'Catering',
      'Ground Transportation',
      'Insurance Provider',
      'Other'
    ],
    required: [true, 'Partner type is required']
  },
  location: {
    type: String,
    trim: true
  },
  logo: {
    type: String
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  fullDescription: {
    type: String
  },
  services: {
    type: [String]
  },
  fleet: {
    type: [String]
  },
  features: {
    type: [String]
  },
  website: {
    type: String,
    trim: true,
    match: [
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
      'Please enter a valid URL'
    ]
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metaData: {
    type: Map,
    of: String
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
PartnerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Partner', PartnerSchema);