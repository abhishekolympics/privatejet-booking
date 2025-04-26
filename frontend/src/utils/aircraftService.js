// utils/aircraftService.js - Frontend utility for aircraft data
import api from './api';

/**
 * Fetches aircraft by class
 * @param {string} className - Aircraft class name (light, midsize, supermidsize, heavy, ultralong)
 * @param {boolean} useFromDb - Whether to use database data (true) or API data (false)
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of results per page
 * @returns {Promise} - Promise with aircraft data
 */
export const fetchAircraftByClass = async (className, useFromDb = true, page = 1, limit = 10) => {
  try {
    // Determine the endpoint based on the data source
    const endpoint = useFromDb 
      ? `/aircraft/class/${className}?page=${page}&limit=${limit}` 
      : `/aircraft/class/${className}/api?page=${page}&limit=${limit}`;
    
    const response = await api.get(`${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${className} aircraft: ${error.message}`);
    throw new Error(`Could not fetch aircraft data: ${error.message}`);
  }
};

/**
 * Fetches a single aircraft by ID
 * @param {string} id - Aircraft ID
 * @returns {Promise} - Promise with aircraft data
 */
export const fetchAircraftById = async (id) => {
  try {
    const response = await api.get(`/aircraft/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching aircraft with ID ${id}: ${error.message}`);
    throw new Error(`Could not fetch aircraft details: ${error.message}`);
  }
};

/**
 * Fetches aircraft by class and filters by passenger count
 * @param {string} className - Aircraft class name
 * @param {number} passengers - Minimum number of passengers
 * @returns {Promise} - Promise with filtered aircraft data
 */
export const fetchAircraftByPassengers = async (className, passengers) => {
  try {
    // First get all aircraft for the class
    const response = await fetchAircraftByClass(className, true);
    
    // Then filter by passenger count
    const filteredData = {
      ...response,
      data: response.data.filter(aircraft => 
        aircraft.passengersMax >= passengers
      )
    };
    
    return filteredData;
  } catch (error) {
    console.error(`Error fetching aircraft by passengers: ${error.message}`);
    throw new Error(`Could not fetch aircraft data: ${error.message}`);
  }
};

export default {
  fetchAircraftByClass,
  fetchAircraftById,
  fetchAircraftByPassengers
};