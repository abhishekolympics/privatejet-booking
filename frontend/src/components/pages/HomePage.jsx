// src/components/pages/HomePage.jsx

import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Image,
  Icon,
  VStack
} from '@chakra-ui/react';
import { FaPlane, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <>
      {/* Hero Section */}
      <Box 
        as="section" 
        backgroundImage="url('/images/hero-bg.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
        py={20}
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: 'rgba(0, 0, 0, 0.5)',
          zIndex: 0
        }}
      >
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <Stack 
            spacing={8} 
            direction={{ base: 'column', lg: 'row' }}
            alignItems="center"
            justifyContent="space-between"
          >
            <VStack spacing={4} align="flex-start" maxW="xl">
              <Heading
                as="h1"
                fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                fontWeight="bold"
                color="white"
                lineHeight="shorter"
              >
                Elevate Your Travel Experience
              </Heading>
              <Text fontSize="xl" color="white">
                Book private jets on demand. Experience the luxury, comfort, and flexibility of flying on your own schedule.
              </Text>
              <Button 
                size="lg" 
                variant="luxury"
                onClick={() => navigate('/booking')}
              >
                Book Now
              </Button>
            </VStack>
            
            <Box 
              bg="white" 
              borderRadius="xl" 
              boxShadow="xl" 
              p={{ base: 4, md: 8 }}
              width={{ base: 'full', md: '450px' }}
              display={{ base: 'none', lg: 'block' }}
            >
              <Heading size="md" mb={4}>Quick Quote</Heading>
              <Stack spacing={4}>
                <Button 
                  colorScheme="brand" 
                  size="lg" 
                  width="full"
                  onClick={() => navigate('/booking')}
                >
                  Start Your Booking
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box as="section" py={20}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Box textAlign="center" maxW="2xl" mx="auto">
              <Heading as="h2" size="xl" mb={4}>
                Why Choose PrivateJet
              </Heading>
              <Text fontSize="lg" color="gray.600">
                We offer a seamless booking experience with access to thousands of luxurious private jets worldwide.
              </Text>
            </Box>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
              <FeatureCard 
                icon={FaPlane} 
                title="Global Fleet" 
                text="Access to thousands of aircraft worldwide, from light to ultra-long range jets."
              />
              <FeatureCard 
                icon={FaCalendarAlt} 
                title="Instant Booking" 
                text="Book your private jet in minutes with real-time availability and pricing."
              />
              <FeatureCard 
                icon={FaCheckCircle} 
                title="Premium Service" 
                text="Dedicated concierge service to handle all your travel needs and special requests."
              />
              <FeatureCard 
                icon={FaClock} 
                title="Time Efficiency" 
                text="Skip the lines and wait times, fly from private terminals with expedited boarding."
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      
      {/* Popular Destinations */}
      <Box as="section" py={20} bg="gray.50">
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Box textAlign="center" maxW="2xl" mx="auto">
              <Heading as="h2" size="xl" mb={4}>
                Popular Private Jet Destinations
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Explore our most requested routes and destinations for luxury travel.
              </Text>
            </Box>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
              <DestinationCard 
                image="/images/destinations/new-york.jpg"
                title="New York"
                description="The bustling financial and cultural capital of the USA."
                airportCode="KJFK"
              />
              <DestinationCard 
                image="/images/destinations/london.jpg"
                title="London"
                description="A global city with rich history and modern attractions."
                airportCode="EGLL"
              />
              <DestinationCard 
                image="/images/destinations/dubai.jpg"
                title="Dubai"
                description="Known for luxury shopping, ultramodern architecture, and vibrant nightlife."
                airportCode="OMDB"
              />
              <DestinationCard 
                image="/images/destinations/paris.jpg"
                title="Paris"
                description="The city of lights, known for art, fashion, and gastronomy."
                airportCode="LFPG"
              />
              <DestinationCard 
                image="/images/destinations/miami.jpg"
                title="Miami"
                description="A vibrant city with beautiful beaches and exciting nightlife."
                airportCode="KMIA"
              />
              <DestinationCard 
                image="/images/destinations/las-vegas.jpg"
                title="Las Vegas"
                description="The entertainment capital with casinos, shows, and luxury resorts."
                airportCode="KLAS"
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box 
        as="section" 
        py={20}
        bgGradient="linear(to-r, brand.600, brand.800)"
      >
        <Container maxW="container.xl">
          <Stack 
            direction={{ base: 'column', md: 'row' }} 
            spacing={8}
            justify="space-between"
            align="center"
          >
            <VStack align="flex-start" spacing={4} maxW="xl">
              <Heading color="white" size="xl">
                Ready to Experience Luxury Travel?
              </Heading>
              <Text color="white" fontSize="lg">
                Book your private jet today and enjoy a seamless, premium travel experience.
              </Text>
            </VStack>
            <Button 
              size="lg" 
              variant="luxury"
              onClick={() => navigate('/booking')}
            >
              Book Your Flight
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, text }) => {
  return (
    <VStack 
      spacing={4} 
      p={6} 
      bg="white" 
      borderRadius="lg" 
      boxShadow="md"
      align="center"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
    >
      <Icon as={icon} boxSize={10} color="brand.500" />
      <Heading as="h3" size="md">{title}</Heading>
      <Text textAlign="center" color="gray.600">{text}</Text>
    </VStack>
  );
};

// Destination Card Component
const DestinationCard = ({ image, title, description, airportCode }) => {

  const navigate = useNavigate();
  
  const handleBookClick = () => {
    sessionStorage.setItem('selectedDestinationAirport', airportCode);
    console.log('Selected destination in homepage:', airportCode);
    navigate('/booking');
  };

  return (
    <Box 
      borderRadius="lg" 
      overflow="hidden" 
      bg="white" 
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
    >
      <Image src={image} alt={title} width="full" height="250px" objectFit="cover" />
      <Box p={5}>
        <Heading as="h3" size="md" mb={2}>{title}</Heading>
        <Text color="gray.600">{description}</Text>
        <Button
          variant="outline"
          colorScheme="brand"
          size="sm"
          mt={4}
          onClick={handleBookClick}
        >
          Book a Flight
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;