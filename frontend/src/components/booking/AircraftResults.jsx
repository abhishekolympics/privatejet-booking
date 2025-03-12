import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  Select,
  Badge,
  Spinner,
  HStack,
  VStack,
  useToast
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { searchAircraft, getCharterPrice } from '../../utils/api';
import { useBooking } from '../../hooks/useBooking';
import AircraftCard from './AircraftCard';
import NoResults from '../ui/NoResults';
import LoadingSpinner from '../ui/LoadingSpinner';

const AircraftResults = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { bookingDetails, setSelectedAircraft, setCharteredPrice } = useBooking();
  
  const [aircrafts, setAircrafts] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [filterByClass, setFilterByClass] = useState('');
  const [searchParams, setSearchParams] = useState(null);
  
  // Set initial search parameters from booking details
  useEffect(() => {
    if (bookingDetails && bookingDetails.legs && bookingDetails.legs.length > 0) {
      setSearchParams({
        ...bookingDetails
      });
    }
  }, [bookingDetails]);
  
  // Fetch available aircraft based on search params
  const { data, isLoading, isError, refetch } = useQuery(
    ['aircraftSearch', searchParams], 
    () => searchParams ? searchAircraft(searchParams) : null,
    {
      enabled: !!searchParams,
      onSuccess: (data) => {
        if (data && data.aircraft) {
          setAircrafts(data.aircraft);
        }
      },
      onError: (error) => {
        toast({
          title: 'Error fetching aircraft',
          description: error.message || 'Please try again later',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  );
  
  useEffect(() => {
    // Redirect to booking page if no booking details exist
    if (!bookingDetails || !bookingDetails.legs || bookingDetails.legs.length === 0) {
      navigate('/booking');
    }
  }, [bookingDetails, navigate]);
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    
    const sortedAircrafts = [...aircrafts];
    switch (e.target.value) {
      case 'price-asc':
        sortedAircrafts.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        sortedAircrafts.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'passengers-asc':
        sortedAircrafts.sort((a, b) => a.passengers_max - b.passengers_max);
        break;
      case 'passengers-desc':
        sortedAircrafts.sort((a, b) => b.passengers_max - a.passengers_max);
        break;
      case 'year-desc':
        sortedAircrafts.sort((a, b) => b.year_of_production - a.year_of_production);
        break;
      default:
        // Default sorting (by aircraft class and then type)
        break;
    }
    
    setAircrafts(sortedAircrafts);
  };
  
  const handleFilterChange = (e) => {
    const newFilterClass = e.target.value;
    setFilterByClass(newFilterClass);
    
    // Update search params with new aircraft class and refetch
    if (searchParams) {
      const updatedParams = {
        ...searchParams,
        aircraft: [
          {
            ac_class: newFilterClass || (bookingDetails.aircraft?.[0]?.ac_class || '')
          }
        ]
      };
      
      setSearchParams(updatedParams);
    }
  };
  
  const handleSelectAircraft = (aircraft) => {
    setSelectedAircraft(aircraft);
    
    // For demo purposes, navigate directly to confirmation
    navigate('/booking-confirmation');
    
    // In a real application, you would get price estimation first:
    getCharterPrice({
      ...bookingDetails,
      aircraft: [
        {
          id: aircraft.id
        }
      ]
    })
      .then(priceData => {
        setCharteredPrice(priceData);
        navigate('/booking-confirmation');
      })
      .catch(error => {
        toast({
          title: 'Error fetching price',
          description: error.message || 'Please try again later',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };
  
  if (isLoading) {
    return <LoadingSpinner text="Searching for available aircraft..." />;
  }
  
  if (isError || !aircrafts.length) {
    return (
      <NoResults 
        title="No Aircraft Found"
        message="We couldn't find any aircraft matching your criteria. Please try different search parameters."
        actionLabel="Modify Search"
        actionLink="/booking"
      />
    );
  }
  
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6} wrap="wrap">
        <Heading size="lg" color="brand.700">Available Aircraft</Heading>
        
        <HStack spacing={4}>
          <Select placeholder="Filter by Aircraft Type" value={filterByClass} onChange={handleFilterChange}>
            <option value="light">Light Jets</option>
            <option value="midsize">Midsize Jets</option>
            <option value="super">Super Midsize Jets</option>
            <option value="heavy">Heavy Jets</option>
            <option value="ultra">Ultra Long Range</option>
          </Select>
          
          <Select placeholder="Sort Results" value={sortBy} onChange={handleSortChange}>
            <option value="default">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="passengers-asc">Passengers: Low to High</option>
            <option value="passengers-desc">Passengers: High to Low</option>
            <option value="year-desc">Newest Aircraft First</option>
          </Select>
        </HStack>
      </Flex>
      
      <Text mb={6} fontSize="md">
        Found <Badge colorScheme="brand">{aircrafts.length}</Badge> aircraft for your trip
      </Text>
      
      <Grid 
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
        gap={6}
      >
        {aircrafts.map(aircraft => (
          <AircraftCard
            key={aircraft.id}
            aircraft={aircraft}
            onSelect={() => handleSelectAircraft(aircraft)}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default AircraftResults;