// components/booking/BookingForm.jsx - Main booking form component

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  Divider
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useBooking } from '../../hooks/useBooking';
import AirportSearchInput from '../ui/AirportSearchInput';

const BookingForm = ({ destinationAirport }) => {
  const router = useNavigate();
  const { setBookingDetails } = useBooking();

  const [legs, setLegs] = useState([{
    id: 1,
    departureAirport: null,
    arrivalAirport: null,
    departureDate: new Date(),
    departureTime: '10:00',
    passengers: 2
  }]);

  const { register, handleSubmit, control, formState: { errors } } = useForm();

  const addLeg = () => {
    const newLeg = {
      id: legs.length + 1,
      departureAirport: legs[legs.length - 1].arrivalAirport,
      arrivalAirport: null,
      departureDate: new Date(legs[legs.length - 1].departureDate),
      departureTime: '10:00',
      passengers: legs[legs.length - 1].passengers
    };

    setLegs([...legs, newLeg]);
  };

  const removeLeg = (id) => {
    if (legs.length <= 1) return;
    setLegs(legs.filter(leg => leg.id !== id));
  };

  const handleLegChange = (id, field, value) => {
    setLegs(legs.map(leg =>
      leg.id === id ? { ...leg, [field]: value } : leg
    ));
  };

  const onSubmit = (data) => {
    // Format legs for API request
    const formattedLegs = legs.map(leg => ({
      departure_airport: {
        icao: leg.departureAirport.icao,
      },
      arrival_airport: {
        icao: leg.arrivalAirport.icao,
      },
      pax: leg.passengers,
      departure_datetime: `${formatDate(leg.departureDate)}T${leg.departureTime}`
    }));

    // Save booking details to context
    setBookingDetails({
      legs: formattedLegs,
      aircraft: [
        {
          ac_class: data.aircraftClass
        }
      ],
      currency_code: data.currency
    });

    // Navigate to aircraft selection page
    router('/aircraft-selection');
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      bg="white"
      borderRadius="xl"
      boxShadow="xl"
      p={8}
      mb={10}
    >
      <Heading size="lg" mb={6} color="brand.700">Book Your Private Jet</Heading>

      {legs.map((leg, index) => (
        <Box key={leg.id} mb={6}>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md" color="brand.600">
              {index === 0 ? 'Departure Flight' : `Return Flight ${index}`}
            </Heading>
            {legs.length > 1 && (
              <IconButton
                icon={<MinusIcon />}
                size="sm"
                colorScheme="red"
                onClick={() => removeLeg(leg.id)}
                aria-label="Remove leg"
              />
            )}
          </Flex>

          <Divider mb={4} />

          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <FormControl isRequired isInvalid={!leg.departureAirport}>
                <FormControl isRequired isInvalid={!leg.departureAirport}>
                  <FormLabel>From</FormLabel>
                  <AirportSearchInput
                    value={leg.departureAirport}
                    onChange={(airport) => handleLegChange(leg.id, 'departureAirport', airport)}
                    placeholder="Search departure airport"
                    name={`departure-airport-${leg.id}`}
                    required={true}
                  />
                  {!leg.departureAirport && (
                    <FormErrorMessage>Departure airport is required</FormErrorMessage>
                  )}
                </FormControl>
              </FormControl>

              <FormControl isRequired isInvalid={!leg.arrivalAirport}>
                <FormLabel>To</FormLabel>
                  <AirportSearchInput
                    value={leg.arrivalAirport}
                    onChange={(airport) => handleLegChange(leg.id, 'arrivalAirport', airport)}
                    placeholder="Search arrival airport"
                    initialAirportCode={index === 0 ? destinationAirport : null}
                  />
                {!leg.arrivalAirport && (
                  <FormErrorMessage>Arrival airport is required</FormErrorMessage>
                )}
              </FormControl>
            </HStack>

            <HStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <Controller
                  control={control}
                  name={`legs.${index}.departureDate`}
                  render={({ field }) => (
                    <DatePicker
                      selected={leg.departureDate}
                      onChange={(date) => handleLegChange(leg.id, 'departureDate', date)}
                      dateFormat="yyyy-MM-dd"
                      minDate={new Date()}
                      customInput={<Input />}
                    />
                  )}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Time</FormLabel>
                <Select
                  value={leg.departureTime}
                  onChange={(e) => handleLegChange(leg.id, 'departureTime', e.target.value)}
                >
                  {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                    <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                      {hour.toString().padStart(2, '0')}:00
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Passengers</FormLabel>
                <NumberInput
                  min={1}
                  max={16}
                  value={leg.passengers}
                  onChange={(value) => handleLegChange(leg.id, 'passengers', parseInt(value))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </HStack>
          </VStack>
        </Box>
      ))}

      <Button
        leftIcon={<AddIcon />}
        variant="outline"
        colorScheme="brand"
        mb={6}
        onClick={addLeg}
      >
        Add Return Flight
      </Button>

      <Divider mb={6} />

      <VStack spacing={4} align="stretch">
        <Heading size="md" color="brand.600" mb={2}>Aircraft Preferences</Heading>

        <FormControl isRequired>
          <FormLabel>Aircraft Class</FormLabel>
          <Select
            placeholder="Select aircraft class"
            {...register('aircraftClass', { required: 'Aircraft class is required' })}
          >
            <option value="Light">Light Jet (4-6 passengers)</option>
            <option value="Midsize">Midsize Jet (6-8 passengers)</option>
            <option value="Super midsize">Super Midsize Jet (8-10 passengers)</option>
            <option value="Heavy">Heavy Jet (10-16 passengers)</option>
            <option value="Ultra long range">Ultra Long Range (12-16 passengers)</option>
          </Select>
          {errors.aircraftClass && <FormErrorMessage>{errors.aircraftClass.message}</FormErrorMessage>}
        </FormControl>

        <FormControl>
          <FormLabel>Currency</FormLabel>
          <Select
            defaultValue="USD"
            {...register('currency')}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </Select>
        </FormControl>
      </VStack>

      <Button
        mt={8}
        size="lg"
        colorScheme="brand"
        type="submit"
        width="full"
        variant="luxury"
      >
        Search Available Aircraft
      </Button>
    </Box>
  );
};

export default BookingForm;