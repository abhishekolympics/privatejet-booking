// components/booking/AircraftResults.jsx - Display available aircraft search results

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

const AircraftResults = () => {
  const router = useNavigate();
  const toast = useToast();
  const { bookingDetails, setSelectedAircraft, setCharteredPrice } = useBooking();
  
  const [aircrafts, setAircrafts] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [filterByClass, setFilterByClass] = useState('');
  
  // Fetch available aircraft based on booking details
  const { data, isLoading, isError } = useQuery(
    ['aircraftSearch', bookingDetails], 
    () => searchAircraft(bookingDetails),
    {
      enabled: !!bookingDetails && !!bookingDetails.legs && bookingDetails.legs.length > 0,
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
      router('/booking');
    }
  }, [bookingDetails, router]);
  
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
    setFilterByClass(e.target.value);
  };
  
  const filteredAircrafts = filterByClass 
    ? aircrafts.filter(aircraft => aircraft.aircraft_type.toLowerCase().includes(filterByClass.toLowerCase()))
    : aircrafts;
  
  const handleSelectAircraft = (aircraft) => {
    setSelectedAircraft(aircraft);
    
    // Get price estimate for the selected aircraft
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
        // Navigate to booking confirmation page
        router('/booking-confirmation');
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
    return (
      <Flex justify="center" align="center" height="50vh" direction="column">
        <Spinner size="xl" color="brand.500" thickness="4px" />
        <Text mt={4} fontSize="lg">Searching for available aircraft...</Text>
      </Flex>
    );
  }
  
  if (isError || !filteredAircrafts.length) {
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
        Found <Badge colorScheme="brand">{filteredAircrafts.length}</Badge> aircraft for your trip
      </Text>
      
      <Grid 
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
        gap={6}
      >
        {filteredAircrafts.map(aircraft => (
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