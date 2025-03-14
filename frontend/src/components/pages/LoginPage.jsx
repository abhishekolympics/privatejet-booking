// src/components/pages/LoginPage.jsx - Updated for Password Reset

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link as ChakraLink,
  VStack,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Get the intended destination from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated && !isLoading) {
      navigate(from);
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate(from);
    } catch (error) {
      console.log("error=", error);
      if (error?.response?.data?.message === "Invalid credentials") {
        setError(
          "Please check your email and password and try again."
        );
      } else {
        setError(
          error?.response?.data?.message ||
            "Login failed. Server Error."
        );
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxW="md" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl">Log In</Heading>
          <Text mt={2} color="gray.600">
            Enter your credentials to access your account
          </Text>
        </Box>

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
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
            </FormControl>

            <FormControl isRequired isInvalid={errors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    size="sm"
                    onClick={toggleShowPassword}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {/* Forgot Password Link */}
            <Flex justify="flex-end" width="100%">
              <ChakraLink
                as={Link}
                to="/forgot-password"
                color="brand.500"
                fontSize="sm"
              >
                Forgot password?
              </ChakraLink>
            </Flex>

            <Button
              type="submit"
              colorScheme="brand"
              size="lg"
              width="full"
              isLoading={isSubmitting}
              loadingText="Logging in"
              mt={4}
            >
              Log In
            </Button>
          </VStack>
        </Box>

        <Box textAlign="center">
          <Text>
            Don't have an account?{" "}
            <ChakraLink
              as={Link}
              to="/register"
              color="brand.500"
              fontWeight="medium"
            >
              Register
            </ChakraLink>
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default LoginPage;
