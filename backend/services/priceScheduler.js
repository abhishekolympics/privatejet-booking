// services/priceScheduler.js
const cron = require('node-cron');
const emptyLegPriceService = require('./emptyLegPriceService');
const logger = require('../utils/logger');

/**
 * Service to handle scheduling of price updates
 */
class PriceScheduler {
  constructor() {
    this.isRunning = false;
  }

  /**
   * Start the price update scheduler
   * @param {string} schedule - Cron schedule expression (default: every 6 hours)
   */
  start(schedule = '0 */6 * * *') {
    if (this.isRunning) {
      logger.warn('Price scheduler is already running');
      return;
    }

    // Schedule the price update job
    this.job = cron.schedule(schedule, async () => {
      try {
        logger.info('Running scheduled price update job');
        await emptyLegPriceService.updateAllRoutePrices();
        logger.info('Scheduled price update completed');
      } catch (error) {
        logger.error(`Scheduled price update failed: ${error.message}`);
      }
    });

    logger.info(`Price scheduler started with schedule: ${schedule}`);
    this.isRunning = true;
  }

  /**
   * Stop the price update scheduler
   */
  stop() {
    if (!this.isRunning) {
      logger.warn('Price scheduler is not running');
      return;
    }

    this.job.stop();
    logger.info('Price scheduler stopped');
    this.isRunning = false;
  }

  /**
   * Run a single price update immediately
   * @returns {Promise<Object>} - Result of the update operation
   */
  async runNow() {
    try {
      logger.info('Running manual price update');
      const result = await emptyLegPriceService.updateAllRoutePrices();
      logger.info('Manual price update completed');
      return result;
    } catch (error) {
      logger.error(`Manual price update failed: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new PriceScheduler();