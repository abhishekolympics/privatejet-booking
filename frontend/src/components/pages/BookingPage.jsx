// src/components/pages/BookingPage.jsx

import React from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import BookingForm from '../booking/BookingForm';

const BookingPage = () => {
  return (
    <Container maxW="container.xl" py={10}>
      <Heading as="h1" size="xl" mb={6}>Book Your Private Jet</Heading>
      <BookingForm />
    </Container>
  );
};

export default BookingPage;