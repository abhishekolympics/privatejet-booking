import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Text,
  Flex,
  Spinner,
  useOutsideClick
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useQuery } from 'react-query';
import { searchAirports } from '../../utils/api';

const AirportSearchInput = ({ 
  value, 
  onChange, 
  placeholder, 
  name, 
  required = false,
  initialAirportCode = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  
  // Close dropdown when clicking outside
  useOutsideClick({
    ref: dropdownRef,
    handler: () => setIsDropdownOpen(false),
  });
  
  // Search airports API
  const { data: airports, isLoading, error } = useQuery(
    ['airports', searchTerm],
    () => searchAirports(searchTerm),
    {
      enabled: searchTerm.length >= 2,
      staleTime: 60000, // 1 minute
    }
  );

  // Handle initial airport code
  useEffect(() => {
    if (initialAirportCode && !value) {
      console.log(`Initializing search for airport code: ${initialAirportCode}`);
      // Set search term to trigger search
      setSearchTerm(initialAirportCode);
    }
  }, [initialAirportCode, value]);

  // Auto-select first result for initialAirportCode
  useEffect(() => {
    if (initialAirportCode && airports && airports.length > 0 && !value) {
      console.log('Found airports for initial code, selecting first result:', airports[0]);
      // Auto-select the first airport in the results
      handleSelectAirport(airports[0]);
    }
  }, [airports, initialAirportCode, value]);
  
  useEffect(() => {
    if (searchTerm.length >= 2) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  }, [searchTerm]);
  
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!e.target.value) {
      // If input is cleared, also clear the selected value
      onChange(null);
    }
  };
  
  const handleSelectAirport = (airport) => {
    // Create a simplified airport object with all necessary properties
    const selectedAirport = {
      id: airport.id,
      icao: airport.icao,
      iata: airport.iata,
      name: airport.name,
      city: airport.city,
      country: airport.country
    };
    
    // Update the parent component with the selected airport
    onChange(selectedAirport);
    
    // Clear search term and close dropdown
    setSearchTerm('');
    setIsDropdownOpen(false);
  };
  
  return (
    <Box position="relative" ref={dropdownRef}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        
        <Input
          ref={inputRef}
          name={name}
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder || "Search airports..."}
          onClick={() => searchTerm.length >= 2 && setIsDropdownOpen(true)}
          onFocus={() => searchTerm.length >= 2 && setIsDropdownOpen(true)}
          required={false}
          // Add a hidden real value to satisfy form validation
          data-value={value ? value.icao : ''}
        />
        
        {/* Add a hidden input that contains the actual value for form submission */}
        {name && (
          <Input 
            type="hidden" 
            name={`${name}-icao`}
            value={value ? value.icao : ''}
            required={required}
          />
        )}
      </InputGroup>
      
      {value && !searchTerm && (
        <Flex 
          alignItems="center" 
          mt={1} 
          p={2} 
          borderWidth={1} 
          borderRadius="md" 
          borderColor="brand.200"
          bg="brand.50"
        >
          <Text fontWeight="medium">{value.icao}</Text>
          <Text ml={2} fontSize="sm" color="gray.600">
            {value.name}, {value.city?.name}, {value.country?.name}
          </Text>
        </Flex>
      )}
      
      {isDropdownOpen && (
        <Box
          position="absolute"
          zIndex={10}
          w="100%"
          mt={2}
          bg="white"
          boxShadow="lg"
          borderRadius="md"
          overflow="hidden"
          maxH="300px"
          overflowY="auto"
        >
          {isLoading ? (
            <Flex justify="center" align="center" py={4}>
              <Spinner size="sm" mr={2} />
              <Text>Searching airports...</Text>
            </Flex>
          ) : error ? (
            <Text p={4} color="red.500">Error searching airports</Text>
          ) : airports && airports.length > 0 ? (
            <List>
              {airports.map((airport) => (
                <ListItem
                  key={airport.id}
                  py={2}
                  px={4}
                  cursor="pointer"
                  _hover={{ bg: 'gray.100' }}
                  onClick={() => handleSelectAirport(airport)}
                >
                  <Text fontWeight="medium">
                    {airport.icao} {airport.iata && `(${airport.iata})`}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {airport.name}, {airport.city?.name}, {airport.country?.name}
                  </Text>
                </ListItem>
              ))}
            </List>
          ) : (
            <Text p={4}>No airports found. Try another search term.</Text>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AirportSearchInput;