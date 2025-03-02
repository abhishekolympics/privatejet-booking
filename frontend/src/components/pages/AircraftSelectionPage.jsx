// src/components/pages/AircraftSelectionPage.jsx

import React, { useEffect } from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import AircraftResults from '../booking/AircraftResults';
import { useBooking } from '../../hooks/useBooking';

const AircraftSelectionPage = () => {
  const { bookingDetails } = useBooking();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to booking page if no booking details exist
    if (!bookingDetails || !bookingDetails.legs || bookingDetails.legs.length === 0) {
      navigate('/booking');
    }
  }, [bookingDetails, navigate]);
  
  return (
    <Container maxW="container.xl" py={10}>
      <Heading as="h1" size="xl" mb={6}>Select Your Aircraft</Heading>
      <AircraftResults />
    </Container>
  );
};

export default AircraftSelectionPage;