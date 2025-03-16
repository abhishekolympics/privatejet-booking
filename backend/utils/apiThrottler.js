// utils/apiThrottler.js - Updated to use environment variables
const logger = require('./logger');

/**
 * Simple API request throttler
 * Limits the number of requests that can be made within a time window
 */
class ApiThrottler {
  constructor(maxRequests = 10, timeWindowMs = 60000) {
    this.maxRequests = maxRequests; // Maximum requests in time window
    this.timeWindowMs = timeWindowMs; // Time window in milliseconds
    this.requestTimestamps = []; // Timestamps of recent requests
    this.queue = []; // Queue of pending requests
    this.processing = false; // Flag to indicate if we're processing the queue
  }

  /**
   * Add a function to the queue to be executed when a request slot is available
   * @param {Function} fn - Async function to execute
   * @returns {Promise} - Promise that resolves with the result of fn
   */
  async throttle(fn) {
    return new Promise((resolve, reject) => {
      // Add to queue
      this.queue.push({ fn, resolve, reject });
      
      // Start processing the queue if not already doing so
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  /**
   * Process the queue of pending requests
   */
  async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;

    // If we can make a request now, process the next item
    if (this.canMakeRequest()) {
      const { fn, resolve, reject } = this.queue.shift();
      
      // Record this request
      this.recordRequest();
      
      try {
        // Execute the function
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
      
      // Continue processing queue
      setImmediate(() => this.processQueue());
    } else {
      // If we can't make a request now, wait until we can
      const waitTime = this.getWaitTime();
      
      logger.info(`API throttler: Waiting ${waitTime}ms before next request`);
      
      setTimeout(() => {
        this.processQueue();
      }, waitTime);
    }
  }

  /**
   * Check if we can make a request now based on the rate limit
   * @returns {boolean}
   */
  canMakeRequest() {
    // Clean up old timestamps
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter(
      timestamp => now - timestamp < this.timeWindowMs
    );
    
    // Check if we're under the limit
    return this.requestTimestamps.length < this.maxRequests;
  }

  /**
   * Record a new request timestamp
   */
  recordRequest() {
    this.requestTimestamps.push(Date.now());
  }

  /**
   * Calculate how long to wait before the next request can be made
   * @returns {number} - Wait time in milliseconds
   */
  getWaitTime() {
    if (this.requestTimestamps.length === 0) {
      return 0;
    }
    
    const now = Date.now();
    const oldestTimestamp = this.requestTimestamps[0];
    const timeToWait = this.timeWindowMs - (now - oldestTimestamp);
    
    return Math.max(0, timeToWait);
  }
}

// Create a throttler instance for the Aviapages API
// Read configuration from environment variables
const maxRequests = parseInt(process.env.AVIAPAGES_API_MAX_REQUESTS || '10', 10);
const timeWindowMs = parseInt(process.env.AVIAPAGES_API_TIME_WINDOW_MS || '60000', 10);

const aviapagesThrottler = new ApiThrottler(maxRequests, timeWindowMs);

module.exports = {
  ApiThrottler,
  aviapagesThrottler
};