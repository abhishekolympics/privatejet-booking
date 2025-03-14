// src/components/partners/ExpandablePartnerCard.jsx
import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Collapse,
  VStack,
  HStack,
  Badge,
  Image,
  Link,
  Icon,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { FaBriefcase, FaHandshake, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import PartnerContactModal from './PartnerContactModal';

const ExpandablePartnerCard = ({ partner }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);
  
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('white', 'gray.800');
  const expandedBgColor = useColorModeValue('gray.50', 'gray.700');
  
  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      borderColor={borderColor}
      overflow="hidden" 
      bg={bgColor}
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
      mb={6}
    >
      {/* Partner Header - Always Visible */}
      <Box p={5}>
        <HStack spacing={4} align="flex-start">
          {partner.logo ? (
            <Image 
              src={partner.logo} 
              alt={`${partner.name} logo`}
              boxSize="80px"
              objectFit="contain"
              borderRadius="md"
              bg="white"
              p={2}
              borderWidth="1px"
              borderColor="gray.200"
            />
          ) : (
            <Box 
              boxSize="80px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="brand.50"
              color="brand.500"
              borderRadius="md"
            >
              <Icon as={FaBriefcase} boxSize={10} />
            </Box>
          )}
          
          <VStack align="flex-start" spacing={1} flex="1">
            <Heading size="md">{partner.name}</Heading>
            <HStack>
              {partner.partnerType && (
                <Badge colorScheme="brand">{partner.partnerType}</Badge>
              )}
              {partner.location && (
                <HStack spacing={1} color="gray.600" fontSize="sm">
                  <Icon as={FaMapMarkerAlt} />
                  <Text>{partner.location}</Text>
                </HStack>
              )}
            </HStack>
            <Text mt={2} noOfLines={isExpanded ? undefined : 2}>
              {partner.shortDescription}
            </Text>
          </VStack>
        </HStack>
        
        <Button
          onClick={toggleExpand}
          mt={4}
          size="sm"
          rightIcon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          variant="outline"
          colorScheme="brand"
          width={{ base: "full", md: "auto" }}
        >
          {isExpanded ? "Show Less" : "Learn More"}
        </Button>
      </Box>
      
      {/* Expandable Content */}
      <Collapse in={isExpanded} animateOpacity>
        <Divider />
        <Box p={5} bg={expandedBgColor}>
          <VStack spacing={4} align="stretch">
            {/* Full Description */}
            {partner.fullDescription && (
              <Box>
                <Heading size="sm" mb={2}>About {partner.name}</Heading>
                <Text>{partner.fullDescription}</Text>
              </Box>
            )}
            
            {/* Services */}
            {partner.services && partner.services.length > 0 && (
              <Box>
                <Heading size="sm" mb={2}>Services</Heading>
                <HStack spacing={2} flexWrap="wrap">
                  {partner.services.map((service, index) => (
                    <Badge key={index} colorScheme="green" m={1}>
                      {service}
                    </Badge>
                  ))}
                </HStack>
              </Box>
            )}
            
            {/* Aircraft Fleet */}
            {partner.fleet && partner.fleet.length > 0 && (
              <Box>
                <Heading size="sm" mb={2}>Aircraft Fleet</Heading>
                <HStack spacing={2} flexWrap="wrap">
                  {partner.fleet.map((aircraft, index) => (
                    <Badge key={index} colorScheme="blue" m={1}>
                      {aircraft}
                    </Badge>
                  ))}
                </HStack>
              </Box>
            )}
            
            {/* Key Features */}
            {partner.features && partner.features.length > 0 && (
              <Box>
                <Heading size="sm" mb={2}>Key Features</Heading>
                <VStack align="flex-start" spacing={1}>
                  {partner.features.map((feature, index) => (
                    <HStack key={index} spacing={2}>
                      <Icon as={FaCheckCircle} color="green.500" />
                      <Text>{feature}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            )}
            
            {/* Contact */}
            {(partner.website || partner.email || partner.phone) && (
              <Box>
                <Heading size="sm" mb={2}>Contact Information</Heading>
                <VStack align="flex-start" spacing={1}>
                  {partner.phone && (
                    <HStack>
                      <Text fontWeight="medium">Phone:</Text>
                      <Text>{partner.phone}</Text>
                    </HStack>
                  )}
                  {partner.email && (
                    <HStack>
                      <Text fontWeight="medium">Email:</Text>
                      <Link href={`mailto:${partner.email}`} color="brand.500">
                        {partner.email}
                      </Link>
                    </HStack>
                  )}
                  {partner.website && (
                    <HStack>
                      <Text fontWeight="medium">Website:</Text>
                      <Link href={partner.website} isExternal color="brand.500">
                        {partner.website.replace(/^https?:\/\/(www\.)?/, '')}
                        <ExternalLinkIcon mx="2px" />
                      </Link>
                    </HStack>
                  )}
                </VStack>
              </Box>
            )}
            
            {/* Action Buttons */}
            <HStack spacing={4} pt={2}>
              {partner.website && (
                <Button 
                  as="a"
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftIcon={<ExternalLinkIcon />}
                  colorScheme="brand"
                  size="md"
                >
                  Visit Website
                </Button>
              )}
              
              <Button
                onClick={openContactModal}
                leftIcon={<FaHandshake />}
                variant="outline"
                colorScheme="brand"
                size="md"
              >
                Contact Partner
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Collapse>
      
      {/* Contact Modal */}
      <PartnerContactModal 
        isOpen={isContactModalOpen}
        onClose={closeContactModal}
        partner={partner}
      />
    </Box>
  );
};

export default ExpandablePartnerCard;