// components/pages/AircraftDetailsPage.jsx
import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Flex,
  Badge,
  Divider,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  useToast
} from '@chakra-ui/react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  FaPlane, 
  FaUsers, 
  FaRuler, 
  FaClock, 
  FaSuitcase, 
  FaCalendarAlt,
  FaBuilding,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { fetchAircraftById } from '../../utils/aircraftService';
import AircraftImageGallery from '../aircraft/AircraftImageGallery';
import LoadingSpinner from '../ui/LoadingSpinner';

const AircraftDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Fetch aircraft details
  const { data, isLoading, isError, error } = useQuery(
    ['aircraft', id],
    () => fetchAircraftById(id),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (err) => {
        toast({
          title: 'Error loading aircraft details',
          description: err.message || 'Could not load aircraft data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  );
  
  const aircraft = data?.data;
  
  // Calculate estimated range based on aircraft class
  const calculateRange = (aircraft) => {
    if (!aircraft) return 'N/A';
    
    const className = aircraft.aircraftType.class.name;
    // Approximate ranges by aircraft class
    const ranges = {
      'Light': '1,500-2,000 nm',
      'Midsize': '2,000-3,000 nm',
      'Super midsize': '3,000-4,000 nm',
      'Heavy': '4,000-5,000 nm',
      'Ultra long range': '6,000+ nm'
    };
    
    return ranges[className] || 'N/A';
  };
  
  // Calculate estimated cruise speed based on aircraft type
  // components/pages/AircraftDetailsPage.jsx (continued)
  const calculateSpeed = (aircraft) => {
    if (!aircraft) return 'N/A';
    
    // Approximate speeds based on aircraft type
    const aircraftType = aircraft.aircraftType.name;
    if (aircraftType.includes('Citation')) return '450-500 mph';
    if (aircraftType.includes('Learjet')) return '460-520 mph';
    if (aircraftType.includes('Challenger')) return '470-540 mph';
    if (aircraftType.includes('Falcon')) return '480-530 mph';
    if (aircraftType.includes('Gulfstream')) return '500-600 mph';
    if (aircraftType.includes('Global')) return '510-590 mph';
    if (aircraftType.includes('Phenom')) return '450-520 mph';
    
    // Default speeds by class
    const className = aircraft.aircraftType.class.name;
    const speeds = {
      'Light': '440-480 mph',
      'Midsize': '460-510 mph',
      'Super midsize': '490-540 mph',
      'Heavy': '500-560 mph',
      'Ultra long range': '550-610 mph'
    };
    
    return speeds[className] || '450-500 mph';
  };
  
  // Get amenities from aircraft features
  const getAmenities = (aircraft) => {
    const amenities = [];
    
    if (!aircraft || !aircraft.features) {
      return ['Comfortable Seating', 'Air Conditioning', 'Power Outlets'];
    }
    
    if (aircraft.features.wirelessInternet) amenities.push('Wi-Fi Available');
    if (aircraft.features.entertainmentSystem) amenities.push('Entertainment System');
    if (aircraft.features.lavatory) amenities.push('Lavatory');
    if (aircraft.features.hotMeal) amenities.push('Refreshment Center');
    if (aircraft.features.cabinCrew) amenities.push('Cabin Crew');
    if (aircraft.features.satellitePhone) amenities.push('Satellite Phone');
    if (aircraft.features.shower) amenities.push('Shower Available');
    if (aircraft.features.sleepingPlaces && aircraft.features.sleepingPlaces > 0) 
      amenities.push('Sleeping Accommodations');
    
    // Add some default amenities if we have too few
    if (amenities.length < 3) {
      if (!amenities.includes('Power Outlets')) amenities.push('Power Outlets');
      if (!amenities.includes('Leather Seats')) amenities.push('Leather Seats');
      if (!amenities.includes('Work Tables')) amenities.push('Work Tables');
    }
    
    return amenities;
  };
  
  // Get default description if none is available
  const getDefaultDescription = (aircraft) => {
    if (!aircraft) return '';
    
    const type = aircraft.aircraftType.name;
    const className = aircraft.aircraftType.class.name;
    
    return `The ${type} is a versatile ${className.toLowerCase()} jet offering exceptional performance and comfort for ${className.toLowerCase() === 'light' ? 'short to medium' : className.toLowerCase() === 'ultralong' ? 'ultra-long' : 'medium to long'}-range flights. With its ${className.toLowerCase() === 'light' ? 'efficient' : 'spacious'} cabin and advanced avionics, it provides an efficient and comfortable travel experience for up to ${aircraft.passengersMax} passengers.`;
  };
  
  const handleBookNow = () => {
    navigate('/booking', { state: { selectedAircraftId: aircraft.aircraftId } });
  };
  
  const goBackToAircraft = () => {
    navigate('/aircraft');
  };

  // Loading state
  if (isLoading) {
    return (
      <Container maxW="container.xl" py={10}>
        <LoadingSpinner text="Loading aircraft details..." />
      </Container>
    );
  }

  // Error state
  if (isError) {
    return (
      <Container maxW="container.xl" py={10}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error?.message || 'Failed to load aircraft details. Please try again later.'}
        </Alert>
        <Button mt={6} colorScheme="brand" onClick={goBackToAircraft}>
          Back to Aircraft
        </Button>
      </Container>
    );
  }

  // If no aircraft data
  if (!aircraft) {
    return (
      <Container maxW="container.xl" py={10}>
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          No aircraft found with the specified ID.
        </Alert>
        <Button mt={6} colorScheme="brand" onClick={goBackToAircraft}>
          Back to Aircraft
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Button mb={6} onClick={goBackToAircraft} variant="outline" leftIcon={<FaPlane />}>
        Back to Aircraft
      </Button>
      
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={2}>
          {aircraft.aircraftType.name}
        </Heading>
        <HStack spacing={3} mb={4}>
          <Badge colorScheme="brand" fontSize="md" py={1} px={2} borderRadius="md">
            {aircraft.aircraftType.class.name}
          </Badge>
          {aircraft.yearOfProduction && (
            <Badge colorScheme="gray" fontSize="md" py={1} px={2} borderRadius="md">
              Year {aircraft.yearOfProduction}
            </Badge>
          )}
          {aircraft.registration && (
            <Badge colorScheme="green" fontSize="md" py={1} px={2} borderRadius="md">
              {aircraft.registration}
            </Badge>
          )}
        </HStack>
        <Text fontSize="lg" color="gray.600">
          {aircraft.description || getDefaultDescription(aircraft)}
        </Text>
      </Box>
      
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8} mb={10}>
        <GridItem>
          <AircraftImageGallery 
            images={aircraft.images}
            aircraftType={aircraft.aircraftType.name}
            defaultTag="exterior"
          />
        </GridItem>
        
        <GridItem>
          <VStack spacing={6} align="stretch">
            <Heading as="h3" size="md" mb={2}>
              Aircraft Specifications
            </Heading>
            
            <SimpleGrid columns={1} spacing={4}>
              <Specification 
                icon={FaUsers} 
                title="Maximum Passengers" 
                value={`${aircraft.passengersMax || 'N/A'}`} 
              />
              <Specification 
                icon={FaRuler} 
                title="Range" 
                value={calculateRange(aircraft)} 
              />
              <Specification 
                icon={FaClock} 
                title="Cruise Speed" 
                value={calculateSpeed(aircraft)} 
              />
              <Specification 
                icon={FaSuitcase} 
                title="Luggage Capacity" 
                value={`${aircraft.features?.luggageVolume || 'N/A'} cubic meters`} 
              />
              {aircraft.yearOfProduction && (
                <Specification 
                  icon={FaCalendarAlt} 
                  title="Year of Production" 
                  value={aircraft.yearOfProduction} 
                />
              )}
              {aircraft.company && (
                <Specification 
                  icon={FaBuilding} 
                  title="Operator" 
                  value={aircraft.company.name || 'N/A'} 
                />
              )}
              {aircraft.baseAirport && (
                <Specification 
                  icon={FaMapMarkerAlt} 
                  title="Base Airport" 
                  value={`${aircraft.baseAirport.name} (${aircraft.baseAirport.icao})`} 
                />
              )}
            </SimpleGrid>
            
            <Button 
              colorScheme="brand" 
              size="lg" 
              mt={4}
              onClick={handleBookNow}
            >
              Book This Aircraft
            </Button>
          </VStack>
        </GridItem>
      </Grid>
      
      <Box mb={10}>
        <Heading as="h3" size="lg" mb={6}>
          Cabin Features & Amenities
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box 
            bg="white" 
            p={6} 
            borderRadius="lg" 
            boxShadow="md" 
            borderWidth="1px"
          >
            <Heading as="h4" size="md" mb={4}>
              Cabin Dimensions
            </Heading>
            
            <SimpleGrid columns={1} spacing={4}>
              <HStack justify="space-between">
                <Text fontWeight="medium">Cabin Height</Text>
                <Text>{aircraft.features?.cabinHeight ? `${aircraft.features.cabinHeight} m` : 'N/A'}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="medium">Cabin Width</Text>
                <Text>{aircraft.features?.cabinWidth ? `${aircraft.features.cabinWidth} m` : 'N/A'}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="medium">Cabin Length</Text>
                <Text>{aircraft.features?.cabinLength ? `${aircraft.features.cabinLength} m` : 'N/A'}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="medium">Sleeping Places</Text>
                <Text>{aircraft.features?.sleepingPlaces || 'N/A'}</Text>
              </HStack>
            </SimpleGrid>
          </Box>
          
          <Box 
            bg="white" 
            p={6} 
            borderRadius="lg" 
            boxShadow="md" 
            borderWidth="1px"
          >
            <Heading as="h4" size="md" mb={4}>
              Onboard Amenities
            </Heading>
            
            <SimpleGrid columns={2} spacing={4}>
              <AmenityItem 
                name="Wi-Fi" 
                available={aircraft.features?.wirelessInternet} 
              />
              <AmenityItem 
                name="Entertainment System" 
                available={aircraft.features?.entertainmentSystem} 
              />
              <AmenityItem 
                name="Lavatory" 
                available={aircraft.features?.lavatory} 
              />
              <AmenityItem 
                name="Hot Meal Service" 
                available={aircraft.features?.hotMeal} 
              />
              <AmenityItem 
                name="Satellite Phone" 
                available={aircraft.features?.satellitePhone} 
              />
              <AmenityItem 
                name="Cabin Crew" 
                available={aircraft.features?.cabinCrew} 
              />
              <AmenityItem 
                name="Shower" 
                available={aircraft.features?.shower} 
              />
              <AmenityItem 
                name="Pets Allowed" 
                available={aircraft.features?.petsAllowed} 
              />
            </SimpleGrid>
          </Box>
        </SimpleGrid>
      </Box>
      
      <Divider mb={10} />
      
      <Box textAlign="center" mb={20}>
        <Heading as="h3" size="lg" mb={4}>
          Ready to Book This Aircraft?
        </Heading>
        <Text fontSize="lg" mb={6} maxW="3xl" mx="auto">
          Experience the comfort and luxury of the {aircraft.aircraftType.name} for your next trip.
        </Text>
        <Button 
          size="lg" 
          colorScheme="brand" 
          onClick={handleBookNow}
        >
          Book Now
        </Button>
      </Box>
    </Container>
  );
};

// Specification Component
const Specification = ({ icon, title, value }) => {
  return (
    <HStack spacing={3} align="start">
      <Flex
        w={10}
        h={10}
        align="center"
        justify="center"
        rounded="full"
        bg="brand.50"
      >
        <Icon as={icon} color="brand.500" boxSize={5} />
      </Flex>
      <VStack align="start" spacing={0}>
        <Text fontWeight="medium">{title}</Text>
        <Text color="gray.600">{value}</Text>
      </VStack>
    </HStack>
  );
};

// Amenity Item Component
const AmenityItem = ({ name, available }) => {
  return (
    <HStack spacing={2}>
      <Icon 
        color={available ? "green.500" : "gray.400"} 
        boxSize={5} 
        as={available ? FaCheck : FaTimes} 
      />
      <Text color={available ? "gray.800" : "gray.500"}>{name}</Text>
    </HStack>
  );
};

// Missing FaCheck and FaTimes imports


export default AircraftDetailsPage;