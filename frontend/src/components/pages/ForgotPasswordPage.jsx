// src/components/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  VStack,
  Alert,
  AlertIcon,
  Link as ChakraLink,
  InputGroup,
  InputLeftElement,
  Icon,
  FormErrorMessage
} from '@chakra-ui/react';
import { FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from "../../utils/api";

const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setMessage(null);
    
    try {
      const response = await api.post('/auth/forgot-password', data);
      
      setMessage(response.data.message || 'If an account exists with that email, a password reset link has been sent.');
      reset(); // Clear form
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'There was an error processing your request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="md" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl">Reset Password</Heading>
          <Text mt={2} color="gray.600">
            Enter your email address and we'll send you a link to reset your password.
          </Text>
        </Box>
        
        {message && (
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            {message}
          </Alert>
        )}
        
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}
        
        <Box 
          as="form" 
          onSubmit={handleSubmit(onSubmit)}
          bg="white" 
          p={8} 
          borderRadius="lg" 
          boxShadow="md"
        >
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={errors.email}>
              <FormLabel>Email Address</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaEnvelope} color="gray.400" />
                </InputLeftElement>
                <Input 
                  type="email" 
                  placeholder="Enter your email address"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </InputGroup>
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
            
            <Button 
              type="submit" 
              colorScheme="brand" 
              size="lg" 
              width="full"
              isLoading={isSubmitting}
              loadingText="Sending"
              mt={4}
            >
              Send Reset Link
            </Button>
          </VStack>
        </Box>
        
        <Box textAlign="center">
          <Text>
            Remembered your password?{' '}
            <ChakraLink as={Link} to="/login" color="brand.500" fontWeight="medium">
              Back to Login
            </ChakraLink>
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default ForgotPasswordPage;