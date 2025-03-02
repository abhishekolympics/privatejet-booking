// src/components/routing/PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner, Flex, Text } from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';

/**
 * PrivateRoute component for protecting routes that require authentication
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="50vh">
        <Spinner size="xl" color="brand.500" thickness="4px" />
        <Text ml={4} fontSize="lg">Loading...</Text>
      </Flex>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If authenticated, render the children
  return children;
};

export default PrivateRoute;