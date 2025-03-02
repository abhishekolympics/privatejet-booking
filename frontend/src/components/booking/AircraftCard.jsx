// components/booking/AircraftCard.jsx - Card component for displaying an aircraft

import {
    Box,
    Image,
    Heading,
    Text,
    Stack,
    Badge,
    Button,
    Flex,
    HStack,
    useDisclosure,
    IconButton,
    AspectRatio
  } from '@chakra-ui/react';
  import { InfoIcon, StarIcon } from '@chakra-ui/icons';
  import { useState } from 'react';
  import AircraftDetailsModal from './AircraftDetailsModal';
  
  const AircraftCard = ({ aircraft, onSelect }) => {
    console.log("abhishek was here=",require("@chakra-ui/react"));

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [imageError, setImageError] = useState(false);
    
    // Get main image URL (or first available)
    const mainImage = aircraft.images && aircraft.images.length > 0
      ? aircraft.images.find(img => img.image_type === "exterior")?.url || aircraft.images[0].url
      : "/images/aircraft-placeholder.jpg";
    
    // Get cabin image for details
    const cabinImage = aircraft.images && aircraft.images.length > 0
      ? aircraft.images.find(img => img.image_type === "cabin")?.url || null
      : null;
    
    // Handle image loading error
    const handleImageError = () => {
      setImageError(true);
    };
    
    // Get aircraft class badge color
    const getBadgeColor = (aircraftType) => {
      const type = aircraftType.toLowerCase();
      if (type.includes('light')) return 'blue';
      if (type.includes('midsize')) return 'purple';
      if (type.includes('super')) return 'pink';
      if (type.includes('heavy')) return 'orange';
      if (type.includes('ultra')) return 'red';
      return 'gray';
    };
    
    return (
      <>
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
          bg="white"
          transition="all 0.3s"
          _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
        >
          <AspectRatio ratio={16/9}>
            <Image
              src={imageError ? "/images/aircraft-placeholder.jpg" : mainImage}
              alt={aircraft.aircraft_type}
              objectFit="cover"
              onError={handleImageError}
            />
          </AspectRatio>
          
          <Box p={5}>
            <Flex justify="space-between" align="flex-start" mb={2}>
              <Heading as="h3" size="md" fontWeight="bold" noOfLines={1}>
                {aircraft.aircraft_type}
              </Heading>
              <IconButton
                size="sm"
                variant="ghost"
                icon={<InfoIcon />}
                aria-label="View details"
                onClick={onOpen}
              />
            </Flex>
            
            <HStack spacing={2} mb={3}>
              <Badge colorScheme={getBadgeColor(aircraft.aircraft_type)}>
                {aircraft.aircraft_type.includes('Embraer') || 
                 aircraft.aircraft_type.includes('Cessna') || 
                 aircraft.aircraft_type.includes('Bombardier') || 
                 aircraft.aircraft_type.includes('Gulfstream') || 
                 aircraft.aircraft_type.includes('Falcon') || 
                 aircraft.aircraft_type.includes('Hawker') ? 
                  aircraft.aircraft_type.split(' ')[0] : 'Jet'}
              </Badge>
              <Badge colorScheme="gray">{aircraft.year_of_production}</Badge>
              <Badge colorScheme="green">{aircraft.registration_number}</Badge>
            </HStack>
            
            <Stack direction="row" justify="space-between" mb={3}>
              <Text fontSize="sm" color="gray.600">
                Operator
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {aircraft.company?.name || 'Private Operator'}
              </Text>
            </Stack>
            
            <Stack direction="row" justify="space-between" mb={3}>
              <Text fontSize="sm" color="gray.600">
                Max Passengers
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {aircraft.passengers_max}
              </Text>
            </Stack>
            
            <Box borderBottom="1px solid" borderColor="gray.200" my={4} />

            
            <Button
              colorScheme="brand"
              size="md"
              width="full"
              onClick={() => onSelect(aircraft)}
              variant="luxury"
            >
              Select Aircraft
            </Button>
          </Box>
        </Box>
        
        <AircraftDetailsModal 
          isOpen={isOpen} 
          onClose={onClose} 
          aircraft={aircraft} 
          mainImage={mainImage}
          cabinImage={cabinImage}
          onSelect={() => {
            onClose();
            onSelect(aircraft);
          }}
        />
      </>
    );
  };
  
  export default AircraftCard;