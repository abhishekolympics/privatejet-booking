// services/aviapagesService.js - Service for Aviapages API calls

const axios = require('axios');
const logger = require('../utils/logger');

class AviapagesService {
  constructor() {
    this.apiKey = process.env.AVIAPAGES_API_KEY;
    this.baseUrl = 'https://dir.aviapages.com/api';
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Token ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Get charter price estimate
   * @param {Object} data - Request data
   * @returns {Promise} - Promise with price data
   */
  async getChapterPrice(data) {
    try {
      const response = await this.client.post('/charter_prices/', data);
      logger.info('Charter price fetched successfully');
      return response.data;
    } catch (error) {
      logger.error(`Error fetching charter price: ${error.message}`);
      throw error;
    }
  }

  /**
   * Search for available aircraft
   * @param {Object} data - Request data
   * @returns {Promise} - Promise with aircraft data
   */
  async searchAircraft(data) {
    try {
      const response = await this.client.post('/charter_search_aircraft/', data);
      logger.info(`Found ${response.data.aircraft?.length || 0} aircraft`);
      return response.data;
    } catch (error) {
      logger.error(`Error searching aircraft: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a charter quote request
   * @param {Object} data - Request data
   * @returns {Promise} - Promise with quote data
   */
  async createQuoteRequest(data) {
    try {
      const response = await this.client.post('/charter_quote_requests/', data);
      logger.info(`Quote request created with ID: ${response.data.quote_request_id}`);
      return response.data;
    } catch (error) {
      logger.error(`Error creating quote request: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get airports by search term
   * @param {string} searchTerm - Airport search term
   * @returns {Promise} - Promise with airports data
   */
  async searchAirports(searchTerm) {
    try {
      const response = await this.client.get('/airports/', {
        params: { search: searchTerm, page: 1 }
      });
      logger.info(`Found ${response.data.count} airports for term: ${searchTerm}`);
      return response.data.results;
    } catch (error) {
      logger.error(`Error searching airports: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get aircraft classes (for filtering)
   * @returns {Promise} - Promise with aircraft classes
   */
  async getAircraftClasses() {
    try {
      const response = await this.client.get('/aircraft_classes/');
      logger.info(`Fetched ${response.data.count} aircraft classes`);
      return response.data.results;
    } catch (error) {
      logger.error(`Error fetching aircraft classes: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get detailed info for a specific aircraft
   * @param {number} aircraftId - Aircraft ID
   * @returns {Promise} - Promise with aircraft data
   */
  async getAircraftDetails(aircraftId) {
    try {
      const response = await this.client.get(`/charter_aircraft/${aircraftId}/`);
      logger.info(`Fetched details for aircraft ID: ${aircraftId}`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching aircraft details: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new AviapagesService();