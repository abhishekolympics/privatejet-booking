// src/components/pages/ResetPasswordPage.jsx
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
  InputRightElement,
  IconButton,
  FormErrorMessage
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../utils/api';

const ResetPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { resetToken } = useParams();
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm();
  
  const password = watch('password', '');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setMessage(null);
    
    try {
      const response = await api.post(`/auth/reset-password/${resetToken}`, { password: data.password});
      
      setMessage(response.data.message || 'Your password has been reset successfully.');
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'There was an error resetting your password. The token may be invalid or expired.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // If no token is provided in the URL
  if (!resetToken) {
    return (
      <Container maxW="md" py={10}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          Invalid password reset link. Please request a new password reset.
        </Alert>
        <Box textAlign="center" mt={4}>
          <Button 
            as={Link} 
            to="/forgot-password" 
            colorScheme="brand"
          >
            Return to Forgot Password
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="md" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl">Reset Your Password</Heading>
          <Text mt={2} color="gray.600">
            Enter your new password below.
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
            <FormControl isRequired isInvalid={errors.password}>
              <FormLabel>New Password</FormLabel>
              <InputGroup>
                <Input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Enter your new password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    size="sm"
                    onClick={toggleShowPassword}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            
            <FormControl isRequired isInvalid={errors.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Confirm your new password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    size="sm"
                    onClick={toggleShowPassword}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
            </FormControl>
            
            <Button 
              type="submit" 
              colorScheme="brand" 
              size="lg" 
              width="full"
              isLoading={isSubmitting}
              loadingText="Resetting"
              mt={4}
            >
              Reset Password
            </Button>
          </VStack>
        </Box>
        
        <Box textAlign="center">
          <Text>
            <ChakraLink as={Link} to="/login" color="brand.500" fontWeight="medium">
              Back to Login
            </ChakraLink>
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default ResetPasswordPage;