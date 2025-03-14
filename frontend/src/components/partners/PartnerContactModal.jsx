// src/components/partners/PartnerContactModal.jsx
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
  Textarea,
  VStack,
  HStack,
  Text,
  Alert,
  AlertIcon,
  FormErrorMessage,
  useToast
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { contactPartner } from '../../utils/api';

const PartnerContactModal = ({ isOpen, onClose, partner }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm();
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      await contactPartner(partner.id, {
        ...data,
        partnerName: partner.name
      });
      
      toast({
        title: 'Message Sent',
        description: `Your message has been sent to ${partner.name}. They will contact you shortly.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      
      reset();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error sending your message. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
         position: 'top-right'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Contact {partner?.name}</ModalHeader>
        <ModalCloseButton />
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Text>Send a message to {partner?.name} for inquiries or partnership opportunities.</Text>
              </Alert>
              
              <FormControl isRequired isInvalid={errors.name}>
                <FormLabel>Your Name</FormLabel>
                <Input 
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Enter your full name"
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>
              
              <HStack spacing={4} w="100%">
                <FormControl isRequired isInvalid={errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    placeholder="your@email.com"
                  />
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>
                
                <FormControl isInvalid={errors.phone}>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <Input 
                    {...register('phone')}
                    placeholder="Your phone number"
                  />
                  <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
                </FormControl>
              </HStack>
              
              <FormControl isRequired isInvalid={errors.subject}>
                <FormLabel>Subject</FormLabel>
                <Input 
                  {...register('subject', { required: 'Subject is required' })}
                  placeholder="What is your inquiry about?"
                />
                <FormErrorMessage>{errors.subject?.message}</FormErrorMessage>
              </FormControl>
              
              <FormControl isRequired isInvalid={errors.message}>
                <FormLabel>Message</FormLabel>
                <Textarea 
                  {...register('message', { 
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters'
                    }
                  })}
                  placeholder="Enter your message..."
                  rows={5}
                />
                <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
              </FormControl>
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
              loadingText="Sending"
            >
              Send Message
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default PartnerContactModal;