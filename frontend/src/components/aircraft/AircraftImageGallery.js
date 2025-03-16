// components/aircraft/AircraftImageGallery.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Image,
  HStack,
  IconButton,
  useBreakpointValue,
  Skeleton
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { getBestAircraftImage } from '../../utils/aircraftService';

const AircraftImageGallery = ({ images = [], aircraftType = '', defaultTag = 'exterior' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState([]);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  
  // Determine thumbnail size based on screen size
  const thumbnailSize = useBreakpointValue({ base: 60, md: 80 });
  
  // Process images for display
  const processedImages = images.length > 0 
    ? images.map(img => ({ path: img.path, tag: img.tag }))
    : [{ 
        path: `/images/aircraft/placeholders/${aircraftType.toLowerCase().replace(/\s+/g, '-')}_${defaultTag}.jpg`, 
        tag: defaultTag 
      }];
  
  // Set the initial selected image to one matching the default tag if available
  useEffect(() => {
    if (processedImages.length > 0) {
      const defaultImageIndex = processedImages.findIndex(img => img.tag === defaultTag);
      if (defaultImageIndex >= 0) {
        setCurrentImageIndex(defaultImageIndex);
      } else {
        setCurrentImageIndex(0);
      }
      
      // Initialize the loaded state for all images
      setImagesLoaded(new Array(processedImages.length).fill(false));
    }
  }, [processedImages, defaultTag]);
  
  // Check if all images are loaded
  useEffect(() => {
    if (imagesLoaded.length > 0 && imagesLoaded.every(loaded => loaded)) {
      setAllImagesLoaded(true);
    }
  }, [imagesLoaded]);
  
  const handleImageLoad = (index) => {
    const newImagesLoaded = [...imagesLoaded];
    newImagesLoaded[index] = true;
    setImagesLoaded(newImagesLoaded);
  };
  
  const handleImageError = (index) => {
    // If an image fails to load, mark it as loaded to remove the skeleton
    handleImageLoad(index);
    
    // Replace with fallback image path in the processed images
    const newProcessedImages = [...processedImages];
    newProcessedImages[index].path = `/images/aircraft/placeholders/generic_${newProcessedImages[index].tag || 'exterior'}.jpg`;
    
    // This won't trigger a re-render of the component, just updates the path for the current image
  };
  
  const navigateToImage = (index) => {
    setCurrentImageIndex(index);
  };
  
  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? processedImages.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === processedImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  // If no images, return placeholder
  if (processedImages.length === 0) {
    return (
      <Box borderRadius="lg" overflow="hidden">
        <Image 
          src={`/images/aircraft/placeholders/generic_${defaultTag}.jpg`}
          alt="Aircraft"
          width="100%"
          height="auto"
          objectFit="cover"
        />
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Main Image */}
      <Box 
        position="relative" 
        borderRadius="lg" 
        overflow="hidden" 
        mb={4}
      >
        {!imagesLoaded[currentImageIndex] && (
          <Skeleton 
            height={{ base: "250px", md: "400px" }} 
            width="100%" 
            position="absolute"
            top="0"
            left="0"
            zIndex="1"
          />
        )}
        
        <Image 
          src={processedImages[currentImageIndex]?.path}
          alt={`Aircraft ${processedImages[currentImageIndex]?.tag || ''} view`}
          width="100%"
          height={{ base: "250px", md: "400px" }}
          objectFit="cover"
          onLoad={() => handleImageLoad(currentImageIndex)}
          onError={() => handleImageError(currentImageIndex)}
          opacity={imagesLoaded[currentImageIndex] ? 1 : 0}
        />
        
        {processedImages.length > 1 && (
          <>
            <IconButton
              icon={<ChevronLeftIcon boxSize={6} />}
              aria-label="Previous image"
              position="absolute"
              left={2}
              top="50%"
              transform="translateY(-50%)"
              borderRadius="full"
              bg="blackAlpha.600"
              color="white"
              _hover={{ bg: "blackAlpha.800" }}
              onClick={goToPrevious}
              size="md"
              zIndex="2"
            />
            <IconButton
              icon={<ChevronRightIcon boxSize={6} />}
              aria-label="Next image"
              position="absolute"
              right={2}
              top="50%"
              transform="translateY(-50%)"
              borderRadius="full"
              bg="blackAlpha.600"
              color="white"
              _hover={{ bg: "blackAlpha.800" }}
              onClick={goToNext}
              size="md"
              zIndex="2"
            />
          </>
        )}
      </Box>
      
      {/* Image Thumbnails */}
      {processedImages.length > 1 && (
        <HStack spacing={2} overflowX="auto" py={2} px={1} css={{
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#CBD5E0',
            borderRadius: '4px',
          },
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 transparent',
        }}>
          {processedImages.map((image, index) => (
            <Box 
              key={index}
              cursor="pointer"
              borderWidth={currentImageIndex === index ? "2px" : "1px"}
              borderColor={currentImageIndex === index ? "brand.500" : "gray.200"}
              borderRadius="md"
              overflow="hidden"
              width={`${thumbnailSize}px`}
              height={`${thumbnailSize}px`}
              flexShrink={0}
              position="relative"
              onClick={() => navigateToImage(index)}
              transition="all 0.2s"
              _hover={{ 
                borderColor: "brand.500", 
                transform: "scale(1.05)" 
              }}
            >
              {!imagesLoaded[index] && (
                <Skeleton 
                  height="100%" 
                  width="100%" 
                  position="absolute"
                  top="0"
                  left="0"
                />
              )}
              
              <Image
                src={image.path}
                alt={`Thumbnail ${image.tag || index}`}
                width="100%"
                height="100%"
                objectFit="cover"
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
                opacity={imagesLoaded[index] ? 1 : 0}
              />
            </Box>
          ))}
        </HStack>
      )}
    </Box>
  );
};

export default AircraftImageGallery;