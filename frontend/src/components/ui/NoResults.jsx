// 3. frontend/src/components/ui/NoResults.jsx
import React from 'react';
import { Box, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';

const NoResults = ({ 
  title = 'No Results Found', 
  message = 'We couldn\'t find what you\'re looking for.', 
  actionLabel = 'Back to Search',
  actionLink = '/booking',
  icon = SearchIcon
}) => {
  return (
    <Box 
      py={16} 
      px={6} 
      textAlign="center" 
      borderRadius="lg" 
      bg="white" 
      boxShadow="md"
    >
      <VStack spacing={6}>
        <Box 
          display="inline-block"
          p={4}
          bg="brand.50" 
          borderRadius="full"
        >
          <Box
            as={icon}
            color="brand.500"
            boxSize={10}
          />
        </Box>
        
        <Heading as="h2" size="xl">
          {title}
        </Heading>
        
        <Text fontSize="lg" color="gray.600">
          {message}
        </Text>
        
        <Button
          as={Link}
          to={actionLink}
          colorScheme="brand"
          size="lg"
          mt={4}
        >
          {actionLabel}
        </Button>
      </VStack>
    </Box>
  );
};

export default NoResults;