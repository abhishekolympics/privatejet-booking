// utils/api.js - API utilities for frontend (updated for password reset)

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API calls
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  
  // Store token in localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Password Reset API calls
export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (resetToken, password) => {
  const response = await api.post(`/auth/reset-password/${resetToken}`, { password });
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put('/auth/change-password', { currentPassword, newPassword });
  return response.data;
};

// Aviapages API calls
export const searchAirports = async (term) => {
  const response = await api.get(`/aviapages/airports?term=${term}`);
  return response.data;
};

export const getAircraftClasses = async () => {
  const response = await api.get('/aviapages/aircraft-classes');
  return response.data;
};

export const getCharterPrice = async (data) => {
  const response = await api.post('/aviapages/charter-price', data);
  return response.data;
};

export const searchAircraft = async (data) => {
  const response = await api.post('/aviapages/search-aircraft', data);
  return response.data;
};

export const getAircraftDetails = async (id) => {
  const response = await api.get(`/aviapages/aircraft/${id}`);
  return response.data;
};

export const createQuote = async (data) => {
  const response = await api.post('/aviapages/create-quote', data);
  return response.data;
};

// Booking API calls
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const getUserBookings = async () => {
  const response = await api.get('/bookings');
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
  const response = await api.patch('/users/me', userData);
  return response.data;
};

export const addPaymentMethod = async (paymentData) => {
  const response = await api.post('/users/payment-methods', paymentData);
  return response.data;
};

export const getPaymentMethods = async () => {
  const response = await api.get('/users/payment-methods');
  return response.data;
};

export default api;