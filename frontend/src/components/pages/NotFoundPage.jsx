// src/components/pages/NotFoundPage.jsx
import React from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  Icon 
} from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={8} textAlign="center">
        <Icon 
          as={FaExclamationTriangle} 
          boxSize={16} 
          color="yellow.500" 
        />
        
        <Heading as="h1" size="2xl">
          404 - Page Not Found
        </Heading>
        
        <Text fontSize="xl" color="gray.600">
          Oops! The page you are looking for doesn't exist or has been moved.
        </Text>
        
        <Box pt={6}>
          <Button 
            as={Link} 
            to="/" 
            colorScheme="brand" 
            size="lg"
          >
            Return to Home
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default NotFoundPage;