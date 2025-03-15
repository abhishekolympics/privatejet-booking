// components/emptylegs/EmptyLegBookingModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  Divider,
  Box,
  Flex,
  Badge,
  SimpleGrid,
  Heading,
  FormErrorMessage,
  useToast
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';

const EmptyLegBookingModal = ({ isOpen, onClose, emptyLeg, onSubmit }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const toast = useToast();
  
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      passengers: 1,
      specialRequests: ''
    }
  });
  
  // Watch passengers field to update total price
  const passengers = watch('passengers', 1);
  
  // Update passenger count for price calculations
  useEffect(() => {
    setPassengerCount(Number(passengers) || 1);
  }, [passengers]);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format time for display
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };
  
  // Formats price with commas and currency symbol
  const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency || 'USD',
      maximumFractionDigits: 0 
    }).format(price);
  };
  
  // Calculate total price
  const calculateTotalPrice = () => {
    return emptyLeg.price * passengerCount;
  };
  
  const handleFormSubmit = (data) => {
    setIsSubmitting(true);
    
    try {
      // Calculate total price
      const totalPrice = emptyLeg.price * data.passengers;
      
      // Prepare booking data
      const bookingData = {
        ...data,
        passengers: Number(data.passengers),
        totalPrice,
        currency: emptyLeg.currency
      };
      
      // Send to parent component
      onSubmit(bookingData);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your booking. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If no empty leg data, don't render the modal content
  if (!emptyLeg) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Book Empty Leg Flight</ModalHeader>
        <ModalCloseButton />
        
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ModalBody>
            <VStack spacing={6} align="stretch">
              {/* Flight Details Summary */}
              <Box bg="gray.50" p={4} borderRadius="md">
                <Heading size="sm" mb={3}>Flight Details</Heading>
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text color="gray.600" fontSize="sm">Departure</Text>
                    <Text fontWeight="bold">{emptyLeg.departureAirport.code}</Text>
                    <Text>{emptyLeg.departureAirport.city}, {emptyLeg.departureAirport.country}</Text>
                  </Box>
                  <Box>
                    <Text color="gray.600" fontSize="sm">Arrival</Text>
                    <Text fontWeight="bold">{emptyLeg.arrivalAirport.code}</Text>
                    <Text>{emptyLeg.arrivalAirport.city}, {emptyLeg.arrivalAirport.country}</Text>
                  </Box>
                </SimpleGrid>
                
                <Divider my={3} />
                
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text color="gray.600" fontSize="sm">Date & Time</Text>
                    <Text fontWeight="bold">{formatDate(emptyLeg.departureDateTime)}</Text>
                    <Text>{formatTime(emptyLeg.departureDateTime)}</Text>
                  </Box>
                  <Box>
                    <Text color="gray.600" fontSize="sm">Aircraft</Text>
                    <Text fontWeight="bold">{emptyLeg.aircraft.type}</Text>
                    <Text>Max {emptyLeg.aircraft.capacity} passengers</Text>
                  </Box>
                </SimpleGrid>
                
                <Divider my={3} />
                
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text color="gray.600" fontSize="sm">Price per passenger</Text>
                    <Text fontWeight="bold" fontSize="xl" color="brand.500">
                      {formatPrice(emptyLeg.price, emptyLeg.currency)}
                    </Text>
                  </Box>
                  <Badge colorScheme="red" p={2} fontSize="md">
                    Save {emptyLeg.savingsPercentage}%
                  </Badge>
                </Flex>
              </Box>
              
              <Divider />
              
              {/* Passenger Details Form */}
              <Heading size="sm" mb={3}>Contact Information</Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired isInvalid={errors.firstName}>
                  <FormLabel>First Name</FormLabel>
                  <Input 
                    {...register('firstName', { required: 'First name is required' })}
                  />
                  <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
                </FormControl>
                
                <FormControl isRequired isInvalid={errors.lastName}>
                  <FormLabel>Last Name</FormLabel>
                  <Input 
                    {...register('lastName', { required: 'Last name is required' })}
                  />
                  <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>
                
                <FormControl isInvalid={errors.phone}>
                  <FormLabel>Phone</FormLabel>
                  <Input 
                    {...register('phone', {
                      pattern: {
                        value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                        message: 'Invalid phone number'
                      }
                    })}
                    placeholder="e.g. +1 (123) 456-7890"
                  />
                  <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>
              
              <Divider />
              
              {/* Booking Details */}
              <Heading size="sm" mb={3}>Booking Details</Heading>
              
              <FormControl isInvalid={errors.passengers}>
                <FormLabel>Number of Passengers</FormLabel>
                <Input 
                  type="number"
                  min={1}
                  max={emptyLeg.aircraft.capacity}
                  {...register('passengers', {
                    required: 'Number of passengers is required',
                    min: {
                      value: 1,
                      message: 'Minimum 1 passenger required'
                    },
                    max: {
                      value: emptyLeg.aircraft.capacity,
                      message: `Maximum ${emptyLeg.aircraft.capacity} passengers allowed`
                    },
                    valueAsNumber: true
                  })}
                />
                <FormErrorMessage>{errors.passengers?.message}</FormErrorMessage>
              </FormControl>
              
              <FormControl>
                <FormLabel>Special Requests (Optional)</FormLabel>
                <Input 
                  as="textarea"
                  rows={3}
                  {...register('specialRequests')}
                  placeholder="Any special requirements or requests"
                />
              </FormControl>
              
              <Divider />
              
              {/* Price Summary */}
              <Box bg="gray.50" p={4} borderRadius="md">
                <Heading size="sm" mb={3}>Price Summary</Heading>
                
                <Flex justify="space-between" mb={2}>
                  <Text>Base Price ({formatPrice(emptyLeg.price, emptyLeg.currency)} x {passengerCount} passenger{passengerCount > 1 ? 's' : ''})</Text>
                  <Text>{formatPrice(emptyLeg.price * passengerCount, emptyLeg.currency)}</Text>
                </Flex>
                
                <Flex justify="space-between" mb={2}>
                  <Text>Taxes & Fees</Text>
                  <Text>Included</Text>
                </Flex>
                
                <Divider my={2} />
                
                <Flex justify="space-between" fontWeight="bold">
                  <Text>Total</Text>
                  <Text color="brand.500">{formatPrice(calculateTotalPrice(), emptyLeg.currency)}</Text>
                </Flex>
              </Box>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="brand" 
              type="submit"
              isLoading={isSubmitting}
              loadingText="Processing"
            >
              Confirm Booking
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EmptyLegBookingModal;