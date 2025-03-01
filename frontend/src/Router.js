import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import BookingPage from './components/pages/BookingPage';
import AircraftSelectionPage from './components/pages/AircraftSelectionPage';
import BookingConfirmationPage from './components/pages/BookingConfirmationPage';
import PaymentPage from './components/pages/PaymentPage';
import DashboardPage from './components/pages/DashboardPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import AboutPage from './components/pages/AboutPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/aircraft-selection" element={<AircraftSelectionPage />} />
      <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
};

export default AppRouter;
