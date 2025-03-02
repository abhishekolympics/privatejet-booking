// components/dashboard/Dashboard.jsx
import React from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Divider
} from '@chakra-ui/react';
import { FaPlane, FaCalendarAlt, FaUserCheck, FaCreditCard } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import BookingHistory from './BookingHistory';

const Dashboard = ({ bookings = [] }) => {
  const { user } = useAuth();
  
  // Calculate statistics
  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'confirmed' && 
    new Date(booking.flightDetails.legs[0].departureDateTime) > new Date()
  ).length;
  
  const completedBookings = bookings.filter(booking => 
    booking.status === 'completed'
  ).length;
  
  const totalSpent = bookings.reduce((sum, booking) => 
    sum + (booking.price?.amount || 0), 0
  );
  
  return (
    <Box>
      <Flex mb={6} direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }}>
        <Box>
          <Heading size="lg" mb={1}>Dashboard</Heading>
          <Text color="gray.600">Welcome back, {user?.firstName || 'User'}</Text>
        </Box>
      </Flex>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard 
          label="Total Bookings" 
          value={totalBookings} 
          helpText="All-time bookings"
          icon={FaPlane}
          iconBg="brand.500"
        />
        <StatCard 
          label="Upcoming Flights" 
          value={upcomingBookings} 
          helpText="Confirmed bookings"
          icon={FaCalendarAlt}
          iconBg="green.500"
        />
        <StatCard 
          label="Completed Flights" 
          value={completedBookings} 
          helpText="Past journeys"
          icon={FaUserCheck}
          iconBg="purple.500"
        />
        <StatCard 
          label="Total Spent" 
          value={`$${totalSpent.toLocaleString()}`} 
          helpText="USD"
          icon={FaCreditCard}
          iconBg="orange.500"
        />
      </SimpleGrid>

      <Divider mb={8} />

      {/* Booking History */}
      <BookingHistory bookings={bookings} />
    </Box>
  );
};

const StatCard = ({ label, value, helpText, icon, iconBg }) => {
  return (
    <Stat
      px={4}
      py={5}
      bg="white"
      shadow="base"
      rounded="lg"
      borderWidth="1px"
    >
      <Flex justifyContent="space-between">
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight="medium" isTruncated>
            {label}
          </StatLabel>
          <StatNumber fontSize="2xl" fontWeight="bold">
            {value}
          </StatNumber>
          <StatHelpText>{helpText}</StatHelpText>
        </Box>
        <Box
          my="auto"
          color="white"
          alignContent="center"
          rounded="full"
          p={2}
          bg={iconBg}
        >
          <Icon as={icon} boxSize={6} />
        </Box>
      </Flex>
    </Stat>
  );
};

export default Dashboard;