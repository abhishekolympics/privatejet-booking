// scripts/initEmptyLegs.js
/**
 * This script initializes the empty leg flight data in the database.
 * Run this script when setting up the application for the first time.
 */

const mongoose = require('mongoose');
const EmptyLeg = require('../models/EmptyLeg');
const emptyLegPriceService = require('../services/emptyLegPriceService');
const logger = require('../utils/logger');
require('dotenv').config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    try {
      logger.info('MongoDB Connected');
      
      // Check if we already have data
      const count = await EmptyLeg.countDocuments();
      
      if (count > 0) {
        logger.info(`Found ${count} existing empty leg records. Skipping initialization.`);
        logger.info('To reinitialize, first clear the collection manually.');
      } else {
        logger.info('No existing empty leg flights found. Starting initialization...');
        
        // Initialize with fresh data from the price service
        const result = await emptyLegPriceService.updateAllRoutePrices();
        
        logger.info(`Initialization complete. Added ${result.added} empty leg flights.`);
      }
    } catch (error) {
      logger.error(`Error during initialization: ${error.message}`);
    } finally {
      mongoose.disconnect();
      logger.info('Database connection closed');
    }
  })
  .catch((err) => {
    logger.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  });

// To run this script:
// node scripts/initEmptyLegs.js