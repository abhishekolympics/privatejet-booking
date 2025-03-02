// components/pages/AboutPage.jsx
import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Image,
  Flex,
  Divider,
  Stack,
  HStack,
  Icon,
  Button
} from '@chakra-ui/react';
import { FaCheck, FaPlane, FaClock, FaUserShield, FaGlobe } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="container.xl" py={10}>
      {/* Hero Section */}
      <Box textAlign="center" mb={20}>
        <Heading as="h1" size="2xl" mb={6}>
          About PrivateJet
        </Heading>
        <Text fontSize="xl" maxW="3xl" mx="auto" color="gray.600">
          We're revolutionizing the private aviation industry with cutting-edge technology
          and a commitment to exceptional service.
        </Text>
      </Box>

      {/* Our Story Section */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} mb={20}>
        <Box>
          <Heading as="h2" size="xl" mb={6}>
            Our Story
          </Heading>
          <VStack spacing={4} align="start">
            <Text>
              Founded in 2023, PrivateJet was created to solve the challenges in the private aviation
              industry. We saw that booking private jets was often slow, outdated, and lacked transparency.
            </Text>
            <Text>
              Our team of aviation experts and technology innovators came together to build a 
              platform that makes private jet travel more accessible, transparent, and efficient.
            </Text>
            <Text>
              Today, we connect customers with thousands of aircraft worldwide, offering real-time 
              availability, instant pricing, and a seamless booking experience.
            </Text>
            <Text>
              Our mission is to provide exceptional private travel experiences while maintaining the 
              highest standards of safety, service, and convenience.
            </Text>
          </VStack>
        </Box>
        <Flex justify="center" align="center">
          <Image 
            src="/images/about/company-story.jpg" 
            alt="PrivateJet Team" 
            borderRadius="lg"
            objectFit="cover"
            boxShadow="xl"
          />
        </Flex>
      </SimpleGrid>

      <Divider my={10} />

      {/* Value Proposition */}
      <Box mb={20}>
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          Why Choose PrivateJet
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          <FeatureCard 
            icon={FaPlane} 
            title="Global Fleet" 
            description="Access to thousands of aircraft around the world, from light jets to ultra-long-range aircraft."
          />
          <FeatureCard 
            icon={FaClock} 
            title="Time Efficiency" 
            description="Book your jet in minutes, not days. Real-time availability and instant pricing."
          />
          <FeatureCard 
            icon={FaUserShield} 
            title="Safety First" 
            description="All aircraft and operators in our network meet the highest industry safety standards."
          />
          <FeatureCard 
            icon={FaGlobe} 
            title="24/7 Support" 
            description="Our global support team is available around the clock to assist with any needs."
          />
        </SimpleGrid>
      </Box>

      {/* Our Process */}
      <Box mb={20}>
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          How It Works
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <ProcessCard 
            number="01" 
            title="Book" 
            description="Use our platform to search for available aircraft based on your travel needs." 
          />
          <ProcessCard 
            number="02" 
            title="Confirm" 
            description="Select your preferred aircraft and confirm your booking with secure payment." 
          />
          <ProcessCard 
            number="03" 
            title="Fly" 
            description="Arrive at the private terminal and enjoy a seamless travel experience." 
          />
        </SimpleGrid>
      </Box>

      {/* Team Section */}
      <Box mb={20}>
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          Our Leadership Team
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          <TeamMember 
            name="John Smith" 
            role="Chief Executive Officer" 
            image="/images/about/ceo.jpg"
            description="Former airline executive with over 20 years of aviation experience."
          />
          <TeamMember 
            name="Sarah Johnson" 
            role="Chief Operating Officer" 
            image="/images/about/coo.jpg"
            description="Aviation industry veteran specialized in operations and logistics."
          />
          <TeamMember 
            name="Michael Chen" 
            role="Chief Technology Officer" 
            image="/images/about/cto.jpg"
            description="Tech entrepreneur with multiple successful platforms in the travel industry."
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
          Ready to Experience Private Aviation?
        </Heading>
        <Text fontSize="lg" mb={6} maxW="3xl" mx="auto">
          Book your first flight today and discover why our clients choose PrivateJet for their private travel needs.
        </Text>
        <Button 
          size="lg" 
          colorScheme="white" 
          variant="outline" 
          _hover={{ bg: 'whiteAlpha.200' }}
          onClick={() => navigate('/booking')}
        >
          Book Your Flight
        </Button>
      </Box>
    </Container>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <VStack 
      bg="white" 
      p={6} 
      borderRadius="lg" 
      boxShadow="base"
      borderWidth="1px"
      align="start"
      spacing={4}
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

const TeamMember = ({ name, role, image, description }) => {
  return (
    <VStack 
      bg="white" 
      borderRadius="lg" 
      boxShadow="base"
      borderWidth="1px"
      overflow="hidden"
      spacing={0}
      h="100%"
    >
      <Image 
        src={image} 
        alt={name} 
        w="full" 
        h="250px" 
        objectFit="cover" 
      />
      <VStack p={6} spacing={2} align="start" w="full" flex="1">
        <Heading as="h3" size="md">
          {name}
        </Heading>
        <Text color="brand.500" fontWeight="medium">{role}</Text>
        <Text color="gray.600" mt={2}>{description}</Text>
      </VStack>
    </VStack>
  );
};

export default AboutPage;