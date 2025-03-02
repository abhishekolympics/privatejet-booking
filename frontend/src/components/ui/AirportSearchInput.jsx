// src/components/ui/AirportSearchInput.jsx

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

const AirportSearchInput = ({ value, onChange, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
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
  
  useEffect(() => {
    if (searchTerm.length >= 2) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  }, [searchTerm]);
  
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSelectAirport = (airport) => {
    onChange(airport);
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
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder || "Search airports..."}
          onClick={() => searchTerm.length >= 2 && setIsDropdownOpen(true)}
          onFocus={() => searchTerm.length >= 2 && setIsDropdownOpen(true)}
        />
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