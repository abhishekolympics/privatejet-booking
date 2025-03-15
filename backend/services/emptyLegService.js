// services/emptyLegPriceService.js
const axios = require('axios');
const EmptyLeg = require('../models/EmptyLeg');
const logger = require('../utils/logger');

/**
 * Service to handle real-time pricing for empty leg flights
 */
class EmptyLegPriceService {
  constructor() {
    // Configuration for price API
    this.apiKey = process.env.AVIAPAGES_API_KEY || 'your-api-key';
    this.baseUrl = 'https://dir.aviapages.com/api';
    
    // Popular city airport pairs
    this.popularRoutes = [
      { from: 'KJFK', to: 'KMIA', fromCity: 'New York', toCity: 'Miami' }, // New York to Miami
      { from: 'KLAX', to: 'KLAS', fromCity: 'Los Angeles', toCity: 'Las Vegas' }, // LA to Las Vegas
      { from: 'KBOS', to: 'KPHL', fromCity: 'Boston', toCity: 'Philadelphia' }, // Boston to Philadelphia
      { from: 'KSFO', to: 'KSAN', fromCity: 'San Francisco', toCity: 'San Diego' }, // San Francisco to San Diego
      { from: 'KATL', to: 'KMCO', fromCity: 'Atlanta', toCity: 'Orlando' }, // Atlanta to Orlando
      { from: 'KDFW', to: 'KIAH', fromCity: 'Dallas', toCity: 'Houston' }, // Dallas to Houston
      { from: 'KDAL', to: 'KAUS', fromCity: 'Dallas', toCity: 'Austin' }, // Dallas to Austin
      // International routes
      { from: 'EGLL', to: 'LFPG', fromCity: 'London', toCity: 'Paris' }, // London to Paris
      { from: 'EHAM', to: 'EDDF', fromCity: 'Amsterdam', toCity: 'Frankfurt' }, // Amsterdam to Frankfurt
      { from: 'LEMD', to: 'LEBL', fromCity: 'Madrid', toCity: 'Barcelona' }, // Madrid to Barcelona
      { from: 'EDDM', to: 'LSZH', fromCity: 'Munich', toCity: 'Zurich' }, // Munich to Zurich
      { from: 'LIRF', to: 'LIPZ', fromCity: 'Rome', toCity: 'Venice' }, // Rome to Venice
      { from: 'LTBA', to: 'LTAI', fromCity: 'Istanbul', toCity: 'Antalya' }, // Istanbul to Antalya
      // Middle East and Asia
      { from: 'OMDB', to: 'OERK', fromCity: 'Dubai', toCity: 'Riyadh' }, // Dubai to Riyadh
      { from: 'VABB', to: 'VIDP', fromCity: 'Mumbai', toCity: 'Delhi' }, // Mumbai to Delhi
      { from: 'VHHH', to: 'WSSS', fromCity: 'Hong Kong', toCity: 'Singapore' }, // Hong Kong to Singapore
      { from: 'RJAA', to: 'RJBB', fromCity: 'Tokyo', toCity: 'Osaka' }, // Tokyo to Osaka
      { from: 'YSSY', to: 'YMML', fromCity: 'Sydney', toCity: 'Melbourne' }, // Sydney to Melbourne
    ];
    
    // Aircraft types
    this.aircraftTypes = [
      {
        id: 1001,
        type: "Citation XLS",
        class: "Midsize",
        capacity: 8,
        year: 2018,
        company: {
          id: 123,
          name: "Executive Jets Inc."
        }
      },
      {
        id: 1002,
        type: "Phenom 300",
        class: "Light",
        capacity: 6,
        year: 2020,
        company: {
          id: 124,
          name: "European Air Charter"
        }
      },
      {
        id: 1003,
        type: "Citation CJ3",
        class: "Light",
        capacity: 7,
        year: 2019,
        company: {
          id: 125,
          name: "West Coast Jets"
        }
      },
      {
        id: 1004,
        type: "Gulfstream G450",
        class: "Heavy",
        capacity: 14,
        year: 2017,
        company: {
          id: 126,
          name: "Gulf Luxury Jets"
        }
      },
      {
        id: 1005,
        type: "Challenger 350",
        class: "Super Midsize",
        capacity: 9,
        year: 2021,
        company: {
          id: 127,
          name: "East Coast Aviation"
        }
      },
      {
        id: 1006,
        type: "Legacy 500",
        class: "Midsize",
        capacity: 12,
        year: 2018,
        company: {
          id: 128,
          name: "European Elite Jets"
        }
      }
    ];
  }

  /**
   * Initialize API client
   */
  initApiClient() {
    return axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Token ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Get airport details
   * @param {string} airportCode - ICAO airport code
   * @returns {Promise<Object>} - Airport details
   */
  async getAirportDetails(airportCode) {
    try {
      // In a real application, this would call an API
      // For this example, we'll simulate it with predefined data
      
      const airportData = {
        KJFK: {
          code: "KJFK",
          name: "John F. Kennedy International Airport",
          city: "New York",
          country: "United States",
          latitude: 40.6413,
          longitude: -73.7781
        },
        KMIA: {
          code: "KMIA",
          name: "Miami International Airport",
          city: "Miami",
          country: "United States",
          latitude: 25.7932,
          longitude: -80.2906
        },
        KLAX: {
          code: "KLAX",
          name: "Los Angeles International Airport",
          city: "Los Angeles",
          country: "United States",
          latitude: 33.9416,
          longitude: -118.4085
        },
        KLAS: {
          code: "KLAS",
          name: "Harry Reid International Airport",
          city: "Las Vegas",
          country: "United States",
          latitude: 36.0840,
          longitude: -115.1537
        },
        // Add other airport data as needed
        EGLL: {
          code: "EGLL",
          name: "London Heathrow Airport",
          city: "London",
          country: "United Kingdom",
          latitude: 51.4700,
          longitude: -0.4543
        },
        LFPG: {
          code: "LFPG",
          name: "Paris Charles de Gaulle Airport",
          city: "Paris",
          country: "France",
          latitude: 49.0097,
          longitude: 2.5479
        },
        OMDB: {
          code: "OMDB",
          name: "Dubai International Airport",
          city: "Dubai",
          country: "United Arab Emirates",
          latitude: 25.2532,
          longitude: 55.3657
        },
        OERK: {
          code: "OERK",
          name: "King Khalid International Airport",
          city: "Riyadh",
          country: "Saudi Arabia",
          latitude: 24.9578,
          longitude: 46.6989
        }
      };
      
      return airportData[airportCode] || null;
    } catch (error) {
      logger.error(`Error fetching airport details for ${airportCode}: ${error.message}`);
      throw new Error(`Failed to fetch airport details: ${error.message}`);
    }
  }

  /**
   * Calculate distance between two airports
   * @param {Object} from - Origin airport (with latitude and longitude)
   * @param {Object} to - Destination airport (with latitude and longitude)
   * @returns {number} - Distance in nautical miles
   */
  calculateDistance(from, to) {
    // Simple Haversine formula to calculate distance
    const toRadians = (degrees) => degrees * Math.PI / 180;
    
    const lat1 = toRadians(from.latitude);
    const lon1 = toRadians(from.longitude);
    const lat2 = toRadians(to.latitude);
    const lon2 = toRadians(to.longitude);
    
    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;
    
    const a = Math.sin(dlat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon/2)**2;
    const c = 2 * Math.asin(Math.sqrt(a));
    
    // Radius of Earth in nautical miles
    const radius = 3440.065;
    
    return Math.round(radius * c);
  }

  /**
   * Calculate flight duration based on distance
   * @param {number} distance - Distance in nautical miles
   * @param {string} aircraftType - Type of aircraft
   * @returns {number} - Duration in minutes
   */
  calculateFlightDuration(distance, aircraftType) {
    // Different aircraft have different cruise speeds
    const cruiseSpeeds = {
      "Citation XLS": 440, // knots
      "Phenom 300": 453,
      "Citation CJ3": 416,
      "Gulfstream G450": 488,
      "Challenger 350": 470,
      "Legacy 500": 465,
      "Default": 450 // default speed if aircraft not found
    };
    
    const speed = cruiseSpeeds[aircraftType] || cruiseSpeeds.Default;
    
    // Calculate time in hours, add 20 minutes for takeoff and landing
    const flightHours = distance / speed;
    return Math.round((flightHours * 60) + 20);
  }

  /**
   * Generate realistic price based on distance and aircraft
   * @param {number} distance - Distance in nautical miles
   * @param {Object} aircraft - Aircraft details
   * @returns {Object} - Price data
   */
  generateRealisticPrice(distance, aircraft) {
    // Base price factors per nautical mile based on aircraft class
    const basePriceFactors = {
      "Light": 8,
      "Midsize": 12,
      "Super Midsize": 15,
      "Heavy": 20,
      "Ultra long range": 25,
      "Default": 10
    };
    
    // Price factor for the specific aircraft
    const priceFactor = basePriceFactors[aircraft.class] || basePriceFactors.Default;
    
    // Calculate regular price based on distance and aircraft size
    const regularPrice = Math.round(distance * priceFactor * (0.9 + Math.random() * 0.2)) * 100;
    
    // Empty legs are typically 30-70% off regular price
    const discountPercent = 30 + Math.floor(Math.random() * 40);
    const discountedPrice = Math.round(regularPrice * (1 - discountPercent / 100));
    
    // Currency based on region (simple logic for demo)
    let currency = "USD";
    if (aircraft.company.name.includes("European")) {
      currency = "EUR";
    } else if (aircraft.company.name.includes("Gulf")) {
      currency = "USD"; // Gulf region typically uses USD for aviation
    }
    
    return {
      regularPrice,
      price: discountedPrice,
      savingsPercentage: discountPercent,
      currency
    };
  }

  /**
   * Gets real-time pricing for a route
   * @param {string} fromCode - Origin airport code
   * @param {string} toCode - Destination airport code
   * @returns {Promise<Object>} - Price and route data
   */
  async getRoutePrice(fromCode, toCode) {
    try {
      // Get airport details
      const fromAirport = await this.getAirportDetails(fromCode);
      const toAirport = await this.getAirportDetails(toCode);
      
      if (!fromAirport || !toAirport) {
        throw new Error(`Airport data not found for ${fromCode} or ${toCode}`);
      }
      
      // Calculate distance
      const distance = this.calculateDistance(fromAirport, toAirport);
      
      // Select random aircraft for this route
      const aircraft = this.aircraftTypes[Math.floor(Math.random() * this.aircraftTypes.length)];
      
      // Calculate flight duration
      const flightDuration = this.calculateFlightDuration(distance, aircraft.type);
      
      // Generate price
      const priceData = this.generateRealisticPrice(distance, aircraft);
      
      // Create departure date (random date in next 30 days)
      const daysAhead = 1 + Math.floor(Math.random() * 30);
      const departureDate = new Date();
      departureDate.setDate(departureDate.getDate() + daysAhead);
      
      // Set hours between 6am and 8pm
      departureDate.setHours(6 + Math.floor(Math.random() * 14), 
                            Math.floor(Math.random() * 60), 0, 0);
      
      // Set availability until (1 day before departure)
      const availableUntil = new Date(departureDate);
      availableUntil.setDate(availableUntil.getDate() - 1);
      
      // Return complete route data
      return {
        departureAirport: fromAirport,
        arrivalAirport: toAirport,
        departureDateTime: departureDate,
        aircraft: aircraft,
        price: priceData.price,
        currency: priceData.currency,
        regularPrice: priceData.regularPrice,
        savingsPercentage: priceData.savingsPercentage,
        flightDuration: flightDuration,
        distance: distance,
        availableUntil: availableUntil
      };
    } catch (error) {
      logger.error(`Error calculating route price for ${fromCode} to ${toCode}: ${error.message}`);
      throw new Error(`Failed to calculate price: ${error.message}`);
    }
  }

  /**
   * Fetch and update prices for all popular routes
   * @returns {Promise<Object>} - Result of the update operation
   */
  async updateAllRoutePrices() {
    try {
      logger.info('Starting scheduled update of empty leg prices');
      
      let updated = 0;
      let added = 0;
      
      // Process each popular route
      for (const route of this.popularRoutes) {
        try {
          // Get new price data
          const newData = await this.getRoutePrice(route.from, route.to);
          
          // Find existing active, unbooked empty leg for this route
          const existingLeg = await EmptyLeg.findOne({
            'departureAirport.code': route.from,
            'arrivalAirport.code': route.to,
            isBooked: false,
            isActive: true
          });
          
          if (existingLeg) {
            // Update existing empty leg
            existingLeg.price = newData.price;
            existingLeg.regularPrice = newData.regularPrice;
            existingLeg.savingsPercentage = newData.savingsPercentage;
            existingLeg.aircraft = newData.aircraft;
            existingLeg.flightDuration = newData.flightDuration;
            existingLeg.updatedAt = new Date();
            
            await existingLeg.save();
            updated++;
          } else {
            // Create new empty leg
            await EmptyLeg.create({
              ...newData,
              isBooked: false,
              isActive: true
            });
            added++;
          }
        } catch (routeError) {
          logger.error(`Error updating route ${route.from}-${route.to}: ${routeError.message}`);
          // Continue with other routes even if one fails
          continue;
        }
      }
      
      logger.info(`Empty leg prices updated: ${updated} updated, ${added} added`);
      return { updated, added };
    } catch (error) {
      logger.error(`Error in updateAllRoutePrices: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new EmptyLegPriceService();