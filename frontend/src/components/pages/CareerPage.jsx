import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  Stack,
  Tag,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
  Input,
  Select,
} from '@chakra-ui/react';
import { FaSearch, FaMapMarkerAlt, FaRegClock, FaBriefcase, FaRegHandshake, FaUsers, FaLaptopCode } from 'react-icons/fa';

const CareerPage = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');
  const accentColor = 'teal.500';
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const jobListings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      location: 'San Francisco, CA (Remote Optional)',
      department: 'Engineering',
      type: 'Full-time',
      posted: '2 days ago',
    },
    {
      id: 2,
      title: 'Product Manager',
      location: 'New York, NY',
      department: 'Product',
      type: 'Full-time',
      posted: '1 week ago',
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      location: 'Remote',
      department: 'Design',
      type: 'Full-time',
      posted: '3 days ago',
    },
    {
      id: 4,
      title: 'Data Scientist',
      location: 'Boston, MA',
      department: 'Data',
      type: 'Full-time',
      posted: 'Today',
    },
    {
      id: 5,
      title: 'Marketing Specialist',
      location: 'Chicago, IL (Remote Optional)',
      department: 'Marketing',
      type: 'Full-time',
      posted: '5 days ago',
    },
    {
      id: 6,
      title: 'Customer Success Intern',
      location: 'Remote',
      department: 'Customer Success',
      type: 'Part-time',
      posted: '1 week ago',
    },
  ];

  // Benefits data
  const benefits = [
    { title: 'Flexible Work', description: 'Remote and hybrid options available for most positions.' },
    { title: 'Health & Wellness', description: 'Comprehensive health insurance and wellness programs.' },
    { title: 'Professional Development', description: 'Learning stipend and career growth opportunities.' },
    { title: 'Competitive Compensation', description: 'Salary, equity, and performance bonuses.' },
    { title: 'Paid Time Off', description: 'Generous vacation policy and paid holidays.' },
    { title: 'Parental Leave', description: 'Support for growing families with paid leave.' },
    { title: '401(k) Matching', description: 'Retirement savings with company contribution.' },
    { title: 'Team Events', description: 'Regular social activities and team building events.' }
  ];

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Hero Section */}
      <Box 
        bg={accentColor} 
        color="white" 
        py={16}
        backgroundImage="url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80')"
        backgroundSize="cover"
        backgroundPosition="center"
        position="relative"
      >
        <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="blackAlpha.600" />
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={6} align="flex-start" maxW="xl">
            <Heading as="h1" size="2xl" fontWeight="bold">
              Join Our Team
            </Heading>
            <Text fontSize="xl">
              We're looking for passionate individuals to help us build the future. Discover your next career opportunity.
            </Text>
            <Button size="lg" colorScheme="white" variant="outline" _hover={{ bg: 'whiteAlpha.200' }}>
              View Open Positions
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Culture Section */}
      <Container maxW="container.xl" py={16}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading as="h2" size="xl" color={headingColor}>
              Our Culture
            </Heading>
            <Text color={textColor} fontSize="lg" maxW="3xl">
              We believe in fostering a collaborative, inclusive, and innovative environment where everyone can thrive and make an impact.
            </Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
            <VStack spacing={4} align="flex-start" p={6} bg={cardBg} rounded="lg" shadow="md">
              <Icon as={FaLaptopCode} w={10} h={10} color={accentColor} />
              <Heading as="h3" size="md" color={headingColor}>
                Innovation
              </Heading>
              <Text color={textColor}>
                We encourage creative thinking and bold ideas that challenge the status quo and drive meaningful change.
              </Text>
            </VStack>

            <VStack spacing={4} align="flex-start" p={6} bg={cardBg} rounded="lg" shadow="md">
              <Icon as={FaUsers} w={10} h={10} color={accentColor} />
              <Heading as="h3" size="md" color={headingColor}>
                Diversity & Inclusion
              </Heading>
              <Text color={textColor}>
                We value diverse perspectives and create an environment where everyone feels welcome and respected.
              </Text>
            </VStack>

            <VStack spacing={4} align="flex-start" p={6} bg={cardBg} rounded="lg" shadow="md">
              <Icon as={FaRegHandshake} w={10} h={10} color={accentColor} />
              <Heading as="h3" size="md" color={headingColor}>
                Collaboration
              </Heading>
              <Text color={textColor}>
                We work together across teams, sharing knowledge and supporting each other to achieve common goals.
              </Text>
            </VStack>
          </Grid>
        </VStack>
      </Container>

      {/* Benefits Section */}
      <Box bg={useColorModeValue('gray.100', 'gray.700')} py={16}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="xl" color={headingColor}>
                Benefits & Perks
              </Heading>
              <Text color={textColor} fontSize="lg" maxW="3xl">
                We offer competitive compensation and benefits to support our team's well-being and professional growth.
              </Text>
            </VStack>

            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
              {benefits.map((benefit, idx) => (
                <Box key={idx} p={5} bg={cardBg} rounded="md" shadow="sm">
                  <Heading as="h3" size="sm" mb={2} color={headingColor}>
                    {benefit.title}
                  </Heading>
                  <Text color={textColor} fontSize="sm">
                    {benefit.description}
                  </Text>
                </Box>
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Job Listings Section */}
      <Container maxW="container.xl" py={16}>
        <VStack spacing={12} align="stretch">
          <VStack spacing={4} textAlign="center">
            <Heading as="h2" size="xl" color={headingColor}>
              Open Positions
            </Heading>
            <Text color={textColor} fontSize="lg" maxW="3xl">
              Find your perfect role and join us in our mission to create meaningful impact.
            </Text>
          </VStack>

          {/* Search and Filters */}
          <Box>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)', lg: '3fr 1fr 1fr 1fr' }} gap={4}>
              <Box position="relative">
                <Input placeholder="Search for jobs..." py={6} pl={10} />
                <Icon as={FaSearch} position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" />
              </Box>
              <Select placeholder="Department" py={6}>
                <option value="engineering">Engineering</option>
                <option value="design">Design</option>
                <option value="product">Product</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="data">Data</option>
              </Select>
              <Select placeholder="Location" py={6}>
                <option value="remote">Remote</option>
                <option value="san-francisco">San Francisco</option>
                <option value="new-york">New York</option>
                <option value="boston">Boston</option>
                <option value="chicago">Chicago</option>
              </Select>
              <Select placeholder="Job Type" py={6}>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </Select>
            </Grid>
          </Box>

          {/* Job Cards */}
          <VStack spacing={4} align="stretch">
            {jobListings.map((job) => (
              <Box 
                key={job.id} 
                p={6} 
                bg={cardBg} 
                rounded="lg" 
                shadow="sm" 
                borderWidth="1px"
                borderColor={borderColor}
                _hover={{ 
                  shadow: 'md', 
                  borderColor: accentColor,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }}>
                  <Box mb={{ base: 4, md: 0 }}>
                    <Heading as="h3" size="md" color={headingColor} mb={2}>
                      {job.title}
                    </Heading>
                    <HStack spacing={4}>
                      <HStack color={textColor}>
                        <Icon as={FaMapMarkerAlt} />
                        <Text fontSize="sm">{job.location}</Text>
                      </HStack>
                      <HStack color={textColor}>
                        <Icon as={FaBriefcase} />
                        <Text fontSize="sm">{job.department}</Text>
                      </HStack>
                      <HStack color={textColor}>
                        <Icon as={FaRegClock} />
                        <Text fontSize="sm">Posted {job.posted}</Text>
                      </HStack>
                    </HStack>
                  </Box>
                  <HStack spacing={4}>
                    <Tag colorScheme={job.type === 'Full-time' ? 'teal' : 'purple'}>
                      {job.type}
                    </Tag>
                    <Button colorScheme="teal" variant="outline">
                      View Details
                    </Button>
                  </HStack>
                </Flex>
              </Box>
            ))}
          </VStack>

          {/* Pagination */}
          <Flex justify="center" mt={8}>
            <HStack spacing={2}>
              <Button variant="outline">Previous</Button>
              <Button colorScheme="teal">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </HStack>
          </Flex>
        </VStack>
      </Container>

      {/* Join Our Team CTA */}
      <Box bg={accentColor} color="white" py={16}>
        <Container maxW="container.xl">
          <Stack direction={{ base: 'column', md: 'row' }} spacing={8} align="center" justify="space-between">
            <VStack align="flex-start" spacing={4} maxW="lg">
              <Heading as="h2" size="xl">
                Don't See the Right Fit?
              </Heading>
              <Text fontSize="lg">
                We're always looking for talented individuals to join our team. Send us your resume and let us know how you can contribute.
              </Text>
            </VStack>
            <Button size="lg" colorScheme="white" variant="outline" _hover={{ bg: 'whiteAlpha.200' }}>
              Contact Recruiting
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default CareerPage;