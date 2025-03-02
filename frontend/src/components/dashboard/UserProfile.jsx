// components/dashboard/UserProfile.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  useToast,
  Divider,
  Avatar,
  AvatarBadge,
  IconButton,
  Flex,
  Switch,
  Select
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { FaUser, FaEnvelope, FaPhone, FaBuilding } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { updateUserProfile } from '../../utils/api';

const UserProfile = () => {
  const toast = useToast();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || '',
      preferredCurrency: user?.preferences?.currency || 'USD',
      emailNotifications: user?.preferences?.notificationPreferences?.email || true,
      smsNotifications: user?.preferences?.notificationPreferences?.sms || false,
      preferredAircraftClass: user?.preferences?.preferredAircraftClass || '',
    }
  });
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Format data for API
      const profileData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        company: data.company,
        preferences: {
          currency: data.preferredCurrency,
          preferredAircraftClass: data.preferredAircraftClass,
          notificationPreferences: {
            email: data.emailNotifications,
            sms: data.smsNotifications
          }
        }
      };
      
      // Call API to update profile
      const updatedUser = await updateUserProfile(profileData);
      
      // Update local user state
      updateProfile(updatedUser);
      
      // Show success message
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error.message || 'There was an error updating your profile.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Box>
      <Flex mb={6} justify="space-between" align="center">
        <Heading size="lg">My Profile</Heading>
        
        <Button
          leftIcon={<EditIcon />}
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? 'outline' : 'solid'}
          colorScheme="brand"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </Flex>
      
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          {/* Profile Information */}
          <Box bg="white" p={6} borderRadius="lg" boxShadow="base" borderWidth="1px">
            <VStack spacing={6} align="stretch">
              <Flex justify="center" mb={4}>
                <Avatar 
                  size="xl" 
                  name={`${user?.firstName} ${user?.lastName}`} 
                  src={user?.avatar}
                >
                  {isEditing && (
                    <AvatarBadge
                      as={IconButton}
                      icon={<EditIcon />}
                      size="sm"
                      rounded="full"
                      colorScheme="brand"
                      aria-label="Edit profile picture"
                    />
                  )}
                </Avatar>
              </Flex>
              
              <Heading size="md" mb={2}>Personal Information</Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isReadOnly={!isEditing}>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    {...register('firstName', { required: 'First name is required' })}
                    isReadOnly={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                  />
                </FormControl>
                
                <FormControl isReadOnly={!isEditing}>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    {...register('lastName', { required: 'Last name is required' })}
                    isReadOnly={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                  />
                </FormControl>
              </SimpleGrid>
              
              <FormControl isReadOnly>
                <FormLabel>Email</FormLabel>
                <Input
                  value={user?.email}
                  isReadOnly
                  bg="gray.50"
                />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Email cannot be changed
                </Text>
              </FormControl>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isReadOnly={!isEditing}>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    {...register('phone')}
                    isReadOnly={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                  />
                </FormControl>
                
                <FormControl isReadOnly={!isEditing}>
                  <FormLabel>Company (Optional)</FormLabel>
                  <Input
                    {...register('company')}
                    isReadOnly={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                  />
                </FormControl>
              </SimpleGrid>
            </VStack>
          </Box>
          
          {/* Preferences */}
          <Box bg="white" p={6} borderRadius="lg" boxShadow="base" borderWidth="1px">
            <VStack spacing={6} align="stretch">
              <Heading size="md" mb={2}>Preferences</Heading>
              
              <FormControl isReadOnly={!isEditing}>
                <FormLabel>Preferred Currency</FormLabel>
                <Select
                  {...register('preferredCurrency')}
                  isDisabled={!isEditing}
                  bg={isEditing ? 'white' : 'gray.50'}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </Select>
              </FormControl>
              
              <FormControl isReadOnly={!isEditing}>
                <FormLabel>Preferred Aircraft Class</FormLabel>
                <Select
                  {...register('preferredAircraftClass')}
                  isDisabled={!isEditing}
                  bg={isEditing ? 'white' : 'gray.50'}
                  placeholder="Select preferred aircraft class"
                >
                  <option value="Light">Light Jet</option>
                  <option value="Midsize">Midsize Jet</option>
                  <option value="Super midsize">Super Midsize Jet</option>
                  <option value="Heavy">Heavy Jet</option>
                  <option value="Ultra long range">Ultra Long Range</option>
                </Select>
              </FormControl>
              
              <Divider my={2} />
              
              <Heading size="sm" mb={2}>Notification Preferences</Heading>
              
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="email-alerts" mb="0">
                  Email Notifications
                </FormLabel>
                <Switch
                  id="email-alerts"
                  {...register('emailNotifications')}
                  isDisabled={!isEditing}
                  colorScheme="brand"
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="sms-alerts" mb="0">
                  SMS Notifications
                </FormLabel>
                <Switch
                  id="sms-alerts"
                  {...register('smsNotifications')}
                  isDisabled={!isEditing}
                  colorScheme="brand"
                />
              </FormControl>
            </VStack>
          </Box>
        </SimpleGrid>
        
        {isEditing && (
          <Flex justify="flex-end" mt={6}>
            <Button
              type="submit"
              colorScheme="brand"
              size="lg"
              isLoading={isSubmitting}
              loadingText="Saving"
            >
              Save Changes
            </Button>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default UserProfile;