// 8. frontend/src/components/booking/BookingSummary.jsx
import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Divider,
  Badge,
  Stack,
  Button,
  HStack,
  VStack,
  Image
} from '@chakra-ui/react';
import { FaPlane, FaCalendarAlt, FaClock, FaUserFriends } from 'react-icons/fa';
import { formatDate, formatTime, formatPrice } from '../../utils/formatters';
import { useBooking } from '../../hooks/useBooking';

const BookingSummary = ({ onConfirm }) => {
  const { bookingDetails, selectedAircraft, charteredPrice } = useBooking();
  
  if (!bookingDetails || !selectedAircraft || !charteredPrice) {
    return null;
  }
  
  const mainImage = selectedAircraft.images && selectedAircraft.images.length > 0
    ? selectedAircraft.images.find(img => img.image_type === "exterior")?.url || selectedAircraft.images[0].url
    : "/images/aircraft-placeholder.jpg";
  
  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden" 
      boxShadow="md"
      bg="white"
    >
      <Box bg="brand.500" py={4} px={6}>
        <Heading size="md" color="white">Booking Summary</Heading>
      </Box>
      
      <Stack spacing={6} p={6}>
        <Box>
          <Heading size="sm" mb={3}>Selected Aircraft</Heading>
          <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
            <Box 
              width={{ base: 'full', md: '200px' }} 
              height={{ base: '150px', md: '120px' }} 
              borderRadius="md" 
              overflow="hidden"
            >
              <Image 
                src={mainImage} 
                alt={selectedAircraft.aircraft_type} 
                objectFit="cover"
                width="100%"
                height="100%"
              />
            </Box>
            
            <VStack align="flex-start" flex="1" spacing={2}>
              <Heading size="md">{selectedAircraft.aircraft_type}</Heading>
              <HStack>
                <Badge colorScheme="green">{selectedAircraft.registration_number}</Badge>
                <Badge colorScheme="purple">Max {selectedAircraft.passengers_max} Passengers</Badge>
              </HStack>
              <Text fontSize="sm">Operated by: {selectedAircraft.company?.name || 'Private Operator'}</Text>
              <Text fontSize="sm">Year: {selectedAircraft.year_of_production}</Text>
            </VStack>
          </Flex>
        </Box>
        
        <Divider />
        
        <Box>
          <Heading size="sm" mb={3}>Flight Details</Heading>
          <Stack spacing={4}>
            {bookingDetails.legs.map((leg, index) => (
              <Box 
                key={index} 
                p={4} 
                bg="gray.50" 
                borderRadius="md"
              >
                <Text fontWeight="bold" mb={2}>
                  {index === 0 ? 'Departure Flight' : 'Return Flight'}
                </Text>
                
                <Flex 
                  direction={{ base: 'column', sm: 'row' }} 
                  justify="space-between"
                  align={{ base: 'flex-start', sm: 'center' }}
                  gap={3}
                >
                  <HStack>
                    <Box color="brand.500"><FaPlane /></Box>
                    <Text>
                      <strong>{leg.departure_airport.icao}</strong>
                      {' → '}
                      <strong>{leg.arrival_airport.icao}</strong>
                    </Text>
                  </HStack>
                  
                  <HStack>
                    <Box color="brand.500"><FaCalendarAlt /></Box>
                    <Text>{formatDate(leg.departure_datetime)}</Text>
                  </HStack>
                  
                  <HStack>
                    <Box color="brand.500"><FaClock /></Box>
                    <Text>{formatTime(leg.departure_datetime)}</Text>
                  </HStack>
                  
                  <HStack>
                    <Box color="brand.500"><FaUserFriends /></Box>
                    <Text>{leg.pax} Passengers</Text>
                  </HStack>
                </Flex>
              </Box>
            ))}
          </Stack>
        </Box>
        
        <Divider />
        
        <Flex justify="space-between" align="center">
          <Box>
            <Text fontSize="sm" color="gray.600">Total Price</Text>
            <Heading size="lg" color="brand.500">
              {formatPrice(charteredPrice.price, charteredPrice.currency_code)}
            </Heading>
          </Box>
          
          <Button 
            colorScheme="brand" 
            size="lg" 
            variant="luxury" 
            onClick={onConfirm}
          >
            Confirm Booking
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};

export default BookingSummary;