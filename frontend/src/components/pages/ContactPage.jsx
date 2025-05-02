// src/components/pages/ContactPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  HStack,
  Icon,
  Divider,
  useToast,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaUser, 
  FaPaperPlane 
} from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import api from '../../utils/api';

const ContactPage = () => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await api.post('https://privatejet-booking.onrender.com/api/contact', data);
      
      toast({
        title: 'Message Sent',
        description: response.data.message || 'We have received your message and will contact you soon.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      
      // Reset form
      reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'There was an error sending your message. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!subscribeEmail) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address to subscribe.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsSubscribing(true);
    
    try {
      const response = await api.post('https://privatejet-booking.onrender.com/api/contact/subscribe', { email: subscribeEmail });
      
      setSubscribeSuccess(true);
      setSubscribeEmail('');
      
      toast({
        title: 'Subscription Successful',
        description: response.data.message || 'Thank you for subscribing to our newsletter!',
        status: 'success',
        duration: 5000,
        position: 'top-right',
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Subscription Error',
        description: error.response?.data?.message || 'There was an error subscribing. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <Container maxW="container.xl" py={10}>
      {/* Header Section */}
      <Box textAlign="center" mb={16}>
        <Heading as="h1" size="2xl" mb={4}>
          Contact Us
        </Heading>
        <Text fontSize="xl" maxW="xl" mx="auto" color="gray.600">
          Have questions about our services? We're here to help. Get in touch with our team.
        </Text>
      </Box>
      
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
        {/* Contact Info */}
        <Box>
          <VStack align="flex-start" spacing={10}>
            <Box>
              <Heading size="md" mb={6}>Get In Touch</Heading>
              
              <VStack align="flex-start" spacing={6}>
                <HStack spacing={4}>
                  <Icon as={FaMapMarkerAlt} color="brand.500" boxSize={5} />
                  <Box>
                    <Text fontWeight="bold">Address</Text>
                    <Text>123 Aviation Way, Suite 500</Text>
                    <Text>New York, NY 10001</Text>
                  </Box>
                </HStack>
                
                <HStack spacing={4}>
                  <Icon as={FaPhone} color="brand.500" boxSize={5} />
                  <Box>
                    <Text fontWeight="bold">Phone</Text>
                    <Text>+1 (800) 123-4567</Text>
                  </Box>
                </HStack>
                
                <HStack spacing={4}>
                  <Icon as={FaEnvelope} color="brand.500" boxSize={5} />
                  <Box>
                    <Text fontWeight="bold">Email</Text>
                    <Text>info@privatejet.com</Text>
                  </Box>
                </HStack>
              </VStack>
            </Box>
            
            <Divider />
            
            <Box w="full">
              <Heading size="md" mb={6}>Subscribe to Our Newsletter</Heading>
              <form onSubmit={handleSubscribe}>
                {subscribeSuccess && (
                  <Alert status="success" mb={4} borderRadius="md">
                    <AlertIcon />
                    Thank you for subscribing to our newsletter!
                  </Alert>
                )}
                
                <HStack spacing={0}>
                  <InputGroup size="md">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaEnvelope} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={subscribeEmail}
                      onChange={(e) => setSubscribeEmail(e.target.value)}
                      borderRightRadius={0}
                    />
                  </InputGroup>
                  <Button 
                    colorScheme="brand" 
                    type="submit" 
                    isLoading={isSubscribing}
                    loadingText="Subscribing"
                    borderLeftRadius={0}
                  >
                    Subscribe
                  </Button>
                </HStack>
              </form>
            </Box>
          </VStack>
        </Box>
        
        {/* Contact Form */}
        <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={6}>Send Us a Message</Heading>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl isRequired isInvalid={errors.name}>
                <FormLabel>Name</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaUser} color="gray.400" />
                  </InputLeftElement>
                  <Input 
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Your name" 
                  />
                </InputGroup>
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>
              
              <FormControl isRequired isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaEnvelope} color="gray.400" />
                  </InputLeftElement>
                  <Input 
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    placeholder="Your email address" 
                    type="email"
                  />
                </InputGroup>
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={errors.phone}>
                <FormLabel>Phone (Optional)</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaPhone} color="gray.400" />
                  </InputLeftElement>
                  <Input 
                    {...register('phone')}
                    placeholder="Your phone number" 
                  />
                </InputGroup>
                <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
              </FormControl>
              
              <FormControl isRequired isInvalid={errors.subject}>
                <FormLabel>Subject</FormLabel>
                <Input 
                  {...register('subject', { required: 'Subject is required' })}
                  placeholder="How can we help you?" 
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
                      message: 'Message should be at least 10 characters'
                    }
                  })}
                  placeholder="Your message..." 
                  rows={6}
                />
                <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="brand"
                size="lg"
                width="full"
                mt={4}
                isLoading={isSubmitting}
                loadingText="Sending"
                leftIcon={<FaPaperPlane />}
              >
                Send Message
              </Button>
            </VStack>
          </form>
        </Box>
      </SimpleGrid>
      
      {/* Map Section */}
      <Box mt={20} borderRadius="lg" overflow="hidden" height="400px">
        <Box
          as="iframe"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.305935303!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1645954571451!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        />
      </Box>
    </Container>
  );
};

export default ContactPage;
