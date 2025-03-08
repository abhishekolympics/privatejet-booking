// components/pages/ConciergeServicesPage.jsx
import React from 'react';
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
  Flex,
  Icon,
  Divider,
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import { 
  FaUtensils, 
  FaHotel, 
  FaCar, 
  FaGlassCheers, 
  FaTicketAlt, 
  FaUserShield, 
  FaPassport, 
  FaGlobe 
} from 'react-icons/fa';

const ConciergeServicesPage = () => {
  return (
    <Container maxW="container.xl" py={10}>
      {/* Hero Section */}
      <Box textAlign="center" mb={20}>
        <Heading as="h1" size="2xl" mb={6}>
          Concierge Services
        </Heading>
        <Text fontSize="xl" maxW="3xl" mx="auto" color="gray.600">
          Experience seamless luxury beyond the aircraft with our comprehensive concierge services tailored to your preferences and needs.
        </Text>
      </Box>

      {/* Concierge Overview */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} mb={20}>
        <Box>
          <Heading as="h2" size="xl" mb={6}>
            Beyond the Flight
          </Heading>
          <VStack spacing={4} align="start">
            <Text>
              At PrivateJet, we understand that your journey extends beyond the aircraft. Our dedicated concierge team ensures that every aspect of your travel experience is meticulously planned and flawlessly executed.
            </Text>
            <Text>
              From ground transportation and accommodation to dining reservations and entertainment, we handle all the details so you can focus on enjoying your journey.
            </Text>
            <Text>
              Our global network of premium service providers gives you access to exclusive experiences and venues not available to the general public, creating truly memorable moments wherever you travel.
            </Text>
            <Text>
              Available 24/7, our concierge team is ready to accommodate last-minute changes and special requests, ensuring that your travel experience is as flexible as it is luxurious.
            </Text>
          </VStack>
          
          <Box mt={8}>
            <Button colorScheme="brand" size="lg">
              Contact Our Concierge Team
            </Button>
          </Box>
        </Box>
        
        <Flex justify="center" align="center">
          <Image 
            src="/images/concierge/concierge-service.jpg" 
            alt="Concierge Service" 
            borderRadius="lg"
            objectFit="cover"
            boxShadow="xl"
            fallbackSrc="https://via.placeholder.com/600x400?text=Concierge+Services"
          />
        </Flex>
      </SimpleGrid>

      <Divider my={10} />

      {/* Concierge Services */}
      <Box mb={20}>
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          Our Premium Services
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          <ServiceCard 
            icon={FaCar}
            title="Ground Transportation"
            description="Luxury vehicles, chauffeur services, and helicopter transfers coordinated seamlessly with your flight schedule."
          />
          
          <ServiceCard 
            icon={FaHotel}
            title="Accommodation"
            description="Exclusive access to luxury hotels, private villas, and residences with VIP treatment and special amenities."
          />
          
          <ServiceCard 
            icon={FaUtensils}
            title="Dining"
            description="Reservations at the finest restaurants, private chefs, and customized in-flight catering to your preferences."
          />
          
          <ServiceCard 
            icon={FaGlassCheers}
            title="Entertainment"
            description="VIP access to events, exclusive experiences, and personalized excursions at your destination."
          />
          
          <ServiceCard 
            icon={FaTicketAlt}
            title="Event Access"
            description="Priority tickets and VIP experiences for sporting events, performances, and exclusive gatherings."
          />
          
          <ServiceCard 
            icon={FaUserShield}
            title="Security Services"
            description="Discrete personal security, private transfers, and secure meeting facilities for high-profile travelers."
          />
          
          <ServiceCard 
            icon={FaPassport}
            title="Travel Documentation"
            description="Visa arrangements, passport services, and assistance with travel requirements and restrictions."
          />
          
          <ServiceCard 
            icon={FaGlobe}
            title="Global Support"
            description="24/7 dedicated concierge team available to handle special requests and last-minute changes."
          />
        </SimpleGrid>
      </Box>

      {/* Featured Experiences */}
      <Box mb={20}>
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          Exclusive Experiences
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          <ExperienceCard 
            title="Private Yacht Charter"
            location="Mediterranean"
            image="/images/concierge/yacht-charter.jpg"
            description="Explore the Mediterranean coastline aboard a luxury yacht with a professional crew and personalized itinerary."
          />
          
          <ExperienceCard 
            title="Michelin Star Chef Experience"
            location="Global"
            image="/images/concierge/chef-experience.jpg"
            description="Enjoy a private dining experience with a renowned Michelin-starred chef, either at your accommodation or in-flight."
          />
          
          <ExperienceCard 
            title="VIP Sporting Events"
            location="Global"
            image="/images/concierge/sporting-event.jpg"
            description="Access the best seats, private boxes, and meet-and-greet opportunities at major sporting events worldwide."
          />
          
          <ExperienceCard 
            title="Private Museum Tours"
            location="Europe"
            image="/images/concierge/museum-tour.jpg"
            description="Exclusive after-hours access to world-famous museums with expert curators and art historians."
          />
          
          <ExperienceCard 
            title="Luxury Safari Experience"
            location="Africa"
            image="/images/concierge/safari-experience.jpg"
            description="Bespoke safari experiences with luxury accommodations, expert guides, and conservation insights."
          />
          
          <ExperienceCard 
            title="Wine Region Exploration"
            location="Global"
            image="/images/concierge/wine-tour.jpg"
            description="Private tours of prestigious vineyards with tastings, cellar access, and meetings with renowned winemakers."
          />
        </SimpleGrid>
      </Box>

      {/* How It Works */}
      <Box mb={20} bg="gray.50" p={10} borderRadius="xl">
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          How Our Concierge Service Works
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <ProcessCard 
            number="01" 
            title="Initial Consultation" 
            description="We learn about your preferences, needs, and expectations to create a personalized concierge profile." 
          />
          <ProcessCard 
            number="02" 
            title="Tailored Planning" 
            description="Our team develops customized recommendations and handles all bookings and arrangements on your behalf." 
          />
          <ProcessCard 
            number="03" 
            title="Seamless Execution" 
            description="Enjoy a perfectly coordinated experience with 24/7 support throughout your journey." 
          />
        </SimpleGrid>
      </Box>

      {/* Client Testimonials */}
      <Box mb={20}>
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          Client Experiences
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          <TestimonialCard 
            quote="Their concierge service transformed our business trip into an unforgettable experience. Every detail was perfect, from the chauffeur service to the private dining arrangements."
            name="Michael R."
            title="CEO, Global Technologies"
          />
          
          <TestimonialCard 
            quote="When our plans changed last minute, the concierge team rearranged everything within hours. Their ability to adapt and deliver exceptional service is unmatched."
            name="Sarah L."
            title="Fashion Industry Executive"
          />
          
          <TestimonialCard 
            quote="The exclusive experiences they arranged for our family vacation were truly beyond expectations. Our children still talk about the private tour of the museum and meeting their sports heroes."
            name="James and Emma T."
            title="Frequent PrivateJet Clients"
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
          Elevate Your Travel Experience
        </Heading>
        <Text fontSize="lg" mb={6} maxW="3xl" mx="auto">
          Whether you're traveling for business or leisure, our concierge team is ready to create exceptional experiences tailored to your preferences.
        </Text>
        <Button 
          size="lg" 
          colorScheme="white" 
          variant="outline" 
          _hover={{ bg: 'whiteAlpha.200' }}
        >
          Request Concierge Services
        </Button>
      </Box>
    </Container>
  );
};

// Service Card Component
const ServiceCard = ({ icon, title, description }) => {
  return (
    <VStack 
      bg="white" 
      p={6} 
      borderRadius="lg" 
      boxShadow="base"
      borderWidth="1px"
      align="start"
      spacing={4}
      height="100%"
    >
      <Flex
        w={12}
        h={12}
        align="center"
        justify="center"
        rounded="full"
        bg="brand.500"
        color="white"
      >
        <Icon as={icon} boxSize={5} />
      </Flex>
      <Heading as="h3" size="md">
        {title}
      </Heading>
      <Text color="gray.600">{description}</Text>
    </VStack>
  );
};

// Experience Card Component
const ExperienceCard = ({ title, location, image, description }) => {
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
      <Box position="relative">
        <Image 
          src={image} 
          alt={title}
          height="200px"
          width="100%"
          objectFit="cover"
          fallbackSrc={`https://via.placeholder.com/500x200?text=${title.replace(/\s+/g, '+')}`}
        />
        <Badge 
          position="absolute" 
          top={3} 
          right={3} 
          colorScheme="brand" 
          fontSize="sm"
        >
          {location}
        </Badge>
      </Box>
      
      <Box p={5}>
        <Heading as="h3" size="md" mb={2}>
          {title}
        </Heading>
        <Text color="gray.600" mb={4}>
          {description}
        </Text>
        <Button 
          colorScheme="brand" 
          variant="outline" 
          size="sm"
          width="full"
        >
          Learn More
        </Button>
      </Box>
    </Box>
  );
};

// Process Card Component
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

// Testimonial Card Component
const TestimonialCard = ({ quote, name, title }) => {
  return (
    <Box 
      bg="white" 
      p={6} 
      borderRadius="lg" 
      boxShadow="base"
      borderWidth="1px"
      position="relative"
    >
      <Text fontSize="xl" fontStyle="italic" mb={6} color="gray.700">
        "{quote}"
      </Text>
      <HStack>
        <Box>
          <Text fontWeight="bold">{name}</Text>
          <Text fontSize="sm" color="gray.600">{title}</Text>
        </Box>
      </HStack>
    </Box>
  );
};

export default ConciergeServicesPage;