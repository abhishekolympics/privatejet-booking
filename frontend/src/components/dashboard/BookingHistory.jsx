// 10. frontend/src/components/dashboard/BookingHistory.jsx
import React from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Image,
  Flex,
  Button,
  Divider,
  Heading,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';
import { FaPlane, FaCalendarAlt, FaClock, FaUserFriends } from 'react-icons/fa';
import { formatDate, formatTime, formatPrice } from '../../utils/formatters';
import { Link } from 'react-router-dom';

const BookingHistory = ({ bookings = [] }) => {
  if (!bookings || bookings.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Heading size="md" mb={4}>No Bookings Found</Heading>
        <Text color="gray.600" mb={6}>You haven't made any bookings yet.</Text>
        <Button as={Link} to="/booking" colorScheme="brand" variant="luxury">
          Book Your First Flight
        </Button>
      </Box>
    );
  }
  
  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md" mb={4}>Your Bookings</Heading>
      
      <Accordion allowMultiple defaultIndex={[0]}>
        {bookings.map((booking) => (
          <AccordionItem key={booking._id}>
            <h2>
              <AccordionButton py={4}>
                <HStack flex="1" spacing={4} textAlign="left">
                  <Box>
                    <Badge 
                      colorScheme={
                        booking.status === 'completed' ? 'green' : 
                        booking.status === 'confirmed' ? 'blue' : 
                        booking.status === 'cancelled' ? 'red' : 'yellow'
                      }
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </Box>
                  <Box flex="1">
                    <Text fontWeight="bold">
                      {booking.flightDetails.legs[0].departureAirport.icao} → {booking.flightDetails.legs[0].arrivalAirport.icao}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {formatDate(booking.flightDetails.legs[0].departureDateTime)}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">
                      {formatPrice(booking.price.amount, booking.price.currency)}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {booking.aircraft.type}
                    </Text>
                  </Box>
                </HStack>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box>
                  <Heading size="sm" mb={4}>Flight Details</Heading>
                  <VStack spacing={4} align="stretch">
                    {booking.flightDetails.legs.map((leg, index) => (
                      <Box 
                        key={index}
                        p={4}
                        bg="gray.50"
                        borderRadius="md"
                      >
                        <Text fontWeight="bold" mb={2}>
                          {index === 0 ? 'Departure Flight' : 'Return Flight'}
                        </Text>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                          <HStack>
                            <Box color="brand.500"><FaPlane /></Box>
                            <Text>
                              <strong>{leg.departureAirport.icao}</strong>
                              {' → '}
                              <strong>{leg.arrivalAirport.icao}</strong>
                            </Text>
                          </HStack>
                          <HStack>
                            <Box color="brand.500"><FaCalendarAlt /></Box>
                            <Text>{formatDate(leg.departureDateTime)}</Text>
                          </HStack>
                          <HStack>
                            <Box color="brand.500"><FaClock /></Box>
                            <Text>{formatTime(leg.departureDateTime)}</Text>
                          </HStack>
                          <HStack>
                            <Box color="brand.500"><FaUserFriends /></Box>
                            <Text>{leg.passengers} Passengers</Text>
                          </HStack>
                        </SimpleGrid>
                      </Box>
                    ))}
                  </VStack>
                </Box>
                
                <Box>
                  <Heading size="sm" mb={4}>Aircraft Details</Heading>
                  <Flex 
                    bg="gray.50" 
                    p={4} 
                    borderRadius="md" 
                    direction={{ base: 'column', sm: 'row' }}
                    gap={4}
                  >
                    {booking.aircraft.imageUrl ? (
                      <Image 
                        src={booking.aircraft.imageUrl} 
                        alt={booking.aircraft.type}
                        objectFit="cover"
                        borderRadius="md"
                        maxW={{ base: '100%', sm: '200px' }}
                        h={{ base: '200px', sm: '150px' }}
                      />
                    ) : (
                      <Box 
                        bg="gray.200" 
                        borderRadius="md"
                        width={{ base: '100%', sm: '200px' }}
                        height={{ base: '200px', sm: '150px' }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text color="gray.500">No Image</Text>
                      </Box>
                    )}
                    
                    <VStack align="stretch" flex="1">
                      <Text fontWeight="bold">{booking.aircraft.type}</Text>
                      <Text fontSize="sm">{booking.aircraft.model}</Text>
                      <Text fontSize="sm">Seats: {booking.aircraft.totalSeats}</Text>
                      <Text fontSize="sm">Range: {booking.aircraft.range} nm</Text>
                      <Text fontSize="sm">Speed: {booking.aircraft.cruiseSpeed} knots</Text>
                    </VStack>
                  </Flex>
                  
                  <Heading size="sm" my={4}>Booking Information</Heading>
                  <VStack 
                    spacing={3} 
                    align="stretch" 
                    bg="gray.50" 
                    p={4} 
                    borderRadius="md"
                  >
                    <Flex justify="space-between">
                      <Text>Booking ID:</Text>
                      <Text fontWeight="medium">{booking._id}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text>Booking Date:</Text>
                      <Text>{formatDate(booking.bookingDate)}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text>Total Price:</Text>
                      <Text fontWeight="bold">{formatPrice(booking.price.amount, booking.price.currency)}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text>Status:</Text>
                      <Badge 
                        colorScheme={
                          booking.status === 'completed' ? 'green' : 
                          booking.status === 'confirmed' ? 'blue' : 
                          booking.status === 'cancelled' ? 'red' : 'yellow'
                        }
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </Flex>
                    {booking.paymentMethod && (
                      <Flex justify="space-between">
                        <Text>Payment Method:</Text>
                        <Text>{booking.paymentMethod}</Text>
                      </Flex>
                    )}
                  </VStack>
                </Box>
              </SimpleGrid>
              
              <Divider my={6} />
              
              <Flex justify="flex-end" gap={3}>
                {booking.status === 'confirmed' && (
                  <Button 
                    size="sm" 
                    colorScheme="red" 
                    variant="outline"
                  >
                    Cancel Booking
                  </Button>
                )}
                <Button 
                  size="sm" 
                  colorScheme="brand"
                  as={Link}
                  to={`/booking/${booking._id}`}
                >
                  View Details
                </Button>
                {(booking.status === 'confirmed' || booking.status === 'completed') && (
                  <Button 
                    size="sm" 
                    colorScheme="brand" 
                    variant="outline"
                  >
                    Download Invoice
                  </Button>
                )}
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </VStack>
  );
};

export default BookingHistory;