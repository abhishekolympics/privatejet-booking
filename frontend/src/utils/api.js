// utils/api.js - API utilities for frontend (updated for password reset)

import axios from "axios";

const API_URL = "https://privatejet-booking.onrender.com/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API calls
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  // Store token in localStorage
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// Password Reset API calls
export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (resetToken, password) => {
  const response = await api.post(`/auth/reset-password/${resetToken}`, {
    password,
  });
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put("/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};

// Aviapages API calls
export const searchAirports = async (term) => {
  const response = await api.get(`/aviapages/airports?term=${term}`);
  return response.data;
};

export const getAircraftClasses = async () => {
  const response = await api.get("/aviapages/aircraft-classes");
  return response.data;
};

export const getCharterPrice = async (data) => {
  const response = await api.post("/aviapages/charter-price", data);
  return response.data;
};

export const searchAircraft = async (data) => {
  const response = await api.post("/aviapages/search-aircraft", data);
  return response.data;
};

export const getAircraftDetails = async (id) => {
  const response = await api.get(`/aviapages/aircraft/${id}`);
  return response.data;
};

export const createQuote = async (data) => {
  const response = await api.post("/aviapages/create-quote", data);
  return response.data;
};

// Booking API calls
export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

export const getUserBookings = async () => {
  const response = await api.get("/bookings");
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

export const updateBooking = async (id, data) => {
  const response = await api.patch(`/bookings/${id}`, data);
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

// User profile API calls
export const updateUserProfile = async (userData) => {
  const response = await api.patch("/users/me", userData);
  return response.data;
};

export const addPaymentMethod = async (paymentData) => {
  const response = await api.post("/users/payment-methods", paymentData);
  return response.data;
};

export const getPaymentMethods = async () => {
  const response = await api.get("/users/payment-methods");
  return response.data;
};

// Fetch all partners
export const fetchPartners = async () => {
  try {
    const response = await api.get("/partners");
    return response.data;
  } catch (error) {
    console.error("Error fetching partners:", error);
    throw error;
  }
};

// Fetch a single partner by ID
export const fetchPartnerById = async (partnerId) => {
  try {
    const response = await api.get(`/partners/${partnerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching partner with ID ${partnerId}:`, error);
    throw error;
  }
};

// Filter partners by type
export const fetchPartnersByType = async (partnerType) => {
  try {
    const response = await api.get("/partners", {
      params: { partnerType },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching partners of type ${partnerType}:`, error);
    throw error;
  }
};

// Search partners by keyword
export const searchPartners = async (searchTerm) => {
  try {
    const response = await api.get("/partners/search", {
      params: { q: searchTerm },
    });
    return response.data;
  } catch (error) {
    console.error(`Error searching partners with term "${searchTerm}":`, error);
    throw error;
  }
};

// Contact a partner
export const contactPartner = async (partnerId, contactData) => {
  try {
    const response = await api.post(
      `/partners/${partnerId}/contact`,
      contactData
    );
    return response.data;
  } catch (error) {
    console.error("Error sending contact request to partner:", error);
    throw error;
  }
};

/**
 * Get all available empty leg flights
 * @returns {Promise} Promise with empty leg flights data
 */
export const fetchEmptyLegs = async () => {
  try {
    const response = await api.get('/empty-legs');
    return response.data;
  } catch (error) {
    console.error('Error fetching empty legs:', error);
    throw error;
  }
};

/**
 * Search for empty legs based on criteria
 * @param {Object} searchParams - Search parameters
 * @param {string} searchParams.departure - Departure location (city or airport code)
 * @param {string} searchParams.arrival - Arrival location (city or airport code)
 * @param {string} searchParams.date - Minimum departure date
 * @returns {Promise} Promise with filtered empty leg flights
 */
export const searchEmptyLegs = async (searchParams) => {
  try {
    const response = await api.get('/empty-legs/search', { params: searchParams });
    return response.data;
  } catch (error) {
    console.error('Error searching empty legs:', error);
    throw error;
  }
};

/**
 * Book an empty leg flight
 * @param {string} legId - ID of the empty leg flight
 * @param {Object} bookingData - Booking details
 * @returns {Promise} Promise with booking confirmation
 */
export const bookEmptyLeg = async (legId, bookingData) => {
  try {
    const response = await api.post(`/empty-legs/${legId}/book`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error booking empty leg:', error);
    throw error;
  }
};

/**
 * Set up flight alerts for empty legs
 * @param {Object} alertData - Alert criteria
 * @param {string} alertData.departure - Departure location
 * @param {string} alertData.arrival - Arrival location
 * @param {string} alertData.dateFrom - Start date for alert period
 * @param {string} alertData.dateTo - End date for alert period
 * @param {string} alertData.email - Email to receive alerts
 * @returns {Promise} Promise with alert confirmation
 */
export const setUpFlightAlert = async (alertData) => {
  try {
    const response = await api.post('/empty-legs/alerts', alertData);
    return response.data;
  } catch (error) {
    console.error('Error setting up flight alert:', error);
    throw error;
  }
};

/**
 * Get flight alert subscriptions for the logged-in user
 * @returns {Promise} Promise with user's flight alerts
 */
export const getUserFlightAlerts = async () => {
  try {
    const response = await api.get('/empty-legs/alerts');
    return response.data;
  } catch (error) {
    console.error('Error fetching user flight alerts:', error);
    throw error;
  }
};

/**
 * Delete a flight alert
 * @param {string} alertId - ID of the alert to delete
 * @returns {Promise} Promise with deletion confirmation
 */
export const deleteFlightAlert = async (alertId) => {
  try {
    const response = await api.delete(`/empty-legs/alerts/${alertId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting flight alert:', error);
    throw error;
  }
};



export default api;
