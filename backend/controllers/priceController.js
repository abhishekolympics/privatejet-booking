// controllers/priceController.js
const emptyLegPriceService = require('../services/emptyLegPriceService');
const priceScheduler = require('../services/priceScheduler');
const asyncHandler = require('express-async-handler');
const logger = require('../utils/logger');

/**
 * @desc    Get latest prices for all empty legs
 * @route   GET /api/prices/empty-legs
 * @access  Public
 */
exports.getAllPrices = asyncHandler(async (req, res) => {
  try {
    // Run the price update to ensure we have the latest data
    await priceScheduler.runNow();
    
    // This will be handled by the emptyLegController for fetching all empty legs
    res.status(200).json({
      success: true,
      message: 'Price update completed, check empty-legs endpoint for latest data'
    });
  } catch (error) {
    logger.error(`Error getting all prices: ${error.message}`);
    res.status(500);
    throw new Error('Error fetching latest prices');
  }
});

/**
 * @desc    Get price for a specific route
 * @route   GET /api/prices/route/:from/:to
 * @access  Public
 */
exports.getRoutePrice = asyncHandler(async (req, res) => {
  try {
    const { from, to } = req.params;
    
    // Get price for specific route
    const priceData = await emptyLegPriceService.getRoutePrice(from, to);
    
    res.status(200).json(priceData);
  } catch (error) {
    logger.error(`Error getting route price: ${error.message}`);
    res.status(500);
    throw new Error(`Error fetching price for route ${req.params.from} to ${req.params.to}`);
  }
});

/**
 * @desc    Manually trigger price update (admin only)
 * @route   POST /api/prices/update
 * @access  Private/Admin
 */
exports.triggerPriceUpdate = asyncHandler(async (req, res) => {
  try {
    const result = await priceScheduler.runNow();
    
    res.status(200).json({
      success: true,
      message: 'Price update triggered successfully',
      result
    });
  } catch (error) {
    logger.error(`Error triggering price update: ${error.message}`);
    res.status(500);
    throw new Error('Error triggering price update');
  }
});

/**
 * @desc    Start the price scheduler (admin only)
 * @route   POST /api/prices/scheduler/start
 * @access  Private/Admin
 */
exports.startScheduler = asyncHandler(async (req, res) => {
  try {
    const { schedule } = req.body;
    priceScheduler.start(schedule);
    
    res.status(200).json({
      success: true,
      message: `Scheduler started with schedule: ${schedule || 'default'}`
    });
  } catch (error) {
    logger.error(`Error starting scheduler: ${error.message}`);
    res.status(500);
    throw new Error('Error starting price scheduler');
  }
});

/**
 * @desc    Stop the price scheduler (admin only)
 * @route   POST /api/prices/scheduler/stop
 * @access  Private/Admin
 */
exports.stopScheduler = asyncHandler(async (req, res) => {
  try {
    priceScheduler.stop();
    
    res.status(200).json({
      success: true,
      message: 'Scheduler stopped successfully'
    });
  } catch (error) {
    logger.error(`Error stopping scheduler: ${error.message}`);
    res.status(500);
    throw new Error('Error stopping price scheduler');
  }
});