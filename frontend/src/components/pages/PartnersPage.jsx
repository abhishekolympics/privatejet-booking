// src/components/pages/PartnersPage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Flex,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import ExpandablePartnerCard from "../partners/ExpandablePartnerCard";
// import { fetchPartners } from '../../utils/api'; // Assuming you'll add this API call

const PartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [partnerTypeFilter, setPartnerTypeFilter] = useState("");
  const toast = useToast();

  useEffect(() => {
    const loadPartners = async () => {
      try {
        setIsLoading(true);
        // This would typically be an API call to your backend
        // For this example, we'll use mock data instead
        // const data = await fetchPartners();
        const data = getMockPartners();
        setPartners(data);
        setFilteredPartners(data);
      } catch (error) {
        console.error("Error loading partners:", error);
        toast({
          title: "Error loading partners",
          description:
            "There was an error loading the partner data. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPartners();
  }, [toast]);

  // Filter partners based on search term and type filter
  useEffect(() => {
    let results = partners;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (partner) =>
          partner.name.toLowerCase().includes(term) ||
          partner.shortDescription.toLowerCase().includes(term) ||
          (partner.fullDescription &&
            partner.fullDescription.toLowerCase().includes(term))
      );
    }

    if (partnerTypeFilter) {
      results = results.filter(
        (partner) => partner.partnerType === partnerTypeFilter
      );
    }

    setFilteredPartners(results);
  }, [searchTerm, partnerTypeFilter, partners]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setPartnerTypeFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPartnerTypeFilter("");
  };

  // Get unique partner types for the filter dropdown
  const partnerTypes = [
    ...new Set(partners.map((partner) => partner.partnerType)),
  ].filter(Boolean);

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        {/* Page Header */}
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Our Upcoming Partners
          </Heading>
          <Text fontSize="xl" maxW="3xl" mx="auto" color="gray.600">
            We work with the best in the aviation industry to provide you with
            exceptional private jet services. Explore our network of upcoming
            trusted partners.
          </Text>
        </Box>

        {/* Search and Filter */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={4}
          bg="white"
          p={5}
          borderRadius="lg"
          boxShadow="md"
        >
          <InputGroup flex={1}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search partners..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>

          <Select
            placeholder="Filter by type"
            maxW={{ base: "full", md: "200px" }}
            value={partnerTypeFilter}
            onChange={handleFilterChange}
          >
            {partnerTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>

          <Button
            variant="outline"
            onClick={clearFilters}
            isDisabled={!searchTerm && !partnerTypeFilter}
          >
            Clear Filters
          </Button>
        </Flex>

        {/* Partners List */}
        {isLoading ? (
          <Flex justify="center" py={10}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
          </Flex>
        ) : filteredPartners.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Text fontSize="lg">No partners found matching your criteria.</Text>
            <Button mt={4} onClick={clearFilters} colorScheme="brand">
              Clear Filters
            </Button>
          </Box>
        ) : (
          <VStack spacing={6} align="stretch">
            <Text fontSize="md" color="gray.600">
              Showing {filteredPartners.length} of {partners.length} partners
            </Text>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              {filteredPartners.map((partner) => (
                <ExpandablePartnerCard key={partner.id} partner={partner} />
              ))}
            </SimpleGrid>
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

// Mock data function (for demonstration purposes)
const getMockPartners = () => {
  return [
    // {
    //   id: 1,
    //   name: "Air Independence",
    //   partnerType: "Aircraft Operator",
    //   location: "Munich, Germany",
    //   logo: "https://airindependence.com/wp-content/uploads/2021/09/logo-airindependence-retina.svg",
    //   shortDescription:
    //     "Air Independence is a premier aircraft operator offering exceptional private jet charter services across Europe and beyond.",
    //   fullDescription:
    //     "Founded in 2001, Air Independence has become one of the leading private jet charter companies in Europe. With a focus on safety, reliability, and personalized service, we offer a wide range of aircraft for charter, aircraft management, and acquisition services. Our team of experienced professionals is dedicated to exceeding client expectations on every flight.",
    //   services: [
    //     "Charter Flights",
    //     "Aircraft Management",
    //     "Aircraft Acquisition",
    //     "Concierge Services",
    //   ],
    //   fleet: [
    //     "Challenger 604",
    //     "Citation XLS+",
    //     "Learjet 45",
    //     "Gulfstream G550",
    //   ],
    //   features: [
    //     "24/7 availability",
    //     "Luxury catering options",
    //     "Pet-friendly flights",
    //     "Ground transportation coordination",
    //   ],
    //   website: "https://www.airindependence.com",
    //   email: "info@airindependence.com",
    //   phone: "+49 89 89679 2000",
    //   contactUrl: "/contact?partner=air-independence",
    // },
    // {
    //   id: 2,
    //   name: "Jet Story",
    //   partnerType: "Aircraft Operator",
    //   location: "Warsaw, Poland",
    //   logo: "https://jetstory.com/templates/jetstory/build/gfx/logo.svg",
    //   shortDescription:
    //     "Jet Story specializes in aircraft management and charter services, offering a diverse fleet of modern private jets for charter across Europe and around the world.",
    //   fullDescription:
    //     "Jet Story is a Polish business aviation company with over 15 years of experience in the market. We specialize in aircraft management, private charter, and aircraft sales services. Our fleet consists of modern jets that meet the highest safety and comfort standards. Jet Story is certified by the Polish Civil Aviation Authority and holds an Air Operator Certificate (AOC).",
    //   services: [
    //     "Charter Flights",
    //     "Aircraft Management",
    //     "Aircraft Sales",
    //     "Maintenance",
    //   ],
    //   fleet: [
    //     "Embraer Legacy 600",
    //     "Embraer Legacy 650",
    //     "Cessna Citation Latitude",
    //   ],
    //   features: [
    //     "Multilingual crew",
    //     "Custom interior configurations",
    //     "VIP catering",
    //     "Fast track immigration services",
    //   ],
    //   website: "https://www.jetstory.com",
    //   email: "charter@jetstory.com",
    //   phone: "+48 22 358 77 14",
    //   contactUrl: "/contact?partner=jet-story",
    // },
    // {
    //   id: 3,
    //   name: "Universal Aviation",
    //   partnerType: "FBO Services",
    //   location: "Houston, USA",
    //   logo: "https://www.universalaviation.aero/wp-content/uploads/2024/10/universal-aviation-fbo-ground-services-network-from-universal-weather-and-aviation.svg",
    //   shortDescription:
    //     "Universal Aviation is a global network of FBOs providing ground handling services to business aircraft operators at airports worldwide.",
    //   fullDescription:
    //     "Universal Aviation is the ground support division of Universal Weather and Aviation, Inc. With more than 50 locations in over 20 countries, we're one of the world's largest networks of ground handlers servicing business and private aviation. Our mission is to create great experiences for our customers at every location we operate, ensuring safe, legal, and hassle-free trips.",
    //   services: [
    //     "Ground Handling",
    //     "Customs & Immigration",
    //     "Fueling Services",
    //     "Concierge",
    //   ],
    //   features: [
    //     "Global network of locations",
    //     "Standardized safety protocols",
    //     "Digital ground services platform",
    //     "Complete trip management",
    //   ],
    //   website: "https://www.universalaviation.aero",
    //   email: "sales@universalaviation.aero",
    //   phone: "+1 713 944 1622",
    //   contactUrl: "/contact?partner=universal-aviation",
    // },
    // {
    //   id: 4,
    //   name: "Jet Aviation",
    //   partnerType: "FBO Services",
    //   location: "Basel, Switzerland",
    //   logo: "https://www.jetaviation.com/wp-content/uploads/2024/01/logo-big.svg",
    //   shortDescription:
    //     "Jet Aviation offers comprehensive FBO services, aircraft maintenance, completions, refurbishment, and charter services worldwide.",
    //   fullDescription:
    //     "Jet Aviation, a wholly owned subsidiary of General Dynamics, was founded in Switzerland in 1967 and is one of the leading business aviation services companies in the world. We provide maintenance, completions and refurbishment, FBO, aircraft management, charter services, and staffing. Our 4,000+ employees cater to client needs from more than 50 facilities worldwide.",
    //   services: [
    //     "Aircraft Maintenance",
    //     "FBO Services",
    //     "Aircraft Management",
    //     "Charter",
    //   ],
    //   features: [
    //     "State-of-the-art facilities",
    //     "Experienced maintenance technicians",
    //     "Luxury passenger lounges",
    //     "Comprehensive aircraft support",
    //   ],
    //   website: "https://www.jetaviation.com",
    //   email: "info@jetaviation.com",
    //   phone: "+41 58 158 4111",
    //   contactUrl: "/contact?partner=jet-aviation",
    // },
    {
      id: 5,
      name: "Aviapages",
      partnerType: "Technology Provider",
      location: "Dubai, UAE",
      logo: "https://aviapages.com/static/app/images/v6/header_logo.svg",
      shortDescription:
        "Aviapages is a marketplace for private aviation professionals, connecting operators, brokers, FBOs, MROs and other companies with private aviation customers and suppliers.",
      fullDescription:
        "Aviapages provides a comprehensive suite of digital tools and services designed specifically for private aviation businesses. Our platform connects charter operators, brokers, FBOs, MROs, and other service providers with customers looking for private aviation services. We offer solutions for flight scheduling, charter quoting, empty leg management, and more.",
      services: [
        "Flight Time Calculator",
        "Charter Search",
        "Quote Management",
        "Aircraft Directory",
      ],
      features: [
        "Real-time availability and pricing",
        "Integrated payment processing",
        "Comprehensive flight planning",
        "Advanced reporting tools",
      ],
      website: "https://aviapages.com",
      email: "support@aviapages.com",
      contactUrl: "/contact?partner=aviapages",
    },
    // {
    //   id: 6,
    //   name: "Duncan Aviation",
    //   partnerType: "MRO Provider",
    //   location: "Lincoln, USA",
    //   logo: "https://md.aviapages.com/media/2022/12/26/duncan-aviation-inc.jpg",
    //   shortDescription:
    //     "Duncan Aviation is a premier MRO provider offering comprehensive maintenance, repair, and overhaul services for business aircraft.",
    //   fullDescription:
    //     "Duncan Aviation is the largest family-owned MRO facility in the world and a recognized leader in the business aviation industry. We provide complete maintenance services for business aircraft, including airframe, engine, avionics, paint, interior, parts support, and more. With over 2,300 team members at locations across the United States, we deliver high-quality, efficient service.",
    //   services: [
    //     "Airframe Maintenance",
    //     "Engine Overhaul",
    //     "Avionics Installation",
    //     "Interior Refurbishment",
    //   ],
    //   features: [
    //     "Factory-trained technicians",
    //     "In-house engineering and certification",
    //     "24/7 AOG support",
    //     "Industry-leading warranty",
    //   ],
    //   website: "https://www.duncanaviation.aero",
    //   email: "info@duncanaviation.com",
    //   phone: "+1 402 475 2611",
    //   contactUrl: "/contact?partner=duncan-aviation",
    // },
  ];
};

export default PartnersPage;
