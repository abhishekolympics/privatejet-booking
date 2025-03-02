// src/components/booking/AircraftDetailsModal.jsx

import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Image,
  Text,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Divider,
  Badge,
  Flex
} from '@chakra-ui/react';

const AircraftDetailsModal = ({ isOpen, onClose, aircraft, mainImage, cabinImage, onSelect }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg">{aircraft.aircraft_type}</Heading>
          <Badge colorScheme="green" mt={1}>{aircraft.registration_number}</Badge>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <Box borderRadius="md" overflow="hidden" mb={4}>
            <Image 
              src={mainImage || "/images/aircraft-placeholder.jpg"} 
              alt={aircraft.aircraft_type}
              width="100%"
              height="250px"
              objectFit="cover"
            />
          </Box>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
            <Box>
              <Heading size="sm" mb={2}>Aircraft Details</Heading>
              <StatGroup>
                <Stat>
                  <StatLabel>Year</StatLabel>
                  <StatNumber>{aircraft.year_of_production}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Passengers</StatLabel>
                  <StatNumber>{aircraft.passengers_max}</StatNumber>
                </Stat>
              </StatGroup>
            </Box>
            
            <Box>
              <Heading size="sm" mb={2}>Operator</Heading>
              <Text>{aircraft.company?.name || 'Private Operator'}</Text>
            </Box>
          </SimpleGrid>
          
          {cabinImage && (
            <Box mb={4}>
              <Heading size="sm" mb={2}>Cabin</Heading>
              <Image 
                src={cabinImage} 
                alt="Cabin interior"
                width="100%"
                height="auto"
                borderRadius="md"
              />
            </Box>
          )}
          
          <Divider my={4} />
          
          <Heading size="sm" mb={2}>Features</Heading>
          <SimpleGrid columns={2} spacing={4}>
            <Feature name="Cabin Crew" value={aircraft.cabin_crew} />
            <Feature name="Lavatory" value={aircraft.lavatory} />
            <Feature name="Hot Meal Service" value={aircraft.hot_meal} />
            <Feature name="WiFi" value={aircraft.wireless_internet} />
            <Feature name="Entertainment" value={aircraft.entertainment_system} />
          </SimpleGrid>
          
          {aircraft.description && (
            <Box mt={4}>
              <Heading size="sm" mb={2}>Description</Heading>
              <Text>{aircraft.description}</Text>
            </Box>
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="brand" variant="luxury" onClick={onSelect}>
            Select Aircraft
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const Feature = ({ name, value }) => {
  return (
    <Flex align="center">
      <Text fontWeight="medium">{name}:</Text>
      <Badge ml={2} colorScheme={value ? "green" : "gray"}>
        {value ? "Yes" : "No"}
      </Badge>
    </Flex>
  );
};

export default AircraftDetailsModal;