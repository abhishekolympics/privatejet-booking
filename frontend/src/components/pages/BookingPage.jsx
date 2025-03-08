// src/components/pages/BookingPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Heading } from '@chakra-ui/react';
import BookingForm from '../booking/BookingForm';

const BookingPage = () => {

  const [destinationAirport, setDestinationAirport] = useState(null);

  useEffect(() => {
    const airport = sessionStorage.getItem('selectedDestinationAirport');
    
    if (airport) {
      setDestinationAirport(airport);
      console.log(`Destination airport in Booking page: ${airport}`);
      sessionStorage.removeItem('selectedDestinationAirport');
    }
  }, []);

  return (
    <Container maxW="container.xl" py={10}>
      <Heading as="h1" size="xl" mb={6}>Book Your Private Jet</Heading>
      <BookingForm destinationAirport={destinationAirport} />
    </Container>
  );
};

export default BookingPage;