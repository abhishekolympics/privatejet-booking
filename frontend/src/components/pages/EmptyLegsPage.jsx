// components/pages/EmptyLegsPage.jsx
import React, { useState } from 'react';
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
  Select,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import { FaPlane, FaCalendarAlt, FaPercent, FaSearch, FaArrowRight } from 'react-icons/fa';

// Mock data for empty leg flights
const emptyLegsData = [
  {
    id: 1,
    from: 'New York (KJFK)',
    to: 'Miami (KMIA)',
    date: '2025-03-15',
    aircraft: 'Citation XLS',
    capacity: '8 passengers',
    savings: '65%',
    price: '$4,900'
  },
  {
    id: 2,
    from: 'London (EGLL)',
    to: 'Paris (LFPG)',
    date: '2025-03-10',
    aircraft: 'Phenom 300',
    capacity: '6 passengers',
    savings: '70%',
    price: '$3,200'
  },
  {
    id: 3,
    from: 'Los Angeles (KLAX)',
    to: 'Las Vegas (KLAS)',
    date: '2025-03-12',
    aircraft: 'Citation CJ3',
    capacity: '7 passengers',
    savings: '55%',
    price: '$2,800'
  },
  {
    id: 4,
    from: 'Dubai (OMDB)',
    to: 'Riyadh (OERK)',
    date: '2025-03-18',
    aircraft: 'Gulfstream G450',
    capacity: '14 passengers',
    savings: '60%',
    price: '$9,500'
  },
  {
    id: 5,
    from: 'Miami (KMIA)',
    to: 'New York (KJFK)',
    date: '2025-03-20',
    aircraft: 'Challenger 350',
    capacity: '9 passengers',
    savings: '50%',
    price: '$7,200'
  },
  {
    id: 6,
    from: 'Paris (LFPG)',
    to: 'Geneva (LSGG)',
    date: '2025-03-11',
    aircraft: 'Legacy 500',
    capacity: '12 passengers',
    savings: '65%',
    price: '$5,100'
  }
];

const EmptyLegsPage = () => {
  const [filteredLegs, setFilteredLegs] = useState(emptyLegsData);
  const [departureFilter, setDepartureFilter] = useState('');
  const [arrivalFilter, setArrivalFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const handleSearch = () => {
    let results = emptyLegsData;
    
    if (departureFilter) {
      results = results.filter(leg => 
        leg.from.toLowerCase().includes(departureFilter.toLowerCase())
      );
    }
    
    if (arrivalFilter) {
      results = results.filter(leg => 
        leg.to.toLowerCase().includes(arrivalFilter.toLowerCase())
      );
    }
    
    if (dateFilter) {
      results = results.filter(leg => 
        leg.date >= dateFilter
      );
    }
    
    setFilteredLegs(results);
  };

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
              >
                Search
              </Button>
            </GridItem>
          </Grid>
        </Box>
        
        {/* Results */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredLegs.map((leg) => (
            <EmptyLegCard key={leg.id} leg={leg} />
          ))}
        </SimpleGrid>
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
        >
          Set Up Flight Alerts
        </Button>
      </Box>
    </Container>
  );
};

const EmptyLegCard = ({ leg }) => {
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
        Save {leg.savings}
      </Badge>
      
      <VStack align="start" spacing={4}>
        <Flex width="100%" justify="space-between" align="center">
          <Text fontWeight="bold" fontSize="xl">{leg.date}</Text>
          <Text color="gray.500">{leg.aircraft}</Text>
        </Flex>
        
        <Flex width="100%" align="center">
          <Text fontWeight="bold" fontSize="lg">{leg.from}</Text>
          <Icon as={FaArrowRight} mx={2} color="brand.500" />
          <Text fontWeight="bold" fontSize="lg">{leg.to}</Text>
        </Flex>
        
        <Flex width="100%" justify="space-between" align="center">
          <Text>{leg.capacity}</Text>
          <Heading size="md" color="brand.500">{leg.price}</Heading>
        </Flex>
        
        <Button colorScheme="brand" size="sm" width="full">
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