// components/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Tab, 
  TabList, 
  TabPanel, 
  TabPanels, 
  Tabs,
  useToast,
  Spinner,
  Flex,
  Text
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getUserBookings } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';
import Dashboard from '../dashboard/Dashboard';
import UserProfile from '../dashboard/UserProfile';
import BookingHistory from '../dashboard/BookingHistory';

const DashboardPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  
  // Fetch user bookings
  const { 
    data: bookings, 
    isLoading: bookingsLoading, 
    error 
  } = useQuery('userBookings', getUserBookings, {
    enabled: isAuthenticated,
    onError: (err) => {
      toast({
        title: 'Error',
        description: err.message || 'Failed to load your bookings',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/dashboard' } } });
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  // Handle tab changes
  const handleTabChange = (index) => {
    setTabIndex(index);
  };
  
  // Show loading state
  if (authLoading || bookingsLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="50vh">
        <Spinner size="xl" color="brand.500" thickness="4px" />
        <Text ml={4} fontSize="lg">Loading your dashboard...</Text>
      </Flex>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <Container maxW="container.xl" py={10}>
        <Flex direction="column" alignItems="center">
          <Text fontSize="lg" color="red.500">
            {error.message || 'There was an error loading your dashboard.'}
          </Text>
        </Flex>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.xl" py={10}>
      <Tabs 
        variant="enclosed" 
        colorScheme="brand" 
        index={tabIndex} 
        onChange={handleTabChange}
        bg="white" 
        boxShadow="base" 
        borderRadius="lg"
        mb={4}
      >
        <TabList>
          <Tab>Dashboard</Tab>
          <Tab>My Bookings</Tab>
          <Tab>Profile</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel p={6}>
            <Dashboard bookings={bookings || []} />
          </TabPanel>
          
          <TabPanel p={6}>
            <BookingHistory bookings={bookings || []} />
          </TabPanel>
          
          <TabPanel p={6}>
            <UserProfile />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default DashboardPage;