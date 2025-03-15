// components/pages/EmptyLegsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Button,
  Divider,
  Flex,
  Icon,
  Input,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Badge,
  useDisclosure,
  Alert,
  AlertIcon,
  useToast
} from '@chakra-ui/react';
import { FaPlane, FaCalendarAlt, FaPercent, FaSearch, FaArrowRight, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  fetchEmptyLegs, 
  searchEmptyLegs,
  bookEmptyLeg,
  setUpFlightAlert
} from '../../utils/api';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyLegBookingModal from '../emptylegs/EmptyLegBookingModal';
import FlightAlertModal from '../emptylegs/FlightAlertModal';

const EmptyLegsPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [emptyLegs, setEmptyLegs] = useState([]);
  const [filteredLegs, setFilteredLegs] = useState([]);
  const [departureFilter, setDepartureFilter] = useState('');
  const [arrivalFilter, setArrivalFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeg, setSelectedLeg] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Modals
  const { 
    isOpen: isBookingModalOpen, 
    onOpen: onBookingModalOpen, 
    onClose: onBookingModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isAlertModalOpen, 
    onOpen: onAlertModalOpen, 
    onClose: onAlertModalClose 
  } = useDisclosure();

  // Fetch empty legs on component mount
  useEffect(() => {
    const getEmptyLegs = async () => {
      try {
        setIsLoading(true);
        const data = await fetchEmptyLegs();
        setEmptyLegs(data);
        setFilteredLegs(data);
      } catch (err) {
        setError('Unable to load empty leg flights. Please try again later.');
        console.error('Error fetching empty legs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getEmptyLegs();
  }, []);

  // Handle search
  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      // If all filters are empty, reset to show all
      if (!departureFilter && !arrivalFilter && !dateFilter) {
        setFilteredLegs(emptyLegs);
        setIsSearching(false);
        return;
      }
      
      // Construct search params
      const searchParams = {};
      if (departureFilter) searchParams.departure = departureFilter;
      if (arrivalFilter) searchParams.arrival = arrivalFilter;
      if (dateFilter) searchParams.date = dateFilter;
      
      // API call
      const results = await searchEmptyLegs(searchParams);
      setFilteredLegs(results);
      
      // Show message if no results
      if (results.length === 0) {
        toast({
          title: "No flights found",
          description: "No empty leg flights match your search criteria. Try different search parameters.",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Search Error",
        description: "There was an error processing your search. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error('Error searching empty legs:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle book now button click
  const handleBookNow = (leg) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to book an empty leg flight.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      navigate('/login', { state: { from: { pathname: '/empty-legs' } } });
      return;
    }
    
    setSelectedLeg(leg);
    onBookingModalOpen();
  };

  // Handle flight alert setup
  const handleSetupAlert = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to set up flight alerts.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      navigate('/login', { state: { from: { pathname: '/empty-legs' } } });
      return;
    }
    
    onAlertModalOpen();
  };

  // Handle booking submission
  const handleBookingSubmit = async (bookingData) => {
    try {
      const response = await bookEmptyLeg(selectedLeg.id, bookingData);
      
      toast({
        title: "Booking Successful",
        description: "Your empty leg flight has been booked successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      onBookingModalClose();
      
      // Navigate to booking confirmation
      navigate('/booking-confirmation', { state: { bookingData: response } });
    } catch (err) {
      toast({
        title: "Booking Error",
        description: err.response?.data?.message || "There was an error processing your booking. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle flight alert submission
  const handleAlertSubmit = async (alertData) => {
    try {
      await setUpFlightAlert(alertData);
      
      toast({
        title: "Alert Set Up",
        description: "You will receive notifications when matching empty leg flights become available.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      onAlertModalClose();
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "There was an error setting up your alert. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <Container maxW="container.xl" py={10}>
        <LoadingSpinner text="Loading empty leg flights..." />
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container maxW="container.xl" py={10}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      {/* Hero Section */}
      <Box textAlign="center" mb={20}>
        <Heading as="h1" size="2xl" mb={6}>
          Empty Leg Flights
        </Heading>
        <Text fontSize="xl" maxW="3xl" mx="auto" color="gray.600">
          Book private jet flights at up to 75% off standard charter prices with our exclusive empty leg opportunities.
        </Text>
      </Box>

      {/* What are Empty Legs */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} mb={20}>
        <Box>
          <Heading as="h2" size="xl" mb={6}>
            What Are Empty Leg Flights?
          </Heading>
          <VStack spacing={4} align="start">
            <Text>
              Empty leg flights occur when a private jet needs to return to its home base or reposition for the next client without any passengers on board.
            </Text>
            <Text>
              These flights represent an opportunity for significant savings—often 50-75% off standard charter prices—while still enjoying the luxury and convenience of private aviation.
            </Text>
            <Text>
              Because these flights are pre-scheduled based on other bookings, they offer less flexibility in terms of departure times and dates, but provide exceptional value for travelers with flexible schedules.
            </Text>
            <Text>
              At PrivateJet, we maintain a constantly updated database of empty leg flights available through our operator network, making it easy for you to find and book these exclusive deals.
            </Text>
          </VStack>
          
          <HStack spacing={8} mt={8}>
            <VStack align="center">
              <Heading size="xl" color="brand.500">50-75%</Heading>
              <Text textAlign="center">Average savings on regular charter prices</Text>
            </VStack>
            <VStack align="center">
              <Heading size="xl" color="brand.500">100+</Heading>
              <Text textAlign="center">Empty leg flights available daily worldwide</Text>
            </VStack>
            <VStack align="center">
              <Heading size="xl" color="brand.500">24/7</Heading>
              <Text textAlign="center">Real-time updates and instant booking</Text>
            </VStack>
          </HStack>
        </Box>
        
        <Flex justify="center" align="center" direction="column" spacing={6}>
          <Box
            bg="brand.50"
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="brand.100"
            mb={6}
            width="100%"
          >
            <VStack align="start" spacing={4}>
              <Heading as="h3" size="md" color="brand.700">
                <Icon as={FaPercent} mr={2} />
                Significant Savings
              </Heading>
              <Text>
                Save up to 75% compared to traditional private jet charter prices.
              </Text>
            </VStack>
          </Box>
          
          <Box
            bg="brand.50"
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="brand.100"
            mb={6}
            width="100%"
          >
            <VStack align="start" spacing={4}>
              <Heading as="h3" size="md" color="brand.700">
                <Icon as={FaPlane} mr={2} />
                Same Luxury Experience
              </Heading>
              <Text>
                Enjoy the same aircraft, crew, and premium service as regular charter flights.
              </Text>
            </VStack>
          </Box>
          
          <Box
            bg="brand.50"
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="brand.100"
            width="100%"
          >
            <VStack align="start" spacing={4}>
              <Heading as="h3" size="md" color="brand.700">
                <Icon as={FaCalendarAlt} mr={2} />
                Flexibility Required
              </Heading>
              <Text>
                Best for travelers with flexible schedules who can adapt to pre-set departure times.
              </Text>
            </VStack>
          </Box>
        </Flex>
      </SimpleGrid>

      <Divider my={10} />

      {/* Search Section */}
      <Box mb={16}>
        <Heading as="h2" size="xl" textAlign="center" mb={8}>
          Find Available Empty Legs
        </Heading>
        
        <Box 
          bg="white" 
          p={6} 
          borderRadius="lg" 
          boxShadow="md"
          mb={10}
        >
          <Grid 
            templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr) auto" }}
            gap={4}
          >
            <GridItem>
              <FormControl>
                <FormLabel>Departure</FormLabel>
                <Input 
                  placeholder="City or airport" 
                  value={departureFilter}
                  onChange={(e) => setDepartureFilter(e.target.value)}
                />
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>Arrival</FormLabel>
                <Input 
                  placeholder="City or airport" 
                  value={arrivalFilter}
                  onChange={(e) => setArrivalFilter(e.target.value)}
                />
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>Date (From)</FormLabel>
                <Input 
                  type="date" 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </FormControl>
            </GridItem>
            
            <GridItem display="flex" alignItems="flex-end">
              <Button 
                colorScheme="brand" 
                leftIcon={<FaSearch />}
                onClick={handleSearch}
                width="full"
                isLoading={isSearching}
                loadingText="Searching"
              >
                Search
              </Button>
            </GridItem>
          </Grid>
        </Box>
        
        {/* Results */}
        {isSearching ? (
          <LoadingSpinner text="Searching for flights..." />
        ) : (
          <>
            {filteredLegs.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {filteredLegs.map((leg) => (
                  <EmptyLegCard 
                    key={leg.id} 
                    leg={leg} 
                    onBookNow={() => handleBookNow(leg)} 
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Box textAlign="center" py={10}>
                <Text fontSize="lg">No empty leg flights found. Try different search criteria.</Text>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* How to Book */}
      <Box mb={20}>
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          How to Book an Empty Leg Flight
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <ProcessCard 
            number="01" 
            title="Search" 
            description="Browse our current empty leg availability or set up alerts for specific routes." 
          />
          <ProcessCard 
            number="02" 
            title="Book" 
            description="Reserve your empty leg flight instantly with secure online payment." 
          />
          <ProcessCard 
            number="03" 
            title="Fly" 
            description="Enjoy your private jet experience at a fraction of the usual cost." 
          />
        </SimpleGrid>
      </Box>

      {/* CTA Section */}
      <Box 
        bg="brand.500" 
        borderRadius="xl" 
        p={{ base: 6, md: 10 }}
        color="white"
        textAlign="center"
      >
        <Heading as="h2" size="xl" mb={4}>
          Never Miss an Empty Leg Opportunity
        </Heading>
        <Text fontSize="lg" mb={6} maxW="3xl" mx="auto">
          Sign up for alerts on specific routes and receive instant notifications when empty leg flights become available.
        </Text>
        <Button 
          size="lg" 
          colorScheme="white" 
          variant="outline" 
          _hover={{ bg: 'whiteAlpha.200' }}
          leftIcon={<FaBell />}
          onClick={handleSetupAlert}
        >
          Set Up Flight Alerts
        </Button>
      </Box>
      
      {/* Modals */}
      {selectedLeg && (
        <EmptyLegBookingModal
          isOpen={isBookingModalOpen}
          onClose={onBookingModalClose}
          emptyLeg={selectedLeg}
          onSubmit={handleBookingSubmit}
        />
      )}
      
      <FlightAlertModal
        isOpen={isAlertModalOpen}
        onClose={onAlertModalClose}
        onSubmit={handleAlertSubmit}
        currentDeparture={departureFilter}
        currentArrival={arrivalFilter}
      />
    </Container>
  );
};

const EmptyLegCard = ({ leg, onBookNow }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format time for display
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };
  
  // Formats price with commas and currency symbol
  const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency,
      maximumFractionDigits: 0 
    }).format(price);
  };
  
  return (
    <Box 
      bg="white" 
      p={5} 
      borderRadius="lg" 
      boxShadow="md"
      borderWidth="1px"
      position="relative"
      transition="transform 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
    >
      <Badge 
        position="absolute" 
        top={3} 
        right={3} 
        colorScheme="red" 
        fontSize="sm"
      >
        Save {leg.savingsPercentage}%
      </Badge>
      
      <VStack align="start" spacing={4}>
        <Flex width="100%" justify="space-between" align="center">
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold" fontSize="lg">{formatDate(leg.departureDateTime)}</Text>
            <Text color="gray.500" fontSize="sm">{formatTime(leg.departureDateTime)}</Text>
          </VStack>
          <Text color="gray.500">{leg.aircraft.type}</Text>
        </Flex>
        
        <Flex width="100%" align="center">
          <Text fontWeight="bold" fontSize="md">{leg.departureAirport.code}</Text>
          <Icon as={FaArrowRight} mx={2} color="brand.500" />
          <Text fontWeight="bold" fontSize="md">{leg.arrivalAirport.code}</Text>
        </Flex>
        
        <Flex width="100%" justify="space-between" align="center">
          <Text>{leg.aircraft.capacity} passengers</Text>
          <Heading size="md" color="brand.500">{formatPrice(leg.price, leg.currency)}</Heading>
        </Flex>
        
        <Button 
          colorScheme="brand" 
          size="sm" 
          width="full"
          onClick={onBookNow}
        >
          Book Now
        </Button>
      </VStack>
    </Box>
  );
};

const ProcessCard = ({ number, title, description }) => {
  return (
    <VStack 
      bg="white" 
      p={6} 
      borderRadius="lg" 
      boxShadow="base"
      borderWidth="1px"
      align="center"
      spacing={4}
    >
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        rounded="full"
        bg="brand.50"
        color="brand.500"
        fontSize="2xl"
        fontWeight="bold"
      >
        {number}
      </Flex>
      <Heading as="h3" size="md">
        {title}
      </Heading>
      <Text color="gray.600" textAlign="center">{description}</Text>
    </VStack>
  );
};

export default EmptyLegsPage;