// controllers/aircraftController.js
const Aircraft = require('../models/Aircraft');
const logger = require('../utils/logger');
const axios = require('axios');
const asyncHandler = require('express-async-handler');
const { aviapagesThrottler } = require('../utils/apiThrottler');


/**
 * @desc    Get aircraft by class from database
 * @route   GET /api/aircraft/class/:className
 * @access  Public
 */
exports.getAircraftByClassFromDb = asyncHandler(async (req, res) => {
  try {
    const { className } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Validate class name
    const validClasses = ['light', 'midsize', 'supermidsize', 'heavy', 'ultralong'];
    if (!validClasses.includes(className)) {
      res.status(400);
      throw new Error('Invalid aircraft class');
    }

    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Calculate skip for pagination
    const skip = (pageNum - 1) * limitNum;
    
    // Find aircraft by class
    const query = { 'aircraftType.class.name': getAviapagesClassName(className) };
    
    // Get total count for pagination
    const total = await Aircraft.countDocuments(query);
    
    // Find aircraft with pagination
    const aircraft = await Aircraft.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    
    res.status(200).json({
      success: true,
      count: aircraft.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage,
        hasPrevPage,
        totalResults: total
      },
      data: aircraft
    });
  } catch (error) {
    logger.error(`Error fetching aircraft from DB: ${error.message}`);
    res.status(500);
    throw new Error(`Error fetching aircraft: ${error.message}`);
  }
});

/**
 * @desc    Get aircraft by class from Aviapages API and update db
 * @route   GET /api/aircraft/class/:className/api
 * @access  Public
 */
exports.getAircraftByClassFromApi = asyncHandler(async (req, res) => {
  try {
    const { className } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Validate class name
    const validClasses = ['light', 'midsize', 'supermidsize', 'heavy', 'ultralong'];
    if (!validClasses.includes(className)) {
      res.status(400);
      throw new Error('Invalid aircraft class');
    }
    
    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Call Aviapages API to get latest aircraft data
    const aviapagesClassName = getAviapagesClassName(className);
    const apiResponse = await callAviapagesApi(aviapagesClassName, pageNum, limitNum);
    
    if (!apiResponse || !apiResponse.results) {
      res.status(500);
      throw new Error('Failed to fetch data from Aviapages API');
    }
    
    // Process and save API response to database
    const processedData = await processAndSaveApiData(apiResponse.results);
    
    // Return the processed data with pagination info
    res.status(200).json({
      success: true,
      count: processedData.length,
      total: apiResponse.count || processedData.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil((apiResponse.count || processedData.length) / limitNum),
        hasNextPage: apiResponse.next ? true : false,
        hasPrevPage: apiResponse.previous ? true : false,
        totalResults: apiResponse.count || processedData.length
      },
      data: processedData
    });
  } catch (error) {
    logger.error(`Error fetching aircraft from API: ${error.message}`);
    res.status(500);
    throw new Error(`Error fetching aircraft from API: ${error.message}`);
  }
});

/**
 * @desc    Get aircraft by ID
 * @route   GET /api/aircraft/:id
 * @access  Public
 */
exports.getAircraftById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find aircraft in database
    let aircraft = await Aircraft.findOne({ aircraftId: id });
    
    if (!aircraft) {
      // If not found in DB, try fetching from API
      const apiResponse = await callAviapagesApiForSingleAircraft(id);
      
      if (!apiResponse) {
        res.status(404);
        throw new Error('Aircraft not found');
      }
      
      // Process and save API response
      const processedData = await processAndSaveSingleAircraft(apiResponse);
      aircraft = processedData;
    } else {
      // If found in DB, still fetch from API to update data asynchronously
      try {
        const apiResponse = await callAviapagesApiForSingleAircraft(id);
        if (apiResponse) {
          // Update in background, don't wait for it
          processAndSaveSingleAircraft(apiResponse).catch(err => 
            logger.error(`Background update failed for aircraft ${id}: ${err.message}`)
          );
        }
      } catch (apiError) {
        // Log error but don't fail the request
        logger.error(`Background API call failed for aircraft ${id}: ${apiError.message}`);
      }
    }
    
    res.status(200).json({
      success: true,
      data: aircraft
    });
  } catch (error) {
    logger.error(`Error fetching aircraft by ID: ${error.message}`);
    
    if (error.message === 'Aircraft not found') {
      res.status(404);
    } else {
      res.status(500);
    }
    
    throw new Error(`Error fetching aircraft: ${error.message}`);
  }
});

/**
 * Helper function to convert our className to Aviapages className format
 */
function getAviapagesClassName(className) {
  switch (className) {
    case 'light': return 'Light';
    case 'midsize': return 'Midsize';
    case 'supermidsize': return 'Super midsize';
    case 'heavy': return 'Heavy';
    case 'ultralong': return 'Ultra long range';
    default: return className;
  }
}

/**
 * Helper function to call Aviapages API
 */
async function callAviapagesApi(className, page, limit) {
  try {
    const apiKey = process.env.AVIAPAGES_API_KEY;
    const baseUrl = 'https://dir.aviapages.com/api';
    
    const response = await axios.get(`${baseUrl}/charter_aircraft/`, {
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      },
      params: {
        aircraft_class: className,
        // page: page,
        // per_page: limit,
        ordering: '-year_of_production',  // Show newest aircraft first
        is_for_charter: true  // Only show aircraft available for charter
      }
    });
    
    return response.data;
  } catch (error) {
    logger.error(`Aviapages API call failed: ${error.message}`);
    throw new Error(`Failed to fetch from Aviapages: ${error.message}`);
  }
}

/**
 * Helper function to call Aviapages API for a single aircraft
 */
async function callAviapagesApiForSingleAircraft(id) {
  try {
    const apiKey = process.env.AVIAPAGES_API_KEY;
    const baseUrl = 'https://dir.aviapages.com/api';
    
    const response = await axios.get(`${baseUrl}/charter_aircraft/${id}/`, {
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    logger.error(`Aviapages API call for single aircraft failed: ${error.message}`);
    throw new Error(`Failed to fetch from Aviapages: ${error.message}`);
  }
}

/**
 * Helper function to process API response and save to DB
 */
async function processAndSaveApiData(apiResults) {
  try {
    const processedAircraft = [];
    
    // Process each aircraft
    for (const apiAircraft of apiResults) {
      const processedSingleAircraft = await processAndSaveSingleAircraft(apiAircraft);
      if (processedSingleAircraft) {
        processedAircraft.push(processedSingleAircraft);
      }
    }
    
    return processedAircraft;
  } catch (error) {
    logger.error(`Error processing API data: ${error.message}`);
    throw error;
  }
}

/**
 * Helper function to process and save a single aircraft
 */
async function processAndSaveSingleAircraft(apiAircraft) {
  try {
    // Process images
    const images = (apiAircraft.images || []).map(img => ({
      id: img.media?.id,
      path: img.media?.path,
      position: img.position,
      tag: img.tag?.value
    }));
    
    // Process features
    const features = {
      cabinCrew: apiAircraft.aircraft_extension?.cabin_crew,
      lavatory: apiAircraft.aircraft_extension?.lavatory,
      hotMeal: apiAircraft.aircraft_extension?.hot_meal,
      wirelessInternet: apiAircraft.aircraft_extension?.wireless_internet,
      entertainmentSystem: apiAircraft.aircraft_extension?.entertainment_system,
      petsAllowed: apiAircraft.aircraft_extension?.pets_allowed,
      smoking: apiAircraft.aircraft_extension?.smoking,
      luggageVolume: apiAircraft.aircraft_extension?.luggage_volume,
      shower: apiAircraft.aircraft_extension?.shower,
      satellitePhone: apiAircraft.aircraft_extension?.satellite_phone,
      sleepingPlaces: apiAircraft.aircraft_extension?.sleeping_places
    };
    
    // Create aircraft data object
    const aircraftData = {
      aircraftId: apiAircraft.id,
      aircraftType: {
        id: apiAircraft.aircraft_type?.id,
        name: apiAircraft.aircraft_type?.name,
        icao: apiAircraft.aircraft_type?.icao,
        class: {
          id: apiAircraft.aircraft_type?.aircraft_class?.id,
          name: apiAircraft.aircraft_type?.aircraft_class?.name
        }
      },
      company: {
        id: apiAircraft.company?.id,
        name: apiAircraft.company?.name
      },
      baseAirport: {
        id: apiAircraft.base_airport?.id,
        name: apiAircraft.base_airport?.name,
        city: apiAircraft.base_airport?.city?.name,
        country: apiAircraft.base_airport?.country?.name,
        icao: apiAircraft.base_airport?.icao
      },
      passengersMax: apiAircraft.passengers_max,
      registrationNumber: apiAircraft.registration_number,
      yearOfProduction: apiAircraft.year_of_production,
      serialNumber: apiAircraft.serial_number,
      isForCharter: apiAircraft.is_for_charter,
      isForSale: apiAircraft.is_for_sale,
      description: apiAircraft.aircraft_extension?.description,
      features: features,
      images: images,
      updatedAt: new Date()
    };
    
    // Find and update or create new aircraft in DB
    const updatedAircraft = await Aircraft.findOneAndUpdate(
      { aircraftId: apiAircraft.id },
      aircraftData,
      { new: true, upsert: true }
    );
    
    return updatedAircraft;
  } catch (error) {
    logger.error(`Error processing single aircraft: ${error.message}`);
    return null;
  }
}

// Add this helper function to your aircraftController.js

/**
 * Helper function to call Aviapages API with retry logic
 */
async function callAviapagesApi(className, page, limit, retryCount = 0) {
  try {
    const apiKey = process.env.AVIAPAGES_API_KEY;
    const baseUrl = 'https://dir.aviapages.com/api';
    const maxRetries = 3;
    const retryDelay = 1000 * Math.pow(2, retryCount); // Exponential backoff
    
    const response = await axios.get(`${baseUrl}/charter_aircraft/`, {
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      },
      params: {
        aircraft_class: className,
        page: page,
        per_page: limit,
        ordering: '-year_of_production',  // Show newest aircraft first
        is_for_charter: true  // Only show aircraft available for charter
      }
    });
    
    return response.data;
  } catch (error) {
    // Handle rate limiting (429 status code)
    if (error.response && error.response.status === 429 && retryCount < maxRetries) {
      logger.warn(`Rate limited by Aviapages API. Retrying in ${retryDelay}ms...`);
      
      // Wait using exponential backoff
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      
      // Retry the request with incremented retry count
      return callAviapagesApi(className, page, limit, retryCount + 1);
    }
    
    logger.error(`Aviapages API call failed: ${error.message}`);
    throw new Error(`Failed to fetch from Aviapages: ${error.message}`);
  }
}

// Update the similar function for single aircraft with the same retry logic:

async function callAviapagesApiForSingleAircraft(id, retryCount = 0) {
  try {
    const apiKey = process.env.AVIAPAGES_API_KEY;
    const baseUrl = 'https://dir.aviapages.com/api';
    const maxRetries = 3;
    const retryDelay = 1000 * Math.pow(2, retryCount); // Exponential backoff
    
    const response = await axios.get(`${baseUrl}/charter_aircraft/${id}/`, {
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    // Handle rate limiting (429 status code)
    if (error.response && error.response.status === 429 && retryCount < maxRetries) {
      logger.warn(`Rate limited by Aviapages API. Retrying in ${retryDelay}ms...`);
      
      // Wait using exponential backoff
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      
      // Retry the request with incremented retry count
      return callAviapagesApiForSingleAircraft(id, retryCount + 1);
    }
    
    logger.error(`Aviapages API call for single aircraft failed: ${error.message}`);
    throw new Error(`Failed to fetch from Aviapages: ${error.message}`);
  }
}

// controllers/aircraftController.js - Updated with throttling

// Import the throttler

/**
 * Helper function to call Aviapages API with throttling
 */
async function callAviapagesApi(className, page, limit) {
  return aviapagesThrottler.throttle(async () => {
    const apiKey = process.env.AVIAPAGES_API_KEY;
    const baseUrl = 'https://dir.aviapages.com/api';
    
    const response = await axios.get(`${baseUrl}/charter_aircraft/`, {
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      },
      params: {
        aircraft_class: className,
        page: page,
        per_page: limit,
        ordering: '-year_of_production', 
        is_for_charter: true
      }
    });
    
    return response.data;
  });
}

/**
 * Helper function to call Aviapages API for a single aircraft with throttling
 */
async function callAviapagesApiForSingleAircraft(id) {
  return aviapagesThrottler.throttle(async () => {
    const apiKey = process.env.AVIAPAGES_API_KEY;
    const baseUrl = 'https://dir.aviapages.com/api';
    
    const response = await axios.get(`${baseUrl}/charter_aircraft/${id}/`, {
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  });
}