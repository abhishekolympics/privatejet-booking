// src/Router.js - Updated for Password Reset
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/routing/PrivateRoute';

// Page components
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';
import ResetPasswordPage from './components/pages/ResetPasswordPage';
import BookingPage from './components/pages/BookingPage';
import AircraftSelectionPage from './components/pages/AircraftSelectionPage';
import BookingConfirmationPage from './components/pages/BookingConfirmationPage';
import PaymentPage from './components/pages/PaymentPage';
import DashboardPage from './components/pages/DashboardPage';
import NotFoundPage from './components/pages/NotFoundPage';
import ContactPage from './components/pages/ContactPage';
import CareerPage from './components/pages/CareerPage';
import PartnersPage from './components/pages/PartnersPage';
import EmptyLegsPage from './components/pages/EmptyLegsPage';
import AircraftTypesPage from './components/pages/AircraftTypesPage';
import AircraftDetailsPage from './components/pages/AircraftDetailsPage';
import AircraftManagementPage from './components/pages/AircraftManagementPage';
import ConciergeServicesPage from './components/pages/ConciergeServicesPage';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/careers" element={<CareerPage />} />
      <Route path="/partners" element={<PartnersPage />} />
      <Route path="/empty-legs" element={<EmptyLegsPage />} />
      <Route path="/aircraft-types" element={<AircraftTypesPage />} />
      <Route path="/aircraft-management" element={<AircraftManagementPage />} />
      <Route path="/concierge" element={<ConciergeServicesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
      <Route path="/aircraft-types" element={<AircraftTypesPage />} />
      <Route path="/aircraft/:id" element={<AircraftDetailsPage />} />
      
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
      
      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;