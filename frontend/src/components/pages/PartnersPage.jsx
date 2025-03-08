// components/pages/PartnersPage.jsx
import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Image,
  Button,
  Divider,
  Flex,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FaHandshake, FaCertificate, FaChartLine, FaGlobeAmericas } from 'react-icons/fa';

const PartnersPage = () => {
  return (
    <Container maxW="container.xl" py={10}>
      {/* Hero Section */}
      <Box textAlign="center" mb={20}>
        <Heading as="h1" size="2xl" mb={6}>
          Partner with PrivateJet
        </Heading>
        <Text fontSize="xl" maxW="3xl" mx="auto" color="gray.600">
          Join our global network of aviation partners to expand your reach and enhance your services.
        </Text>
      </Box>

      {/* Partnership Types */}
      <Box mb={20}>
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          Partnership Opportunities
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <PartnershipCard
            title="Aircraft Operators"
            icon={FaGlobeAmericas}
            description="Connect your fleet to our global booking platform to increase utilization and reach high-value clients."
            benefits={[
              "Access to a global network of private jet clients",
              "Simplified booking and management system",
              "Reduced empty leg flights",
              "Optimized fleet utilization"
            ]}
          />
          
          <PartnershipCard
            title="FBOs & Ground Handlers"
            icon={FaCertificate}
            description="Become a preferred service provider in our network to increase traffic and enhance client experiences."
            benefits={[
              "Preferred status for our client bookings",
              "Brand visibility to high-net-worth travelers",
              "Streamlined service coordination",
              "Enhanced passenger experience reporting"
            ]}
          />
          
          <PartnershipCard
            title="Luxury Service Providers"
            icon={FaHandshake}
            description="Offer your exclusive services to our clientele of discerning travelers seeking premium experiences."
            benefits={[
              "Access to high-value private jet clientele",
              "Integration with our concierge platform",
              "Co-marketing opportunities",
              "Client preference insights"
            ]}
          />
          
          <PartnershipCard
            title="Corporate Travel Programs"
            icon={FaChartLine}
            description="Integrate private aviation into your corporate travel solutions with our seamless booking platform."
            benefits={[
              "Dedicated corporate booking portal",
              "Preferential rates for volume commitments",
              "Detailed reporting and expense tracking",
              "24/7 priority support for corporate clients"
            ]}
          />
        </SimpleGrid>
      </Box>

      <Divider my={10} />

      {/* Partner Success Stories */}
      <Box mb={20}>
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          Partner Success Stories
        </Heading>
        
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} mb={14}>
          <Flex justify="center" align="center">
            <Image 
              src="/images/partners/partner-1.jpg" 
              alt="Partner Success Story" 
              borderRadius="lg"
              objectFit="cover"
              boxShadow="xl"
              fallbackSrc="https://via.placeholder.com/600x400?text=Partner+Success"
            />
          </Flex>
          <Box>
            <Heading as="h3" size="lg" mb={4}>
              Atlas Aviation
            </Heading>
            <Text fontSize="md" fontStyle="italic" color="gray.600" mb={4}>
              "Partnering with PrivateJet has transformed our business. We've seen a 35% increase in fleet utilization and significantly reduced empty leg flights."
            </Text>
            <Text mb={4}>
              Atlas Aviation, a mid-sized operator with a fleet of 8 aircraft, joined the PrivateJet network in 2023. Within six months, they saw dramatic improvements in their operational efficiency and revenue.
            </Text>
            <Text>
              By leveraging our booking platform and global client base, Atlas was able to optimize their flight schedules, reduce repositioning costs, and tap into new market segments that were previously inaccessible.
            </Text>
          </Box>
        </SimpleGrid>
        
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} mb={14}>
          <Box order={{ base: 1, lg: 2 }}>
            <Heading as="h3" size="lg" mb={4}>
              Pinnacle Ground Services
            </Heading>
            <Text fontSize="md" fontStyle="italic" color="gray.600" mb={4}>
              "As a PrivateJet partner, we've welcomed hundreds of new high-value clients to our FBO facilities. The partnership has elevated our service standards and business volume."
            </Text>
            <Text mb={4}>
              Pinnacle Ground Services operates premium FBO facilities at three major airports. Since partnering with PrivateJet, they've become the preferred ground handler for our clients in their regions.
            </Text>
            <Text>
              The partnership has not only increased their traffic volume but also helped them enhance their service offerings based on the preferences and feedback from our discerning clientele.
            </Text>
          </Box>
          <Flex justify="center" align="center" order={{ base: 2, lg: 1 }}>
            <Image 
              src="/images/partners/partner-2.jpg" 
              alt="Partner Success Story" 
              borderRadius="lg"
              objectFit="cover"
              boxShadow="xl"
              fallbackSrc="https://via.placeholder.com/600x400?text=Partner+Success"
            />
          </Flex>
        </SimpleGrid>
      </Box>

      {/* Becoming a Partner */}
      <Box mb={20}>
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          How to Become a Partner
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <ProcessCard 
            number="01" 
            title="Apply" 
            description="Submit your company information and partnership interests through our simple application process." 
          />
          <ProcessCard 
            number="02" 
            title="Onboard" 
            description="Meet with our partnership team to define terms and complete the verification process." 
          />
          <ProcessCard 
            number="03" 
            title="Launch" 
            description="Integrate with our platform and start receiving client bookings and requests." 
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
          Ready to Explore a Partnership?
        </Heading>
        <Text fontSize="lg" mb={6} maxW="3xl" mx="auto">
          Contact our partnership team today to discuss how we can collaborate to grow your business and enhance the private aviation experience.
        </Text>
        <Button 
          size="lg" 
          colorScheme="white" 
          variant="outline" 
          _hover={{ bg: 'whiteAlpha.200' }}
          as="a"
          href="mailto:partnerships@privatejet.com"
        >
          Contact Our Partnership Team
        </Button>
      </Box>
    </Container>
  );
};

const PartnershipCard = ({ title, icon, description, benefits }) => {
  return (
    <VStack 
      bg="white" 
      p={6} 
      borderRadius="lg" 
      boxShadow="base"
      borderWidth="1px"
      align="start"
      spacing={5}
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
      
      <VStack align="start" spacing={2} w="full">
        <Text fontWeight="medium">Key Benefits:</Text>
        {benefits.map((benefit, index) => (
          <HStack key={index} align="start">
            <Text color="brand.500" fontWeight="bold">•</Text>
            <Text>{benefit}</Text>
          </HStack>
        ))}
      </VStack>
      
      <Button colorScheme="brand" mt={2} size="sm">Learn More</Button>
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

export default PartnersPage;