// 2. frontend/src/components/ui/LoadingSpinner.jsx
import React from 'react';
import { Flex, Spinner, Text } from '@chakra-ui/react';

const LoadingSpinner = ({ text = 'Loading...', size = 'xl', thickness = '4px' }) => {
  return (
    <Flex direction="column" justify="center" align="center" minH="200px">
      <Spinner 
        size={size} 
        thickness={thickness} 
        color="brand.500" 
        emptyColor="gray.200"
        speed="0.65s"
      />
      {text && <Text mt={4} fontSize="lg" color="gray.600">{text}</Text>}
    </Flex>
  );
};

export default LoadingSpinner;