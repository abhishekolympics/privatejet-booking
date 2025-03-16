// components/pages/AircraftTypesPage.jsx
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
  Grid,
  GridItem,
  Skeleton,
  Alert,
  AlertIcon,
  useToast,
  ButtonGroup,
  Select
} from '@chakra-ui/react';
import { FaPlane, FaUsers, FaRuler, FaClock, FaSuitcase, FaWifi, FaBed, FaTv, FaSync } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { fetchAircraftByClass } from '../../utils/aircraftService';
import LoadingSpinner from '../ui/LoadingSpinner';

const AircraftTypesPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Map tab index to aircraft class
  const classMap = ['light', 'midsize', 'supermidsize', 'heavy', 'ultralong'];
  const currentClass = classMap[tabIndex];

  // First query - Quick load from database (useFromDb=true)
  const {
    data: localData,
    isLoading,
    isError,
    error
  } = useQuery(
    ['aircraft', currentClass, 'local', currentPage, limit],
    () => fetchAircraftByClass(currentClass, true, currentPage, limit),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        // Update total pages from the response
        if (data && data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }
      },
      onError: (err) => {
        toast({
          title: 'Error loading aircraft data',
          description: err.message || 'Could not load aircraft data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  );

  // Second query - Latest data from API (useFromDb=false)
  const { data: apiData, isLoading: isApiLoading } = useQuery(
    ['aircraft', currentClass, 'api', currentPage, limit],
    () => fetchAircraftByClass(currentClass, false, currentPage, limit),
    {
      enabled: !!localData, // Only run after local data is loaded
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        // Update total pages from the API response
        if (data && data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }
        
        if (isRefreshing) {
          toast({
            title: 'Data refreshed',
            description: 'Aircraft data has been updated with the latest information',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          setIsRefreshing(false);
        }
      },
      onError: (err) => {
        if (isRefreshing) {
          toast({
            title: 'Error refreshing data',
            description: err.message || 'Could not refresh aircraft data',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          setIsRefreshing(false);
        }
      }
    }
  );

  // Use API data if available, otherwise use local data
  const data = apiData || localData;

  // Handler for tab change
  const handleTabChange = (index) => {
    setTabIndex(index);
    setSelectedAircraft(null);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  // Handler for viewing aircraft details
  const viewAircraft = (aircraft) => {
    setSelectedAircraft(aircraft);
    setTimeout(() => {
      document.getElementById('aircraft-details')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Handler for booking a flight
  const bookFlight = () => {
    navigate('/booking', { 
      state: { selectedAircraftId: selectedAircraft?.aircraftId } 
    });
  };
  
  // Filter out aircraft without images
  const filterAircraftWithImages = (aircraftData) => {
    if (!aircraftData || !aircraftData.data) return [];
    
    return {
      ...aircraftData,
      data: aircraftData.data.filter(aircraft => 
        aircraft.images && aircraft.images.length > 0
      )
    };
  };
  
  // Filtered data
  const filteredData = filterAircraftWithImages(data);

  // Handler for manual refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    queryClient.invalidateQueries(['aircraft', currentClass, 'api', currentPage, limit]);
  };
  
  // Handler for page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedAircraft(null); // Clear selected aircraft when changing page
    
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handler for limit change
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  // Process aircraft for display
  const processAircraftForDisplay = (aircraft) => {
    const mainImageUrl = aircraft.images && aircraft.images.length > 0
      ? aircraft.images.find(img => img.tag === 'exterior')?.path || aircraft.images[0].path
      : `/images/aircraft/placeholders/${aircraft.aircraftType.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      
    return {
      id: aircraft.aircraftId,
      name: aircraft.aircraftType.name,
      image: mainImageUrl,
      passengers: `${aircraft.passengersMax || 'N/A'}`,
      range: calculateRange(aircraft),
      description: aircraft.description || getDefaultDescription(aircraft)
    };
  };

  // Helper function to get readable class name
  const getReadableClassName = (className) => {
    switch (className) {
      case 'light': return 'Light Jets';
      case 'midsize': return 'Midsize Jets';
      case 'supermidsize': return 'Super Midsize Jets';
      case 'heavy': return 'Heavy Jets';
      case 'ultralong': return 'Ultra Long Range Jets';
      default: return className;
    }
  };

  // Helper function to get class description
  const getClassDescription = (className) => {
    switch (className) {
      case 'light':
        return 'Light jets are ideal for shorter trips, typically accommodating 4-8 passengers with a range of 1,500-2,000 nautical miles. These aircraft are perfect for regional travel, offering an efficient and cost-effective private flying experience.';
      case 'midsize':
        return 'Midsize jets offer more cabin space, passenger capacity, and range than light jets. Typically seating 6-9 passengers with a range of 2,000-3,000 nautical miles, these aircraft are ideal for transcontinental travel.';
      case 'supermidsize':
        return `Super midsize jets bridge the gap between midsize and heavy jets, offering enhanced range, speed, and cabin space. With capacity for 8-12 passengers and a range of 3,000-4,000 nautical miles, they're excellent for domestic and international travel.`;
      case 'heavy':
        return 'Heavy jets provide ultimate comfort for long-range travel, accommodating 10-16 passengers with a range of 4,000-5,000 nautical miles. These aircraft offer spacious cabins with distinct living areas and enhanced amenities for intercontinental flights.';
      case 'ultralong':
        return 'Ultra long range jets represent the pinnacle of private aviation, offering luxurious accommodations for 12-19 passengers with ranges exceeding 6,000 nautical miles. These aircraft can fly nonstop between any two major cities worldwide.';
      default:
        return '';
    }
  };

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

  // Get default description if none is available
  const getDefaultDescription = (aircraft) => {
    if (!aircraft) return '';
    
    const type = aircraft.aircraftType.name;
    const className = aircraft.aircraftType.class.name;
    
    return `The ${type} is a versatile ${className.toLowerCase()} jet offering exceptional performance and comfort for ${className.toLowerCase() === 'light' ? 'short to medium' : className.toLowerCase() === 'ultralong' ? 'ultra-long' : 'medium to long'}-range flights. With its ${className.toLowerCase() === 'light' ? 'efficient' : 'spacious'} cabin and advanced avionics, it provides an efficient and comfortable travel experience for up to ${aircraft.passengersMax} passengers.`;
  };
  
  // Pagination Component
  const PaginationControl = () => {
    // Don't render if there's only 1 page
    if (totalPages <= 1) return null;
    
    // Calculate which page buttons to show
    const pages = [];
    const maxButtons = 5;
    
    if (totalPages <= maxButtons) {
      // Show all pages if there are fewer than maxButtons
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Calculate start and end of current page group
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the beginning
      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, maxButtons - 1);
      }
      
      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - maxButtons + 2);
      }
      
      // Add ellipsis if needed before current group
      if (start > 2) {
        pages.push('...');
      }
      
      // Add pages in current group
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed after current group
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always include last page
      pages.push(totalPages);
    }
    
    return (
      <Flex justify="center" mt={10} wrap="wrap">
        <HStack spacing={4}>
          <ButtonGroup isAttached variant="outline" size="sm">
            <Button
              onClick={() => handlePageChange(1)}
              isDisabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              isDisabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {pages.map((page, index) => (
              <Button
                key={index}
                onClick={() => page !== '...' && handlePageChange(page)}
                isActive={page === currentPage}
                variant={page === currentPage ? 'solid' : 'outline'}
                colorScheme={page === currentPage ? 'brand' : 'gray'}
                cursor={page === '...' ? 'default' : 'pointer'}
              >
                {page}
              </Button>
            ))}
            
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              isDisabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button
              onClick={() => handlePageChange(totalPages)}
              isDisabled={currentPage === totalPages}
            >
              Last
            </Button>
          </ButtonGroup>
          
          <Select
            value={limit}
            onChange={handleLimitChange}
            width="120px"
            size="sm"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </Select>
        </HStack>
      </Flex>
    );
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
      <Tabs colorScheme="brand" mb={20} isLazy onChange={handleTabChange} index={tabIndex}>
        <TabList overflowX="auto" flexWrap="nowrap" sx={{ scrollbarWidth: 'none' }}>
          <Tab fontWeight="medium">Light Jets</Tab>
          <Tab fontWeight="medium">Midsize Jets</Tab>
          <Tab fontWeight="medium">Super Midsize Jets</Tab>
          <Tab fontWeight="medium">Heavy Jets</Tab>
          <Tab fontWeight="medium">Ultra Long Range</Tab>
        </TabList>

        <TabPanels mt={8}>
          {/* Generate Tab Panels for each aircraft class */}
          {classMap.map((className, idx) => (
            <TabPanel key={className}>
              <VStack spacing={8} align="stretch">
                <Box>
                  <Flex justify="space-between" align="center" mb={4}>
                    <Heading as="h2" size="xl">
                      {getReadableClassName(className)}
                    </Heading>
                    <Button 
                      leftIcon={<FaSync />} 
                      onClick={handleRefresh} 
                      isLoading={isRefreshing || isApiLoading}
                      loadingText="Refreshing"
                      size="sm"
                      colorScheme="brand"
                      variant="outline"
                    >
                      Refresh
                    </Button>
                  </Flex>
                  <Text color="gray.600" mb={6}>
                    {getClassDescription(className)}
                  </Text>
                  
                  {isLoading ? (
                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                      {[1, 2, 3, 4].map((i) => (
                        <Box 
                          key={i}
                          borderWidth="1px" 
                          borderRadius="lg" 
                          overflow="hidden"
                          boxShadow="md"
                        >
                          <Skeleton height="250px" width="100%" />
                          <Box p={6}>
                            <Skeleton height="30px" width="70%" mb={4} />
                            <Skeleton height="20px" width="90%" mb={2} />
                            <Skeleton height="20px" width="80%" mb={4} />
                            <Skeleton height="40px" width="100%" />
                          </Box>
                        </Box>
                      ))}
                    </SimpleGrid>
                  ) : isError ? (
                    <Alert status="error" borderRadius="md">
                      <AlertIcon />
                      {error?.message || 'Failed to load aircraft data. Please try again later.'}
                    </Alert>
                  ) : filteredData.data && filteredData.data.length > 0 ? (
                    <>
                      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                        {filteredData.data.map((aircraft) => {
                          const displayAircraft = processAircraftForDisplay(aircraft);
                          return (
                            <AircraftCard 
                              key={aircraft.aircraftId} 
                              aircraft={displayAircraft} 
                              viewDetails={() => viewAircraft(aircraft)}
                            />
                          );
                        })}
                      </SimpleGrid>
                      
                      {/* Pagination Controls */}
                      <PaginationControl />
                    </>
                  ) : (
                    <Box textAlign="center" py={10}>
                      <Text fontSize="lg">No aircraft found with images for this category.</Text>
                    </Box>
                  )}
                </Box>
              </VStack>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      {/* Aircraft Details Section */}
      {selectedAircraft && (
        <Box id="aircraft-details" mb={20} scrollMarginTop="100px">
          <Divider mb={10} />
          
          <Heading as="h2" size="xl" mb={8}>
            {selectedAircraft.aircraftType.name} Details
          </Heading>
          
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
            <GridItem>
              {selectedAircraft.images && selectedAircraft.images.length > 0 ? (
                <Image 
                  src={selectedAircraft.images.find(img => img.tag === 'exterior')?.path || selectedAircraft.images[0].path} 
                  alt={selectedAircraft.aircraftType.name} 
                  borderRadius="lg"
                  width="100%" 
                  height="auto"
                  objectFit="cover"
                  fallbackSrc={`/images/aircraft/placeholders/${selectedAircraft.aircraftType.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                />
              ) : (
                <Image 
                  src={`/images/aircraft/placeholders/${selectedAircraft.aircraftType.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                  alt={selectedAircraft.aircraftType.name} 
                  borderRadius="lg"
                  width="100%" 
                  height="auto"
                  objectFit="cover"
                />
              )}
            </GridItem>
            
            <GridItem>
              <VStack align="start" spacing={6}>
                <Text fontSize="lg">
                  {selectedAircraft.description || getDefaultDescription(selectedAircraft)}
                </Text>
                
                <SimpleGrid columns={2} spacing={6} width="100%">
                  <Specification 
                    icon={FaUsers} 
                    title="Passengers" 
                    value={`${selectedAircraft.passengersMax || 'N/A'}`} 
                  />
                  <Specification 
                    icon={FaRuler} 
                    title="Range" 
                    value={calculateRange(selectedAircraft)} 
                  />
                  <Specification 
                    icon={FaClock} 
                    title="Speed" 
                    value={calculateSpeed(selectedAircraft)} 
                  />
                  <Specification 
                    icon={FaSuitcase} 
                    title="Luggage" 
                    value={`${selectedAircraft.features?.luggageVolume || 'N/A'} cubic meters`} 
                  />
                </SimpleGrid>
                
                <Box width="100%">
                  <Text fontWeight="medium" mb={2}>Amenities:</Text>
                  <Flex flexWrap="wrap" gap={2}>
                    {getAmenities(selectedAircraft).map((amenity, index) => (
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
    </Container>
  );
};

// Calculate estimated cruise speed based on aircraft type
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
        fallbackSrc={`/images/aircraft/placeholders/generic.jpg`}
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