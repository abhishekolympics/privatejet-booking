// components/pages/AircraftManagementPage.jsx
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
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  Grid,
  GridItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';
import { 
  FaPlane, 
  FaChartLine, 
  FaShieldAlt, 
  FaTools, 
  FaUserTie, 
  FaFileInvoiceDollar, 
  FaUsers,
  FaCheckCircle,
  FaChevronRight
} from 'react-icons/fa';

const AircraftManagementPage = () => {
  return (
    <Container maxW="container.xl" py={10}>
      {/* Hero Section */}
      <Box textAlign="center" mb={20}>
        <Heading as="h1" size="2xl" mb={6}>
          Aircraft Management
        </Heading>
        <Text fontSize="xl" maxW="3xl" mx="auto" color="gray.600">
          Optimize the value of your aircraft with our comprehensive management solutions designed for today's private aircraft owners.
        </Text>
      </Box>

      {/* Management Services Overview */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} mb={20}>
        <Box>
          <Heading as="h2" size="xl" mb={6}>
            Maximize Your Aircraft Investment
          </Heading>
          <VStack spacing={4} align="start">
            <Text>
              PrivateJet offers industry-leading aircraft management services that reduce the complexities and costs of private aircraft ownership while maximizing your asset's value and availability.
            </Text>
            <Text>
              Our team of aviation experts handles every aspect of your aircraft's operation, from maintenance and crew staffing to regulatory compliance and financial management.
            </Text>
            <Text>
              When you're not using your aircraft, we can generate revenue through our charter network, offsetting ownership costs while ensuring your aircraft is maintained to the highest standards.
            </Text>
            <Text>
              With locations at major private aviation hubs worldwide, we provide seamless management services regardless of where you fly or base your aircraft.
            </Text>
          </VStack>
          
          <Box mt={8}>
            <Button colorScheme="brand" size="lg">
              Request Management Consultation
            </Button>
          </Box>
        </Box>
        
        <Flex justify="center" align="center">
          <Image 
            src="/images/management/aircraft-management.jpg" 
            alt="Aircraft Management" 
            borderRadius="lg"
            objectFit="cover"
            boxShadow="xl"
            fallbackSrc="https://via.placeholder.com/600x400?text=Aircraft+Management"
          />
        </Flex>
      </SimpleGrid>

      <Divider my={10} />

      {/* Core Services */}
      <Box mb={20}>
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          Comprehensive Management Services
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          <ServiceCard 
            icon={FaShieldAlt}
            title="Operational Management"
            description="Complete operational oversight including flight planning, weather monitoring, permits, handling arrangements, and 24/7 flight support."
          />
          
          <ServiceCard 
            icon={FaTools}
            title="Maintenance Management"
            description="Comprehensive maintenance programs with scheduled inspections, repairs, parts inventory management, and warranty administration."
          />
          
          <ServiceCard 
            icon={FaUserTie}
            title="Crew Management"
            description="Recruitment, training, scheduling, and management of experienced flight crews dedicated to your aircraft and operating standards."
          />
          
          <ServiceCard 
            icon={FaFileInvoiceDollar}
            title="Financial Management"
            description="Detailed financial reporting, expense tracking, budget planning, and vendor management to optimize your aircraft's economics."
          />
          
          <ServiceCard 
            icon={FaChartLine}
            title="Charter Revenue Management"
            description="Generate revenue from your aircraft when you're not using it through our global charter network, with transparent reporting and owner approval protocols."
          />
          
          <ServiceCard 
            icon={FaUsers}
            title="Owner Services"
            description="Personalized owner services including flight scheduling, catering preferences, ground transportation, and special requests for a seamless experience."
          />
        </SimpleGrid>
      </Box>

      {/* Management Program Benefits */}
      <Box mb={20} bg="gray.50" p={10} borderRadius="xl">
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          Benefits of Our Management Program
        </Heading>
        
        <Grid 
          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap={10}
        >
          <GridItem>
            <VStack align="start" spacing={6}>
              <Heading as="h3" size="md">Financial Benefits</Heading>
              
              <List spacing={3}>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="brand.500" />
                  Significant savings on fuel, insurance, and maintenance through fleet purchasing power
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="brand.500" />
                  Reduced crew costs through shared pilot programs for qualifying aircraft
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="brand.500" />
                  Charter revenue opportunities to offset ownership costs
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="brand.500" />
                  Tax advantages and compliance management
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="brand.500" />
                  Transparent financial reporting and analytics
                </ListItem>
              </List>
            </VStack>
          </GridItem>
          
          <GridItem>
            <VStack align="start" spacing={6}>
              <Heading as="h3" size="md">Operational Benefits</Heading>
              
              <List spacing={3}>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="brand.500" />
                  24/7 operational support from experienced aviation professionals
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="brand.500" />
                  Access to preferred FBOs, ground handling, and catering services
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="brand.500" />
                  Comprehensive safety management system and rigorous crew training
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="brand.500" />
                  Reduced aircraft downtime through proactive maintenance management
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="brand.500" />
                  Simplified ownership experience with a single point of contact
                </ListItem>
              </List>
            </VStack>
          </GridItem>
        </Grid>
      </Box>

      {/* Management Process */}
      <Box mb={20}>
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          Our Management Process
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
          <ProcessCard 
            number="01" 
            title="Consultation" 
            description="We analyze your flying patterns, aircraft utilization, and ownership goals to develop a tailored management program." 
          />
          <ProcessCard 
            number="02" 
            title="Implementation" 
            description="Our team handles the transition, including crew integration, systems setup, and operational preparations." 
          />
          <ProcessCard 
            number="03" 
            title="Management" 
            description="We oversee all aspects of your aircraft operation, maintenance, crewing, and financial administration." 
          />
          <ProcessCard 
            number="04" 
            title="Optimization" 
            description="Continuous analysis and refinement of your management program to ensure maximum value and efficiency." 
          />
        </SimpleGrid>
      </Box>

      {/* FAQs */}
      <Box mb={20}>
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          Frequently Asked Questions
        </Heading>
        
        <Accordion allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  How does charter revenue generation work?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              When you're not using your aircraft, we can offer it for charter through our global network of clients. You maintain full control over availability, and we provide transparent reporting on all charter activity. Charter revenue is used to offset your ownership costs, potentially reducing them by 30-60% depending on your aircraft type and availability. You'll receive detailed monthly statements showing all revenue and associated costs.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  Do I need to change my aircraft registration?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              No, your aircraft remains registered in your name or your company's name. Our management services operate under our Air Carrier Certificate, allowing us to provide charter services with your aircraft while maintaining your ownership status. We handle all the necessary regulatory requirements and documentation to ensure compliance.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  Can I keep my current flight crew?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Yes, we can integrate your existing crew into our operations. We'll ensure they complete our standardized training program and meet our safety standards. If you prefer, we can also provide a fully trained and qualified crew for your aircraft. Our crew management includes ongoing training, scheduling, benefits administration, and all other HR functions.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  How do you handle scheduled maintenance?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Our maintenance department develops a comprehensive maintenance schedule for your aircraft that maximizes availability while ensuring all manufacturer and regulatory requirements are met. We coordinate all scheduled maintenance with approved service centers, monitor the work, and ensure quality control. For unscheduled maintenance, we have AOG (Aircraft On Ground) support available 24/7 to minimize downtime.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  What types of aircraft do you manage?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              We manage a wide range of private aircraft, from light jets like the Citation CJ4 and Phenom 300 to ultra-long range aircraft such as the Gulfstream G650 and Global 6000. Our team has experience with virtually all major manufacturers and models. Each management program is customized to the specific aircraft type and the owner's requirements.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
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
          Ready to Simplify Aircraft Ownership?
        </Heading>
        <Text fontSize="lg" mb={6} maxW="3xl" mx="auto">
          Contact our aircraft management team today to learn how we can optimize your ownership experience and reduce your operating costs.
        </Text>
        <Button 
          size="lg" 
          colorScheme="white" 
          variant="outline" 
          _hover={{ bg: 'whiteAlpha.200' }}
        >
          Request a Management Proposal
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

export default AircraftManagementPage;