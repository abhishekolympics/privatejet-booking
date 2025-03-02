// 9. frontend/src/components/booking/PaymentForm.jsx
import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Button,
  SimpleGrid,
  Divider,
  HStack,
  useToast
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { FaLock } from 'react-icons/fa';
import { isValidCreditCard, isValidCVV, isValidExpiry } from '../../utils/validators';

const PaymentForm = ({ onSubmit, isLoading }) => {
  const toast = useToast();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [cardType, setCardType] = useState('');
  
  const cardNumber = watch('cardNumber', '');
  const expiryMonth = watch('expiryMonth', '');
  const expiryYear = watch('expiryYear', '');
  
  // Detect card type based on card number
  const detectCardType = (number) => {
    const cleansed = number.replace(/\D/g, '');
    
    const cardPatterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/
    };
    
    for (const [type, pattern] of Object.entries(cardPatterns)) {
      if (pattern.test(cleansed)) {
        return type;
      }
    }
    
    return '';
  };
  
  // Format card number with spaces
  const formatCardNumber = (value) => {
    if (!value) return value;
    
    const cleansed = value.replace(/\D/g, '');
    
    if (cardType === 'amex') {
      return cleansed.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3').trim();
    }
    
    return cleansed.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };
  
  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    const detectedType = detectCardType(value);
    setCardType(detectedType);
    
    // Format the input
    const formattedValue = formatCardNumber(value);
    e.target.value = formattedValue;
  };
  
  const validateCardNumber = (value) => {
    const cleansed = value.replace(/\D/g, '');
    if (!cleansed) return 'Card number is required';
    if (!isValidCreditCard(cleansed)) return 'Invalid card number';
    return true;
  };
  
  const validateCVV = (value) => {
    if (!value) return 'CVV is required';
    if (!isValidCVV(value)) return 'Invalid CVV';
    return true;
  };
  
  const validateExpiry = () => {
    if (!expiryMonth || !expiryYear) return 'Expiry date is required';
    if (!isValidExpiry(expiryMonth, expiryYear)) return 'Card is expired';
    return true;
  };
  
  const handleFormSubmit = (data) => {
    try {
      // Validate card expiry one more time
      if (!isValidExpiry(data.expiryMonth, data.expiryYear)) {
        toast({
          title: 'Invalid expiry date',
          description: 'Please check your card expiry date',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      // Prepare payment data
      const paymentData = {
        cardNumber: data.cardNumber.replace(/\D/g, ''),
        nameOnCard: data.nameOnCard,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        cvv: data.cvv,
        billingAddress: data.billingAddress
      };
      
      // Call the onSubmit function passed as prop
      onSubmit(paymentData);
    } catch (error) {
      toast({
        title: 'Payment Error',
        description: error.message || 'There was an error processing your payment',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  return (
    <Box 
      as="form" 
      onSubmit={handleSubmit(handleFormSubmit)}
      bg="white" 
      borderRadius="lg" 
      boxShadow="md" 
      p={6}
    >
      <VStack spacing={6} align="stretch">
        <Heading size="md">Payment Information</Heading>
        
        <FormControl isRequired isInvalid={errors.cardNumber}>
          <FormLabel>Card Number</FormLabel>
          <Input
            placeholder="1234 5678 9012 3456"
            {...register('cardNumber', { 
              required: 'Card number is required',
              validate: validateCardNumber
            })}
            onChange={handleCardNumberChange}
            maxLength={19}
          />
          <FormErrorMessage>{errors.cardNumber?.message}</FormErrorMessage>
        </FormControl>
        
        <FormControl isRequired isInvalid={errors.nameOnCard}>
          <FormLabel>Name on Card</FormLabel>
          <Input
            placeholder="John Doe"
            {...register('nameOnCard', { required: 'Name on card is required' })}
          />
          <FormErrorMessage>{errors.nameOnCard?.message}</FormErrorMessage>
        </FormControl>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl isRequired isInvalid={errors.expiryMonth || errors.expiryYear}>
            <FormLabel>Expiry Date</FormLabel>
            <HStack>
              <Select
                placeholder="MM"
                {...register('expiryMonth', { 
                  required: 'Month is required',
                  validate: validateExpiry
                })}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month.toString().padStart(2, '0')}>
                    {month.toString().padStart(2, '0')}
                  </option>
                ))}
              </Select>
              <Select
                placeholder="YY"
                {...register('expiryYear', { 
                  required: 'Year is required',
                  validate: validateExpiry
                })}
              >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                  <option key={year} value={year.toString().slice(-2)}>
                    {year}
                  </option>
                ))}
              </Select>
            </HStack>
            <FormErrorMessage>
              {errors.expiryMonth?.message || errors.expiryYear?.message}
            </FormErrorMessage>
          </FormControl>
          
          <FormControl isRequired isInvalid={errors.cvv}>
            <FormLabel>CVV</FormLabel>
            <Input
              placeholder="123"
              type="password"
              maxLength={4}
              {...register('cvv', { 
                required: 'CVV is required',
                validate: validateCVV
              })}
            />
            <FormErrorMessage>{errors.cvv?.message}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>
        
        <FormControl isRequired isInvalid={errors.billingAddress}>
          <FormLabel>Billing Address</FormLabel>
          <Input
            placeholder="123 Main St, City, Country"
            {...register('billingAddress', { required: 'Billing address is required' })}
          />
          <FormErrorMessage>{errors.billingAddress?.message}</FormErrorMessage>
        </FormControl>
        
        <Divider />
        
        <Button
          type="submit"
          colorScheme="brand"
          size="lg"
          leftIcon={<FaLock />}
          isLoading={isLoading}
          loadingText="Processing"
          variant="luxury"
        >
          Pay Securely
        </Button>
      </VStack>
    </Box>
  );
};

export default PaymentForm;