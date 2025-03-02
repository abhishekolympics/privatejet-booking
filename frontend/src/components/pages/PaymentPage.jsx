// src/components/pages/PaymentPage.jsx

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  FormControl, 
  FormLabel, 
  Input, 
  Select, 
  Button, 
  VStack, 
  HStack, 
  Text, 
  Divider, 
  useToast,
  SimpleGrid
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import { createBooking } from '../../utils/api';

const PaymentPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { bookingDetails, selectedAircraft, charteredPrice, setBookingConfirmation, formatPrice } = useBooking();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  useEffect(() => {
    // Redirect if necessary data is missing
    if (!bookingDetails || !selectedAircraft || !charteredPrice) {
      navigate('/booking');
    }
  }, [bookingDetails, selectedAircraft, charteredPrice, navigate]);
  
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Combine all data for booking
      const bookingData = {
        flightDetails: bookingDetails,
        aircraft: selectedAircraft,
        price: charteredPrice,
        contactInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          company: data.company
        },
        paymentInfo: {
          cardNumber: data.cardNumber,
          expiryDate: data.expiryMonth + '/' + data.expiryYear,
          cvv: data.cvv,
          nameOnCard: data.nameOnCard,
          billingAddress: data.billingAddress
        }
      };
      
      // Call API to create booking
      const response = await createBooking(bookingData);
      
      // Update booking confirmation
      setBookingConfirmation(response);
      
      // Show success message
      toast({
        title: 'Booking Successful',
        description: 'Your private jet has been booked successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Booking error', error);
      toast({
        title: 'Booking Error',
        description: error.message || 'There was an error processing your booking. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!bookingDetails || !selectedAircraft || !charteredPrice) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Container maxW="container.xl" py={10}>
      <Heading as="h1" size="xl" mb={6}>Payment Information</Heading>
      
      <Box 
        as="form" 
        onSubmit={handleSubmit(onSubmit)}
        bg="white"
        borderRadius="lg"
        boxShadow="md"
        p={6}
      >
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="md" mb={4}>Contact Information</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isRequired isInvalid={errors.firstName}>
                <FormLabel>First Name</FormLabel>
                <Input 
                  {...register('firstName', { required: 'First name is required' })}
                />
              </FormControl>
              
              <FormControl isRequired isInvalid={errors.lastName}>
                <FormLabel>Last Name</FormLabel>
                <Input 
                  {...register('lastName', { required: 'Last name is required' })}
                />
              </FormControl>
              
              <FormControl isRequired isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <Input 
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </FormControl>
              
              <FormControl isRequired isInvalid={errors.phone}>
                <FormLabel>Phone</FormLabel>
                <Input 
                  {...register('phone', { required: 'Phone is required' })}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Company (Optional)</FormLabel>
                <Input 
                  {...register('company')}
                />
              </FormControl>
            </SimpleGrid>
          </Box>
          
          <Divider />
          
          <Box>
            <Heading size="md" mb={4}>Payment Method</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isRequired isInvalid={errors.cardNumber}>
                <FormLabel>Card Number</FormLabel>
                <Input 
                  {...register('cardNumber', { 
                    required: 'Card number is required',
                    pattern: {
                      value: /^[0-9]{16}$/,
                      message: 'Invalid card number'
                    }
                  })}
                  placeholder="XXXX XXXX XXXX XXXX"
                />
              </FormControl>
              
              <FormControl isRequired isInvalid={errors.nameOnCard}>
                <FormLabel>Name on Card</FormLabel>
                <Input 
                  {...register('nameOnCard', { required: 'Name on card is required' })}
                />
              </FormControl>
              
              <HStack>
                <FormControl isRequired isInvalid={errors.expiryMonth}>
                  <FormLabel>Expiry Month</FormLabel>
                  <Select 
                    {...register('expiryMonth', { required: 'Required' })}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month.toString().padStart(2, '0')}>
                        {month.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl isRequired isInvalid={errors.expiryYear}>
                  <FormLabel>Expiry Year</FormLabel>
                  <Select 
                    {...register('expiryYear', { required: 'Required' })}
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                      <option key={year} value={year.toString().slice(-2)}>
                        {year}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl isRequired isInvalid={errors.cvv}>
                  <FormLabel>CVV</FormLabel>
                  <Input 
                    type="password"
                    maxLength={3}
                    {...register('cvv', { 
                      required: 'CVV is required',
                      pattern: {
                        value: /^[0-9]{3}$/,
                        message: 'Invalid CVV'
                      }
                    })}
                  />
                </FormControl>
              </HStack>
              
              <FormControl isRequired isInvalid={errors.billingAddress}>
                <FormLabel>Billing Address</FormLabel>
                <Input 
                  {...register('billingAddress', { required: 'Billing address is required' })}
                />
              </FormControl>
            </SimpleGrid>
          </Box>
          
          <Divider />
          
          <Box>
            <Heading size="md" mb={4}>Booking Summary</Heading>
            <HStack justify="space-between" mb={2}>
              <Text>Selected Aircraft</Text>
              <Text fontWeight="medium">{selectedAircraft.aircraft_type} ({selectedAircraft.registration_number})</Text>
            </HStack>
            <HStack justify="space-between" mb={4}>
              <Text>Total Price</Text>
              <Text fontWeight="bold" fontSize="xl" color="brand.500">
                {formatPrice(charteredPrice.price, charteredPrice.currency_code)}
              </Text>
            </HStack>
          </Box>
          
          <Button
            type="submit"
            size="lg"
            colorScheme="brand"
            variant="luxury"
            isLoading={isSubmitting}
            loadingText="Processing Payment"
          >
            Complete Booking
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default PaymentPage;