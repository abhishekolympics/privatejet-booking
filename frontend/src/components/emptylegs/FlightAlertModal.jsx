// components/emptylegs/FlightAlertModal.jsx
import React, { useState } from 'react';
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
  Text,
  Divider,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Select,
  HStack,
  useToast
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';

const FlightAlertModal = ({ isOpen, onClose, onSubmit, currentDeparture = '', currentArrival = '' }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  
  // Get today's date and one month ahead for default date range
  const today = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  
  // Format dates for the date input
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    defaultValues: {
      departure: currentDeparture,
      arrival: currentArrival,
      dateFrom: formatDateForInput(today),
      dateTo: formatDateForInput(oneMonthLater),
      email: user?.email || '',
      notificationType: 'email'
    }
  });
  
  const handleFormSubmit = (data) => {
    setIsSubmitting(true);
    
    try {
      onSubmit(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error setting up your alert. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Set Up Flight Alerts</ModalHeader>
        <ModalCloseButton />
        
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Text>
                  Get notified when empty leg flights become available for your preferred routes and dates.
                </Text>
              </Alert>
              
              <FormControl isRequired isInvalid={errors.departure}>
                <FormLabel>Departure Location</FormLabel>
                <Input 
                  placeholder="City or airport code"
                  {...register('departure', { required: 'Departure location is required' })}
                />
                <FormErrorMessage>{errors.departure?.message}</FormErrorMessage>
              </FormControl>
              
              <FormControl isRequired isInvalid={errors.arrival}>
                <FormLabel>Arrival Location</FormLabel>
                <Input 
                  placeholder="City or airport code"
                  {...register('arrival', { required: 'Arrival location is required' })}
                />
                <FormErrorMessage>{errors.arrival?.message}</FormErrorMessage>
              </FormControl>
              
              <HStack spacing={4}>
                <FormControl isRequired isInvalid={errors.dateFrom}>
                  <FormLabel>Date From</FormLabel>
                  <Input 
                    type="date"
                    {...register('dateFrom', { required: 'Start date is required' })}
                  />
                  <FormErrorMessage>{errors.dateFrom?.message}</FormErrorMessage>
                </FormControl>
                
                <FormControl isRequired isInvalid={errors.dateTo}>
                  <FormLabel>Date To</FormLabel>
                  <Input 
                    type="date"
                    {...register('dateTo', { required: 'End date is required' })}
                  />
                  <FormErrorMessage>{errors.dateTo?.message}</FormErrorMessage>
                </FormControl>
              </HStack>
              
              <Divider />
              
              <FormControl isRequired isInvalid={errors.email}>
                <FormLabel>Email for Notifications</FormLabel>
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
              
              <FormControl>
                <FormLabel>Notification Preferences</FormLabel>
                <Select {...register('notificationType')}>
                  <option value="email">Email Only</option>
                  <option value="sms">SMS Only</option>
                  <option value="both">Email & SMS</option>
                </Select>
              </FormControl>
              
              {/* Show phone input if SMS notification is selected */}
              {['sms', 'both'].includes(register('notificationType').value) && (
                <FormControl isRequired={register('notificationType').value !== 'email'} isInvalid={errors.phone}>
                  <FormLabel>Phone Number</FormLabel>
                  <Input 
                    placeholder="e.g. +1 (123) 456-7890"
                    {...register('phone', {
                      required: register('notificationType').value !== 'email' ? 'Phone number is required for SMS notifications' : false,
                      pattern: {
                        value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                        message: 'Invalid phone number'
                      }
                    })}
                  />
                  <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
                </FormControl>
              )}
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
              loadingText="Setting Up"
            >
              Create Alert
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default FlightAlertModal;