// src/components/pages/BookingConfirmationPage.jsx

import React, { useEffect } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Button, 
  Stack, 
  Divider, 
  Flex, 
  VStack, 
  HStack,
  Badge
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const { bookingDetails, selectedAircraft, charteredPrice, formatPrice } = useBooking();
  
  useEffect(() => {
    // Redirect if necessary data is missing
    if (!bookingDetails || !selectedAircraft || !charteredPrice) {
      navigate('/booking');
    }
  }, [bookingDetails, selectedAircraft, charteredPrice, navigate]);
  
  const handleProceedToPayment = () => {
    navigate('/payment');
  };
  
  if (!bookingDetails || !selectedAircraft || !charteredPrice) {
    return null; // Will redirect in useEffect
  }
  
  const firstLeg = bookingDetails.legs[0];
  
  return (
    <Container maxW="container.xl" py={10}>
      <Heading as="h1" size="xl" mb={6}>Booking Confirmation</Heading>
      
      <Box bg="white" borderRadius="lg" boxShadow="md" overflow="hidden">
        <Box bg="brand.500" py={4} px={6}>
          <Heading size="md" color="white">Booking Summary</Heading>
        </Box>
        
        <Stack spacing={6} p={6}>
          <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
            <VStack flex="1" align="stretch" spacing={4}>
              <Heading size="sm">Flight Details</Heading>
              {bookingDetails.legs.map((leg, index) => (
                <Box key={index} p={4} bg="gray.50" borderRadius="md">
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="bold">{index === 0 ? 'Departure Flight' : 'Return Flight'}</Text>
                    <Badge colorScheme="brand">{leg.passengers} Passengers</Badge>
                  </HStack>
                  <HStack spacing={4}>
                    <VStack align="flex-start" flex="1">
                      <Text fontSize="sm" color="gray.500">From</Text>
                      <Text fontWeight="medium">{leg.departure_airport.icao}</Text>
                    </VStack>
                    <VStack align="flex-start" flex="1">
                      <Text fontSize="sm" color="gray.500">To</Text>
                      <Text fontWeight="medium">{leg.arrival_airport.icao}</Text>
                    </VStack>
                    <VStack align="flex-start" flex="1">
                      <Text fontSize="sm" color="gray.500">Date</Text>
                      <Text fontWeight="medium">{new Date(leg.departure_datetime).toLocaleDateString()}</Text>
                    </VStack>
                    <VStack align="flex-start" flex="1">
                      <Text fontSize="sm" color="gray.500">Time</Text>
                      <Text fontWeight="medium">{new Date(leg.departure_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
            
            <VStack flex="1" align="stretch" spacing={4}>
              <Heading size="sm">Aircraft Details</Heading>
              <Box p={4} bg="gray.50" borderRadius="md">
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="bold">{selectedAircraft.aircraft_type}</Text>
                  <Badge colorScheme="green">{selectedAircraft.registration_number}</Badge>
                </HStack>
                <HStack spacing={4} mb={2}>
                  <VStack align="flex-start" flex="1">
                    <Text fontSize="sm" color="gray.500">Operator</Text>
                    <Text fontWeight="medium">{selectedAircraft.company?.name || 'Private Operator'}</Text>
                  </VStack>
                  <VStack align="flex-start" flex="1">
                    <Text fontSize="sm" color="gray.500">Max Passengers</Text>
                    <Text fontWeight="medium">{selectedAircraft.passengers_max}</Text>
                  </VStack>
                </HStack>
                <HStack spacing={4}>
                  <VStack align="flex-start" flex="1">
                    <Text fontSize="sm" color="gray.500">Year</Text>
                    <Text fontWeight="medium">{selectedAircraft.year_of_production}</Text>
                  </VStack>
                </HStack>
              </Box>
            </VStack>
          </Flex>
          
          <Divider />
          
          <Flex justify="space-between" align="center">
            <VStack align="flex-start" spacing={1}>
              <Text fontSize="sm">Total Price</Text>
              <Heading size="lg" color="brand.500">
                {formatPrice(charteredPrice.price, charteredPrice.currency_code)}
              </Heading>
            </VStack>
            
            <Button 
              size="lg" 
              colorScheme="brand" 
              variant="luxury"
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </Button>
          </Flex>
        </Stack>
      </Box>
    </Container>
  );
};

export default BookingConfirmationPage;