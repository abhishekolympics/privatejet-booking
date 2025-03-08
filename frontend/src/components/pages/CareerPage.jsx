import React, { useState } from 'react';
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  List,
  ListItem,
  ListIcon,
  Badge,
  useDisclosure,
} from '@chakra-ui/react';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaRegClock, 
  FaBriefcase, 
  FaRegHandshake, 
  FaUsers, 
  FaLaptopCode, 
  FaCheck,
  FaGraduationCap,
  FaRegCalendarAlt
} from 'react-icons/fa';

const CareerPage = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');
  const accentColor = 'teal.500';
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // All job listings data
  const allJobListings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      location: 'San Francisco, CA (Remote Optional)',
      department: 'Engineering',
      type: 'Full-time',
      posted: '2 days ago',
      description: 'We are looking for an experienced Frontend Developer to join our team and help build amazing user experiences.',
      requirements: [
        'At least 5 years of experience with React and modern JavaScript',
        'Experience with state management libraries like Redux or Context API',
        'Familiarity with CSS frameworks such as Tailwind or Chakra UI',
        'Strong understanding of responsive design principles',
        'Bachelors degree in Computer Science or related field'
      ],
      responsibilities: [
        'Develop and maintain frontend applications',
        'Collaborate with designers and backend engineers',
        'Optimize applications for maximum speed and scalability',
        'Write clean, maintainable code with tests',
        'Stay up-to-date with emerging trends and technologies'
      ]
    },
    {
      id: 2,
      title: 'Product Manager',
      location: 'New York, NY',
      department: 'Product',
      type: 'Full-time',
      posted: '1 week ago',
      description: 'We are seeking a passionate Product Manager to join our growing team and drive product vision and strategy.',
      requirements: [
        'At least 3 years of experience in product management',
        'Strong analytical skills and data-driven mindset',
        'Excellent communication and stakeholder management',
        'Familiarity with agile development methodologies',
        'Bachelors degree in Business, Computer Science, or related field'
      ],
      responsibilities: [
        'Define product vision, strategy and roadmap',
        'Work closely with engineering, design, and marketing teams',
        'Gather and analyze user feedback and market trends',
        'Prioritize features and define product requirements',
        'Monitor product metrics and drive continuous improvement'
      ]
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      location: 'Remote',
      department: 'Design',
      type: 'Full-time',
      posted: '3 days ago',
      description: 'We are looking for a creative UX/UI Designer to craft beautiful and intuitive user experiences for our products.',
      requirements: [
        'At least 3 years of experience in UX/UI design',
        'Proficiency with design tools like Figma, Sketch, and Adobe Creative Suite',
        'Strong portfolio demonstrating user-centric design thinking',
        'Experience with design systems and component libraries',
        'Bachelors degree in Design, HCI, or related field'
      ],
      responsibilities: [
        'Create wireframes, prototypes, and high-fidelity mockups',
        'Conduct user research and usability testing',
        'Collaborate with product and engineering teams',
        'Maintain and evolve our design system',
        'Stay current with UX trends and best practices'
      ]
    },
    {
      id: 4,
      title: 'Data Scientist',
      location: 'Boston, MA',
      department: 'Data',
      type: 'Full-time',
      posted: 'Today',
      description: 'We are seeking a talented Data Scientist to help us extract insights from complex datasets and drive data-informed decisions.',
      requirements: [
        'Advanced degree in Statistics, Mathematics, Computer Science, or related field',
        'Strong programming skills in Python, R, or similar languages',
        'Experience with machine learning frameworks like TensorFlow or PyTorch',
        'Knowledge of data visualization tools like Tableau or PowerBI',
        'Experience with SQL and database systems'
      ],
      responsibilities: [
        'Develop and implement statistical models and algorithms',
        'Extract insights from complex datasets and communicate findings',
        'Collaborate with cross-functional teams to solve business problems',
        'Build and maintain data pipelines and infrastructure',
        'Stay updated with the latest advancements in data science'
      ]
    },
    {
      id: 5,
      title: 'Marketing Specialist',
      location: 'Chicago, IL (Remote Optional)',
      department: 'Marketing',
      type: 'Full-time',
      posted: '5 days ago',
      description: 'Join our marketing team to help drive brand awareness, customer acquisition, and engagement strategies.',
      requirements: [
        'Bachelors degree in Marketing, Communications, or related field',
        'At least 2 years of experience in digital marketing',
        'Experience with social media marketing and content creation',
        'Familiarity with marketing analytics tools',
        'Strong writing and communication skills'
      ],
      responsibilities: [
        'Develop and execute marketing campaigns across multiple channels',
        'Create engaging content for social media, blog, and email',
        'Track and analyze marketing metrics to optimize campaigns',
        'Collaborate with design team on marketing materials',
        'Stay current with marketing trends and best practices'
      ]
    },
    {
      id: 6,
      title: 'Customer Success Intern',
      location: 'Remote',
      department: 'Customer Success',
      type: 'Part-time',
      posted: '1 week ago',
      description: 'We are looking for a motivated intern to join our Customer Success team and help ensure our customers have an exceptional experience.',
      requirements: [
        'Currently pursuing a Bachelors degree in Business, Communications, or related field',
        'Strong communication and interpersonal skills',
        'Basic knowledge of CRM systems like Salesforce',
        'Ability to work independently and as part of a team',
        'Passion for helping customers succeed'
      ],
      responsibilities: [
        'Assist with customer onboarding and training',
        'Respond to customer inquiries and escalate issues when necessary',
        'Help track and analyze customer satisfaction metrics',
        'Contribute to developing customer success resources',
        'Participate in team meetings and projects'
      ]
    },
    {
      id: 7,
      title: 'DevOps Engineer',
      location: 'Seattle, WA',
      department: 'Engineering',
      type: 'Full-time',
      posted: '4 days ago',
      description: 'We are looking for a skilled DevOps Engineer to help us build and maintain our cloud infrastructure and deployment pipelines.',
      requirements: [
        'At least 3 years of experience in DevOps or SRE roles',
        'Strong knowledge of AWS, Azure, or GCP',
        'Experience with containerization technologies like Docker and Kubernetes',
        'Familiarity with CI/CD tools like Jenkins, GitHub Actions, or CircleCI',
        'Knowledge of Infrastructure as Code using Terraform or CloudFormation'
      ],
      responsibilities: [
        'Design, implement, and maintain cloud infrastructure',
        'Automate deployment and scaling processes',
        'Monitor system performance and troubleshoot issues',
        'Collaborate with development teams to improve development workflows',
        'Implement security best practices and ensure compliance'
      ]
    },
    {
      id: 8,
      title: 'Sales Representative',
      location: 'Austin, TX',
      department: 'Sales',
      type: 'Full-time',
      posted: '1 week ago',
      description: 'Join our sales team to help drive revenue growth by building relationships with potential clients and closing deals.',
      requirements: [
        'Bachelors degree in Business, Marketing, or related field',
        'At least 2 years of B2B sales experience',
        'Strong communication and negotiation skills',
        'Experience with CRM systems like Salesforce',
        'Track record of meeting or exceeding sales targets'
      ],
      responsibilities: [
        'Prospect and qualify new sales opportunities',
        'Conduct product demonstrations and presentations',
        'Negotiate contracts and close deals',
        'Maintain relationships with existing clients',
        'Track sales activities and report on pipeline status'
      ]
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

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

  // State for selected job (for modal)
  const [selectedJob, setSelectedJob] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Filter jobs based on search and filter criteria
  const filteredJobs = allJobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === '' || job.department === departmentFilter;
    const matchesLocation = locationFilter === '' || job.location.includes(locationFilter);
    const matchesType = typeFilter === '' || job.type === typeFilter;

    return matchesSearch && matchesDepartment && matchesLocation && matchesType;
  });

  // Calculate pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Handle job details view
  const handleViewDetails = (job) => {
    setSelectedJob(job);
    onOpen();
  };

  // Extract unique departments, locations, and job types for filters
  const departments = [...new Set(allJobListings.map(job => job.department))];
  const locations = [...new Set(allJobListings.map(job => {
    const mainLocation = job.location.split('(')[0].trim();
    return mainLocation;
  }))];
  const jobTypes = [...new Set(allJobListings.map(job => job.type))];

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
            <Button 
              size="lg" 
              colorScheme="white" 
              variant="outline" 
              _hover={{ bg: 'whiteAlpha.200' }}
              onClick={() => {
                const element = document.getElementById('open-positions');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
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
      <Container maxW="container.xl" py={16} id="open-positions">
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
                <Input 
                  placeholder="Search for jobs..." 
                  py={6} 
                  pl={10} 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
                <Icon as={FaSearch} position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" />
              </Box>
              <Select 
                placeholder="Department" 
                py={1}
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </Select>
              <Select 
                placeholder="Location" 
                py={1}
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </Select>
              <Select 
                placeholder="Job Type" 
                py={1}
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
              >
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </Grid>
          </Box>

          {/* Job Cards */}
          {currentJobs.length === 0 ? (
            <VStack spacing={4} py={10}>
              <Heading size="md" color={textColor}>No positions found matching your criteria</Heading>
              <Button 
                colorScheme="teal" 
                onClick={() => {
                  setSearchTerm('');
                  setDepartmentFilter('');
                  setLocationFilter('');
                  setTypeFilter('');
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </Button>
            </VStack>
          ) : (
            <VStack spacing={4} align="stretch">
              {currentJobs.map((job) => (
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
                      <HStack spacing={4} flexWrap="wrap">
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
                      <Button 
                        colorScheme="teal" 
                        variant="outline"
                        onClick={() => handleViewDetails(job)}
                      >
                        View Details
                      </Button>
                    </HStack>
                  </Flex>
                </Box>
              ))}
            </VStack>
          )}

          {/* Pagination */}
          {filteredJobs.length > 0 && (
            <Flex justify="center" mt={8}>
              <HStack spacing={2}>
                <Button 
                  variant="outline" 
                  isDisabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                
                {[...Array(totalPages)].map((_, idx) => (
                  <Button 
                    key={idx} 
                    colorScheme={currentPage === idx + 1 ? "teal" : undefined}
                    variant={currentPage === idx + 1 ? "solid" : "outline"}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </Button>
                ))}
                
                <Button 
                  variant="outline"
                  isDisabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next
                </Button>
              </HStack>
            </Flex>
          )}
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

      {/* Job Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          {selectedJob && (
            <>
              <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
                <Heading size="lg" color={headingColor}>{selectedJob.title}</Heading>
                <HStack mt={2} spacing={4}>
                  <Badge colorScheme={selectedJob.type === 'Full-time' ? 'teal' : 'purple'} fontSize="sm" px={2} py={1}>
                    {selectedJob.type}
                  </Badge>
                  <Text fontSize="sm" color={textColor}>Posted {selectedJob.posted}</Text>
                </HStack>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody py={6}>
                <VStack align="stretch" spacing={6}>
                  <Box>
                    <HStack mb={2}>
                      <Icon as={FaMapMarkerAlt} color={accentColor} />
                      <Text fontWeight="bold">Location</Text>
                    </HStack>
                    <Text color={textColor}>{selectedJob.location}</Text>
                  </Box>
                  <Box>
                    <HStack mb={2}>
                      <Icon as={FaBriefcase} color={accentColor} />
                      <Text fontWeight="bold">Department</Text>
                    </HStack>
                    <Text color={textColor}>{selectedJob.department}</Text>
                  </Box>
                  <Box>
                    <HStack mb={2}>
                      <Icon as={FaRegHandshake} color={accentColor} />
                      <Text fontWeight="bold">Job Description</Text>
                    </HStack>
                    <Text color={textColor}>{selectedJob.description}</Text>
                  </Box>
                  <Box>
                    <HStack mb={2}>
                      <Icon as={FaGraduationCap} color={accentColor} />
                      <Text fontWeight="bold">Requirements</Text>
                    </HStack>
                    <List spacing={2} mt={2}>
                      {selectedJob.requirements.map((req, idx) => (
                        <ListItem key={idx}>
                          <HStack alignItems="flex-start">
                            <ListIcon as={FaCheck} color={accentColor} mt={1} />
                            <Text color={textColor}>{req}</Text>
                          </HStack>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  <Box>
                    <HStack mb={2}>
                      <Icon as={FaRegCalendarAlt} color={accentColor} />
                      <Text fontWeight="bold">Responsibilities</Text>
                    </HStack>
                    <List spacing={2} mt={2}>
                      {selectedJob.responsibilities.map((resp, idx) => (
                        <ListItem key={idx}>
                          <HStack alignItems="flex-start">
                            <ListIcon as={FaCheck} color={accentColor} mt={1} />
                            <Text color={textColor}>{resp}</Text>
                          </HStack>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </VStack>
              </ModalBody>
              <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
                <Button colorScheme="teal" mr={3}>
                  Apply Now
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CareerPage;