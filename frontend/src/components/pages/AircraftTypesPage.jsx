// components/pages/AircraftTypesPage.jsx
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
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Icon,
  Divider,
  Tag,
  useColorModeValue,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { FaPlane, FaUsers, FaRuler, FaClock, FaSuitcase, FaWifi, FaBed, FaTv } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Aircraft data
const aircraftData = {
  light: [
    {
      id: 'citation-cj4',
      name: 'Citation CJ4',
      image: '/images/aircraft/citation-cj4.jpg',
      passengers: '7-8',
      range: '2,165 nm',
      speed: '451 mph',
      luggage: '6.36 cubic meters',
      amenities: ['Wi-Fi Available', 'Refreshment Center', 'Power Outlets', 'Leather Seats'],
      description: 'The Cessna Citation CJ4 is a versatile light jet offering exceptional performance and comfort for short to medium-range flights. With its spacious cabin and advanced avionics, it provides an efficient and comfortable travel experience.'
    },
    {
      id: 'phenom-300',
      name: 'Phenom 300',
      image: '/images/aircraft/phenom-300.jpg',
      passengers: '6-8',
      range: '1,971 nm',
      speed: '518 mph',
      luggage: '5.9 cubic meters',
      amenities: ['Wi-Fi Available', 'Refreshment Center', 'Lavatory', 'Entertainment System'],
      description: 'The Embraer Phenom 300 is a popular light jet known for its exceptional performance and cabin comfort. With best-in-class cabin pressurization and low operating costs, it offers an optimal combination of luxury and efficiency.'
    }
  ],
  midsize: [
    {
      id: 'citation-xls',
      name: 'Citation XLS+',
      image: '/images/aircraft/citation-xls.jpg',
      passengers: '8-9',
      range: '2,100 nm',
      speed: '507 mph',
      luggage: '7.6 cubic meters',
      amenities: ['Wi-Fi', 'Full Refreshment Center', 'Fully Enclosed Lavatory', 'Entertainment System', 'Power Outlets'],
      description: 'The Citation XLS+ combines the comfort and luxury of a midsize jet with remarkable short-field performance. Its spacious stand-up cabin, excellent range, and impressive speed make it one of the most popular midsize jets in the world.'
    },
    {
      id: 'learjet-60',
      name: 'Learjet 60XR',
      image: '/images/aircraft/learjet-60.jpg',
      passengers: '7-8',
      range: '2,405 nm',
      speed: '513 mph',
      luggage: '6.1 cubic meters',
      amenities: ['Wi-Fi Available', 'Galley', 'Enclosed Lavatory', 'Entertainment System', 'Fold-out Tables'],
      description: 'The Learjet 60XR is a high-performance midsize jet with impressive climb capabilities and a spacious stand-up cabin. Known for its reliability and speed, it offers a comfortable environment for both business and leisure travel.'
    }
  ],
  supermidsize: [
    {
      id: 'challenger-350',
      name: 'Challenger 350',
      image: '/images/aircraft/challenger-350.jpg',
      passengers: '8-10',
      range: '3,200 nm',
      speed: '548 mph',
      luggage: '8.5 cubic meters',
      amenities: ['Wi-Fi', 'Galley', 'Enclosed Lavatory', 'Entertainment System', 'Flat Floor', 'Large Windows'],
      description: `The Bombardier Challenger 350 is a super-midsize jet that offers an unparalleled combination of performance and comfort. With its flat floor, stand-up cabin, and exceptional range, it's ideal for transcontinental journeys.`
    },
    {
      id: 'citation-longitude',
      name: 'Citation Longitude',
      image: '/images/aircraft/citation-longitude.jpg',
      passengers: '8-12',
      range: '3,500 nm',
      speed: '548 mph',
      luggage: '8.6 cubic meters',
      amenities: ['Wi-Fi', 'Full Galley', 'Stand-up Lavatory', 'Entertainment System', 'Flat Floor', 'Walk-in Baggage Compartment'],
      description: 'The Citation Longitude sets the standard for super-midsize jets with best-in-class cabin comfort, quietness, and technology. Its spacious interior, impressive range, and advanced features make it perfect for both business and leisure travel.'
    }
  ],
  heavy: [
    {
      id: 'gulfstream-g450',
      name: 'Gulfstream G450',
      image: '/images/aircraft/gulfstream-g450.jpg',
      passengers: '14-16',
      range: '4,350 nm',
      speed: '528 mph',
      luggage: '12.5 cubic meters',
      amenities: ['Wi-Fi', 'Full Galley', 'Forward and Aft Lavatories', 'Entertainment System', 'Multiple Living Areas', 'Sleeping Accommodations'],
      description: 'The Gulfstream G450 is a long-range heavy jet that combines exceptional performance with ultimate luxury. Its spacious cabin can be configured with multiple distinct living areas, including conference and dining facilities.'
    },
    {
      id: 'falcon-2000',
      name: 'Falcon 2000LXS',
      image: '/images/aircraft/falcon-2000.jpg',
      passengers: '10-12',
      range: '4,000 nm',
      speed: '513 mph',
      luggage: '10.4 cubic meters',
      amenities: ['Wi-Fi', 'Full Galley', 'Enclosed Lavatory', 'Entertainment System', 'Multiple Seating Areas', 'Sleeping Accommodations'],
      description: 'The Dassault Falcon 2000LXS offers remarkable short-field capability combined with long-range performance. Its wide cabin provides exceptional comfort, while its advanced technology ensures a smooth and efficient flight experience.'
    }
  ],
  ultralong: [
    {
      id: 'gulfstream-g650',
      name: 'Gulfstream G650',
      image: '/images/aircraft/gulfstream-g650.jpg',
      passengers: '14-19',
      range: '7,000 nm',
      speed: '610 mph',
      luggage: '16.3 cubic meters',
      amenities: ['High-Speed Wi-Fi', 'Full Galley with Crew Rest', 'Multiple Lavatories', 'Advanced Entertainment System', 'Multiple Living Areas', 'Private Bedroom', 'Shower Available'],
      description: 'The Gulfstream G650 is one of the most prestigious ultra-long-range jets, capable of flying nonstop from New York to Tokyo. Its spacious cabin offers unparalleled comfort with low cabin altitude, 100% fresh air, and whisper-quiet noise levels.'
    },
    {
      id: 'global-express',
      name: 'Global 6000',
      image: '/images/aircraft/global-6000.jpg',
      passengers: '14-17',
      range: '6,000 nm',
      speed: '590 mph',
      luggage: '15.8 cubic meters',
      amenities: ['Ka-band Wi-Fi', 'Full Galley with Crew Rest', 'Forward and Aft Lavatories', 'Advanced Entertainment System', 'Private Stateroom', 'Conference Area', 'Dining Area'],
      description: 'The Bombardier Global 6000 combines remarkable range with exceptional comfort and luxury. Its three-zone cabin allows for distinct living spaces, including a private stateroom, while its advanced wing design ensures a smooth and comfortable ride.'
    }
  ]
};

const AircraftTypesPage = () => {
  const navigate = useNavigate();
  const [selectedAircraft, setSelectedAircraft] = useState(null);

  const viewAircraft = (aircraft) => {
    setSelectedAircraft(aircraft);
    setTimeout(() => {
      document.getElementById('aircraft-details').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const bookFlight = () => {
    navigate('/booking');
  };

  return (
    <Container maxW="container.xl" py={10}>
      {/* Hero Section */}
      <Box textAlign="center" mb={20}>
        <Heading as="h1" size="2xl" mb={6}>
          Our Aircraft Fleet
        </Heading>
        <Text fontSize="xl" maxW="3xl" mx="auto" color="gray.600">
          Explore our diverse fleet of private jets to find the perfect aircraft for your travel needs.
        </Text>
      </Box>

      {/* Aircraft Selection Tabs */}
      <Tabs colorScheme="brand" mb={20} isLazy>
        <TabList overflowX="auto" flexWrap="nowrap" sx={{ scrollbarWidth: 'none' }}>
          <Tab fontWeight="medium">Light Jets</Tab>
          <Tab fontWeight="medium">Midsize Jets</Tab>
          <Tab fontWeight="medium">Super Midsize Jets</Tab>
          <Tab fontWeight="medium">Heavy Jets</Tab>
          <Tab fontWeight="medium">Ultra Long Range</Tab>
        </TabList>

        <TabPanels mt={8}>
          {/* Light Jets Panel */}
          <TabPanel>
            <VStack spacing={8} align="stretch">
              <Box>
                <Heading as="h2" size="xl" mb={4}>
                  Light Jets
                </Heading>
                <Text color="gray.600" mb={6}>
                  Light jets are ideal for shorter trips, typically accommodating 4-8 passengers with a range of 1,500-2,000 nautical miles. These aircraft are perfect for regional travel, offering an efficient and cost-effective private flying experience.
                </Text>
                
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                  {aircraftData.light.map((aircraft) => (
                    <AircraftCard 
                      key={aircraft.id} 
                      aircraft={aircraft} 
                      viewDetails={() => viewAircraft(aircraft)}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            </VStack>
          </TabPanel>

          {/* Midsize Jets Panel */}
          <TabPanel>
            <VStack spacing={8} align="stretch">
              <Box>
                <Heading as="h2" size="xl" mb={4}>
                  Midsize Jets
                </Heading>
                <Text color="gray.600" mb={6}>
                  Midsize jets offer more cabin space, passenger capacity, and range than light jets. Typically seating 6-9 passengers with a range of 2,000-3,000 nautical miles, these aircraft are ideal for transcontinental travel.
                </Text>
                
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                  {aircraftData.midsize.map((aircraft) => (
                    <AircraftCard 
                      key={aircraft.id} 
                      aircraft={aircraft} 
                      viewDetails={() => viewAircraft(aircraft)}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            </VStack>
          </TabPanel>

          {/* Super Midsize Jets Panel */}
          <TabPanel>
            <VStack spacing={8} align="stretch">
              <Box>
                <Heading as="h2" size="xl" mb={4}>
                  Super Midsize Jets
                </Heading>
                <Text color="gray.600" mb={6}>
                  Super midsize jets bridge the gap between midsize and heavy jets, offering enhanced range, speed, and cabin space. With capacity for 8-12 passengers and a range of 3,000-4,000 nautical miles, they're excellent for domestic and international travel.
                </Text>
                
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                  {aircraftData.supermidsize.map((aircraft) => (
                    <AircraftCard 
                      key={aircraft.id} 
                      aircraft={aircraft} 
                      viewDetails={() => viewAircraft(aircraft)}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            </VStack>
          </TabPanel>

          {/* Heavy Jets Panel */}
          <TabPanel>
            <VStack spacing={8} align="stretch">
              <Box>
                <Heading as="h2" size="xl" mb={4}>
                  Heavy Jets
                </Heading>
                <Text color="gray.600" mb={6}>
                  Heavy jets provide ultimate comfort for long-range travel, accommodating 10-16 passengers with a range of 4,000-5,000 nautical miles. These aircraft offer spacious cabins with distinct living areas and enhanced amenities for intercontinental flights.
                </Text>
                
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                  {aircraftData.heavy.map((aircraft) => (
                    <AircraftCard 
                      key={aircraft.id} 
                      aircraft={aircraft} 
                      viewDetails={() => viewAircraft(aircraft)}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            </VStack>
          </TabPanel>

          {/* Ultra Long Range Panel */}
          <TabPanel>
            <VStack spacing={8} align="stretch">
              <Box>
                <Heading as="h2" size="xl" mb={4}>
                  Ultra Long Range Jets
                </Heading>
                <Text color="gray.600" mb={6}>
                  Ultra long range jets represent the pinnacle of private aviation, offering luxurious accommodations for 12-19 passengers with ranges exceeding 6,000 nautical miles. These aircraft can fly nonstop between any two major cities worldwide.
                </Text>
                
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                  {aircraftData.ultralong.map((aircraft) => (
                    <AircraftCard 
                      key={aircraft.id} 
                      aircraft={aircraft} 
                      viewDetails={() => viewAircraft(aircraft)}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Aircraft Details Section */}
      {selectedAircraft && (
        <Box id="aircraft-details" mb={20} scrollMarginTop="100px">
          <Divider mb={10} />
          
          <Heading as="h2" size="xl" mb={8}>
            {selectedAircraft.name} Details
          </Heading>
          
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
            <GridItem>
              <Image 
                src={selectedAircraft.image} 
                alt={selectedAircraft.name} 
                borderRadius="lg"
                width="100%" 
                height="auto"
                objectFit="cover"
                fallbackSrc="https://via.placeholder.com/800x450?text=Aircraft+Image"
              />
            </GridItem>
            
            <GridItem>
              <VStack align="start" spacing={6}>
                <Text fontSize="lg">{selectedAircraft.description}</Text>
                
                <SimpleGrid columns={2} spacing={6} width="100%">
                  <Specification 
                    icon={FaUsers} 
                    title="Passengers" 
                    value={selectedAircraft.passengers} 
                  />
                  <Specification 
                    icon={FaRuler} 
                    title="Range" 
                    value={selectedAircraft.range} 
                  />
                  <Specification 
                    icon={FaClock} 
                    title="Speed" 
                    value={selectedAircraft.speed} 
                  />
                  <Specification 
                    icon={FaSuitcase} 
                    title="Luggage" 
                    value={selectedAircraft.luggage} 
                  />
                </SimpleGrid>
                
                <Box width="100%">
                  <Text fontWeight="medium" mb={2}>Amenities:</Text>
                  <Flex flexWrap="wrap" gap={2}>
                    {selectedAircraft.amenities.map((amenity, index) => (
                      <Tag key={index} size="md" colorScheme="brand" borderRadius="full" py={1} px={3}>
                        {amenity}
                      </Tag>
                    ))}
                  </Flex>
                </Box>
                
                <Button 
                  colorScheme="brand" 
                  size="lg" 
                  mt={4}
                  onClick={bookFlight}
                >
                  Book This Aircraft
                </Button>
              </VStack>
            </GridItem>
          </Grid>
        </Box>
      )}

      {/* Comparison Section */}
      <Box mb={20}>
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          Aircraft Class Comparison
        </Heading>
        
        <Box overflowX="auto">
          <Box minWidth="800px">
            <Grid
              templateColumns="repeat(6, 1fr)"
              gap={0}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
            >
              {/* Table Header */}
              <GridItem bg="brand.500" color="white" p={4} fontWeight="bold">
                Features
              </GridItem>
              <GridItem bg="brand.500" color="white" p={4} fontWeight="bold">
                Light Jets
              </GridItem>
              <GridItem bg="brand.500" color="white" p={4} fontWeight="bold">
                Midsize Jets
              </GridItem>
              <GridItem bg="brand.500" color="white" p={4} fontWeight="bold">
                Super Midsize
              </GridItem>
              <GridItem bg="brand.500" color="white" p={4} fontWeight="bold">
                Heavy Jets
              </GridItem>
              <GridItem bg="brand.500" color="white" p={4} fontWeight="bold">
                Ultra Long Range
              </GridItem>

              {/* Passengers */}
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px" fontWeight="medium">
                Passengers
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px">
                4-8
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px">
                6-9
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px">
                8-12
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px">
                10-16
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px">
                12-19
              </GridItem>

              {/* Range */}
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px" fontWeight="medium">
                Range (nm)
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px">
                1,500-2,000
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px">
                2,000-3,000
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px">
                3,000-4,000
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px">
                4,000-5,000
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px">
                6,000+
              </GridItem>

              {/* Baggage */}
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px" fontWeight="medium">
                Baggage (cubic m)
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px">
                3-6
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px">
                6-8
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px">
                8-10
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px">
                10-13
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px">
                15+
              </GridItem>

              {/* Cabin Height */}
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px" fontWeight="medium">
                Cabin Height
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px">
                4.5-4.9 ft
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px">
                5.1-5.7 ft
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px">
                5.8-6.0 ft
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px" borderRightWidth="1px">
                6.0-6.2 ft
              </GridItem>
              <GridItem p={4} borderBottomWidth="1px">
                6.2-6.5 ft
              </GridItem>

              {/* Typical Routes */}
              <GridItem p={4} borderRightWidth="1px" fontWeight="medium">
                Typical Routes
              </GridItem>
              <GridItem p={4} borderRightWidth="1px">
                New York to Chicago
              </GridItem>
              <GridItem p={4} borderRightWidth="1px">
                Los Angeles to Dallas
              </GridItem>
              <GridItem p={4} borderRightWidth="1px">
                New York to Miami
              </GridItem>
              <GridItem p={4} borderRightWidth="1px">
                Los Angeles to New York
              </GridItem>
              <GridItem p={4}>
                London to Hong Kong
              </GridItem>
            </Grid>
          </Box>
        </Box>
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
          Ready to Experience Private Jet Travel?
        </Heading>
        <Text fontSize="lg" mb={6} maxW="3xl" mx="auto">
          Book your private jet today and enjoy the comfort, convenience, and luxury of flying on your own schedule.
        </Text>
        <Button 
          size="lg" 
          colorScheme="white" 
          variant="outline" 
          _hover={{ bg: 'whiteAlpha.200' }}
          onClick={bookFlight}
        >
          Book Your Flight
        </Button>
      </Box>
    </Container>
  );
};

// Aircraft Card Component
const AircraftCard = ({ aircraft, viewDetails }) => {
  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden"
      boxShadow="md"
      bg="white"
      transition="transform 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
    >
      <Image 
        src={aircraft.image} 
        alt={aircraft.name}
        height="250px"
        width="100%"
        objectFit="cover"
        fallbackSrc="https://via.placeholder.com/500x250?text=Aircraft+Image"
      />
      
      <Box p={6}>
        <Heading as="h3" size="lg" mb={2}>
          {aircraft.name}
        </Heading>
        
        <SimpleGrid columns={2} spacing={4} mb={4}>
          <HStack>
            <Icon as={FaUsers} color="brand.500" />
            <Text>{aircraft.passengers} passengers</Text>
          </HStack>
          <HStack>
            <Icon as={FaRuler} color="brand.500" />
            <Text>{aircraft.range}</Text>
          </HStack>
        </SimpleGrid>
        
        <Text noOfLines={2} mb={4} color="gray.600">
          {aircraft.description}
        </Text>
        
        <Button 
          colorScheme="brand" 
          variant="outline" 
          size="sm"
          onClick={viewDetails}
          width="full"
        >
          View Details
        </Button>
      </Box>
    </Box>
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

export default AircraftTypesPage;