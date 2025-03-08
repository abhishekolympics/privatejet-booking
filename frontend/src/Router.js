// src/Router.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/routing/PrivateRoute';

// Page components
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import BookingPage from './components/pages/BookingPage';
import AircraftSelectionPage from './components/pages/AircraftSelectionPage';
import BookingConfirmationPage from './components/pages/BookingConfirmationPage';
import PaymentPage from './components/pages/PaymentPage';
import DashboardPage from './components/pages/DashboardPage';
import NotFoundPage from './components/pages/NotFoundPage';
import ContactPage from './components/pages/ContactPage';
import CareerPage from './components/pages/CareerPage';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/careers" element={<CareerPage />} />
      
      {/* Protected Routes */}
      <Route path="/booking" element={
        <PrivateRoute>
          <BookingPage />
        </PrivateRoute>
      } />
      <Route path="/aircraft-selection" element={
        <PrivateRoute>
          <AircraftSelectionPage />
        </PrivateRoute>
      } />
      <Route path="/booking-confirmation" element={
        <PrivateRoute>
          <BookingConfirmationPage />
        </PrivateRoute>
      } />
      <Route path="/payment" element={
        <PrivateRoute>
          <PaymentPage />
        </PrivateRoute>
      } />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      } />
      <Route path="/contact" element={
        <PrivateRoute>
          <ContactPage />
        </PrivateRoute>
      } />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;