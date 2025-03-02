// context/BookingContext.js - Context for managing booking state

import { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  // Booking form data
  const [bookingDetails, setBookingDetails] = useState(null);
  
  // Selected aircraft
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  
  // Charter price estimate
  const [charteredPrice, setCharteredPrice] = useState(null);
  
  // Contact/passenger details
  const [passengerDetails, setPassengerDetails] = useState(null);
  
  // Payment information
  const [paymentInfo, setPaymentInfo] = useState(null);
  
  // Booking confirmation details
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  
  // Clear all booking data
  const clearBookingData = () => {
    setBookingDetails(null);
    setSelectedAircraft(null);
    setCharteredPrice(null);
    setPassengerDetails(null);
    setPaymentInfo(null);
    setBookingConfirmation(null);
  };
  
  // Format price with currency
  const formatPrice = (price, currency = 'USD') => {
    if (!price) return 'N/A';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    return formatter.format(price);
  };
  
  const value = {
    bookingDetails,
    setBookingDetails,
    selectedAircraft,
    setSelectedAircraft,
    charteredPrice,
    setCharteredPrice,
    passengerDetails,
    setPassengerDetails,
    paymentInfo,
    setPaymentInfo,
    bookingConfirmation,
    setBookingConfirmation,
    clearBookingData,
    formatPrice
  };
  
  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook to use the booking context
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;