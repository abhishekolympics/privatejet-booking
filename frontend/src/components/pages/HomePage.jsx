import { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Image,
  Icon,
  VStack,
  Flex,
  useTheme,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaPlane, FaCalendarAlt, FaCheckCircle, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SplitText from "../ui/SplitText";

// Custom dark mode color
const DARK_COLOR = "#000000";
const LIGHT_COLOR = "#FFFFFF";

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { colorMode, toggleColorMode } = useColorMode();

  // Reference to track DOM changes
  const observerRef = useRef(null);

  // State to track if Dark Reader is enabled
  const [isDarkReaderEnabled, setIsDarkReaderEnabled] = useState(false);

  // Dynamic colors for our components
  const headingColor = useColorModeValue("primary.800.default", LIGHT_COLOR);
  const textColor = useColorModeValue("primary.800.default", LIGHT_COLOR);

  // Get the actual color values for logging
  const headingColorValue =
    colorMode === "dark" ? LIGHT_COLOR : theme.colors.primary[800].default;

  const textColorValue =
    colorMode === "dark" ? LIGHT_COLOR : theme.colors.primary[800].default;

  // Function to check for Dark Reader
  const checkForDarkReader = () => {
    // Method 1: Check for Dark Reader's style elements
    const darkReaderElements = document.querySelectorAll(
      'style[id*="dark-reader"]'
    );
    const hasStyleElements = darkReaderElements.length > 0;

    // Method 2: Check for Dark Reader classes or attributes
    const hasFilterStyle = !!document.querySelector(
      "html[data-darkreader-mode], body[data-darkreader-mode]"
    );

    // Method 3: Check for specific CSS variables Dark Reader might set
    const computedStyle = window.getComputedStyle(document.documentElement);
    const hasDarkReaderVariables =
      computedStyle.getPropertyValue("--darkreader-inline-bgcolor") !== "";

    const isDarkReaderActive =
      hasStyleElements || hasFilterStyle || hasDarkReaderVariables;

    if (isDarkReaderActive !== isDarkReaderEnabled) {
      console.log(
        `🔍 Dark Reader ${isDarkReaderActive ? "ENABLED" : "DISABLED"}`
      );
      console.log(
        "Detection method:",
        hasStyleElements
          ? "style elements found"
          : hasFilterStyle
          ? "data attributes found"
          : "CSS variables found"
      );

      setIsDarkReaderEnabled(isDarkReaderActive);

      // If Chakra's color mode doesn't match Dark Reader's state, sync them
      if (
        (isDarkReaderActive && colorMode !== "dark") ||
        (!isDarkReaderActive && colorMode !== "light")
      ) {
        console.log("⚠️ Color mode mismatch detected, syncing...");
        // Consider toggling Chakra's color mode to match Dark Reader
        // toggleColorMode();
      }
    }

    return isDarkReaderActive;
  };

  // Log when component mounts
  useEffect(() => {
    console.log("=== THEME INFORMATION ===");
    console.log("Current color mode:", colorMode);
    console.log("Heading color value:", headingColorValue);
    console.log("Text color value:", textColorValue);
    console.log("Full primary.800 theme object:", theme.colors.primary[800]);
    console.log("Dark Reader detected:", checkForDarkReader());
    console.log("========================");
  }, [colorMode, headingColorValue, textColorValue, theme.colors]);

  // Apply the dark theme styles
  useEffect(() => {
    // Apply custom colors to document root when in dark mode
    if (colorMode === "dark") {
      document.documentElement.style.setProperty(
        "--chakra-colors-gray-800",
        DARK_COLOR
      );
      document.documentElement.style.setProperty(
        "--chakra-colors-gray-900",
        DARK_COLOR
      );
      document.documentElement.style.setProperty(
        "--chakra-colors-gray-700",
        LIGHT_COLOR
      );
    } else {
      // Reset to default colors when in light mode
      document.documentElement.style.removeProperty("--chakra-colors-gray-800");
      document.documentElement.style.removeProperty("--chakra-colors-gray-900");
      document.documentElement.style.removeProperty("--chakra-colors-gray-700");
    }
  }, [colorMode]);

  // Set up MutationObserver to watch for Dark Reader changes
  useEffect(() => {
    // Function to handle DOM changes that might be caused by Dark Reader
    const handleDomChanges = (mutations) => {
      // Check if any of the mutations might be Dark Reader related
      const isDarkReaderChange = mutations.some((mutation) => {
        // Dark Reader often adds/removes style elements
        if (
          mutation.type === "childList" &&
          [...mutation.addedNodes, ...mutation.removedNodes].some(
            (node) =>
              node.nodeName === "STYLE" ||
              (node.getAttribute && node.getAttribute("data-darkreader-mode"))
          )
        ) {
          return true;
        }

        // Dark Reader also modifies attributes
        if (
          mutation.type === "attributes" &&
          (mutation.attributeName === "data-darkreader-mode" ||
            mutation.attributeName === "style")
        ) {
          return true;
        }

        return false;
      });

      if (isDarkReaderChange) {
        console.log("🔄 Dark Reader change detected via DOM mutation!");
        checkForDarkReader();
      }
    };

    // Create a MutationObserver to watch for DOM changes
    observerRef.current = new MutationObserver(handleDomChanges);

    // Start observing the document with configured parameters
    observerRef.current.observe(document.documentElement, {
      childList: true, // Watch for added/removed nodes
      attributes: true, // Watch for attribute changes
      subtree: true, // Watch the entire DOM tree
      attributeFilter: ["style", "data-darkreader-mode"], // Only specific attributes
    });

    // Poll for Dark Reader changes every second as a fallback
    const intervalId = setInterval(checkForDarkReader, 1000);

    // Regular system preference listener
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      console.log("System color scheme preference changed!");
      console.log("prefers-color-scheme: dark =", e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);

    // Initial check
    checkForDarkReader();

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearInterval(intervalId);
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [colorMode, isDarkReaderEnabled]);

  const handleAnimationComplete = () => {};

  return (
    <>
      {/* Hero Section - Premium design approach */}
      <Box
        as="section"
        height={{ base: "100vh", md: "90vh" }}
        minHeight="650px"
        position="relative"
        overflow="hidden"
      >
        {/* Full-bleed background image */}
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          zIndex="0"
          backgroundImage="url('/images/hero-bg.jpg')"
          backgroundSize="cover"
          backgroundPosition="center"
        />

        {/* Content overlay with image-preserving gradient */}
        <Flex
          position="relative"
          zIndex="1"
          width="100%"
          height="100%"
          alignItems="center"
          bgGradient={useColorModeValue(
            "linear(to-r, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.8) 100%)",
            "linear(to-r, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.8) 65%, rgba(0,0,0,0.9) 100%)"
          )}
        >
          <Container maxW="95%" height="100%" py={10}>
            <Flex
              height="100%"
              direction={{ base: "column", lg: "row" }}
              alignItems="center"
            >
              {/* Left side spacer - keeps the jet visible */}
              <Box flex={{ base: "0", lg: "7" }} height="100%" />

              {/* Right side content */}
              <Box
                flex={{ base: "1", lg: "3" }}
                width="100%"
                textAlign={{ base: "center", lg: "left" }}
                p={{ base: 4, md: 8 }}
                ml={{ lg: 6 }}
              >
                <VStack
                  spacing={6}
                  align={{ base: "center", lg: "flex-start" }}
                  maxW={{ base: "100%", lg: "100%" }}
                >
                  <SplitText
                    text="Elevate Your Travel Experience"
                    delay={30}
                    animationFrom={{
                      opacity: 0,
                      transform: "translate3d(0,50px,0)",
                    }}
                    animationTo={{
                      opacity: 1,
                      transform: "translate3d(0,0,0)",
                    }}
                    easing="easeOutCubic"
                    threshold={0.2}
                    rootMargin="-50px"
                    onLetterAnimationComplete={handleAnimationComplete}
                    // Add the Heading styling props:
                    as="h1"
                    fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                    fontWeight="bold"
                    color={headingColor}
                    lineHeight="1.1"
                    letterSpacing="-1px"
                    textAlign={{ base: "center", lg: "left" }}
                  />
                  <SplitText
                    text="Book private jets on demand. Experience the luxury, comfort, and flexibility of flying on your own schedule."
                    delay={9} // Slightly faster than the heading for a nice staggered effect
                    animationFrom={{
                      opacity: 0,
                      transform: "translate3d(0,30px,0)",
                    }} // Smaller movement than the heading
                    animationTo={{
                      opacity: 1,
                      transform: "translate3d(0,0,0)",
                    }}
                    easing="easeOutCubic"
                    threshold={0.2}
                    rootMargin="-50px"
                    // Maintain the same styling as the Text component
                    fontSize={{ base: "lg", md: "xl" }}
                    color={textColor}
                    maxW={{ base: "100%", lg: "100%" }}
                    textAlign={{ base: "center", lg: "left" }}
                    as="p" // Maintaining paragraph semantics
                  />

                  <Button
                    size="lg"
                    px={8}
                    py={6}
                    fontSize="lg"
                    fontWeight="bold"
                    color={useColorModeValue("white", DARK_COLOR)}
                    bg={useColorModeValue("brand.500", "white")}
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                      bg: useColorModeValue("brand.600", "gray.100"),
                    }}
                    onClick={() => navigate("/booking")}
                  >
                    Book Now
                  </Button>
                </VStack>
              </Box>
            </Flex>
          </Container>
        </Flex>
      </Box>

      {/* Features Section */}
      <Box
        as="section"
        py={20}
        bg={useColorModeValue("white", DARK_COLOR)}
        color={useColorModeValue("inherit", LIGHT_COLOR)}
      >
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Box textAlign="center" maxW="2xl" mx="auto">
              <Heading
                as="h2"
                size="xl"
                mb={4}
                color={useColorModeValue("gray.800", LIGHT_COLOR)}
              >
                Why Choose PrivateJet
              </Heading>
              <Text
                fontSize="lg"
                color={useColorModeValue("gray.600", "gray.300")}
              >
                We offer a seamless booking experience with access to thousands
                of luxurious private jets worldwide.
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
              <FeatureCard
                icon={FaPlane}
                title="Global Fleet"
                text="Access to thousands of aircraft worldwide, from light to ultra-long range jets."
              />
              <FeatureCard
                icon={FaCalendarAlt}
                title="Instant Booking"
                text="Book your private jet in minutes with real-time availability and pricing."
              />
              <FeatureCard
                icon={FaCheckCircle}
                title="Premium Service"
                text="Dedicated concierge service to handle all your travel needs and special requests."
              />
              <FeatureCard
                icon={FaClock}
                title="Time Efficiency"
                text="Skip the lines and wait times, fly from private terminals with expedited boarding."
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Popular Destinations */}
      <Box
        as="section"
        py={20}
        bg={useColorModeValue("gray.50", "gray.900")}
        color={useColorModeValue("inherit", LIGHT_COLOR)}
      >
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Box textAlign="center" maxW="2xl" mx="auto">
              <Heading
                as="h2"
                size="xl"
                mb={4}
                color={useColorModeValue("gray.800", LIGHT_COLOR)}
              >
                Popular Private Jet Destinations
              </Heading>
              <Text
                fontSize="lg"
                color={useColorModeValue("gray.600", "gray.300")}
              >
                Explore our most requested routes and destinations for luxury
                travel.
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
              <DestinationCard
                image="/images/destinations/new-york.jpg"
                title="New York"
                description="The bustling financial and cultural capital of the USA."
                airportCode="KJFK"
              />
              <DestinationCard
                image="/images/destinations/london.jpg"
                title="London"
                description="A global city with rich history and modern attractions."
                airportCode="EGLL"
              />
              <DestinationCard
                image="/images/destinations/dubai.jpg"
                title="Dubai"
                description="Known for luxury shopping, ultramodern architecture, and vibrant nightlife."
                airportCode="OMDB"
              />
              <DestinationCard
                image="/images/destinations/paris.jpg"
                title="Paris"
                description="The city of lights, known for art, fashion, and gastronomy."
                airportCode="LFPG"
              />
              <DestinationCard
                image="/images/destinations/miami.jpg"
                title="Miami"
                description="A vibrant city with beautiful beaches and exciting nightlife."
                airportCode="KMIA"
              />
              <DestinationCard
                image="/images/destinations/las-vegas.jpg"
                title="Las Vegas"
                description="The entertainment capital with casinos, shows, and luxury resorts."
                airportCode="KLAS"
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        as="section"
        py={20}
        bgGradient={useColorModeValue(
          "linear(to-r, blue.600, blue.800)",
          "linear(to-r, black, gray.900)"
        )}
      >
        <Container maxW="container.xl">
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={8}
            justify="space-between"
            align="center"
          >
            <VStack align="flex-start" spacing={4} maxW="xl">
              <Heading color="white" size="xl">
                Ready to Experience Luxury Travel?
              </Heading>
              <Text color="white" fontSize="lg">
                Book your private jet today and enjoy a seamless, premium travel
                experience.
              </Text>
            </VStack>
            <Button
              size="lg"
              bg="white"
              color={useColorModeValue("blue.600", "black")}
              _hover={{
                bg: "gray.100",
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              onClick={() => navigate("/booking")}
            >
              Book Your Flight
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, text }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const titleColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const iconColor = useColorModeValue("blue.500", "blue.300");

  return (
    <VStack
      spacing={4}
      p={6}
      bg={cardBg}
      borderRadius="lg"
      boxShadow="md"
      align="center"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
    >
      <Icon as={icon} boxSize={10} color={iconColor} />
      <Heading as="h3" size="md" color={titleColor}>
        {title}
      </Heading>
      <Text textAlign="center" color={textColor}>
        {text}
      </Text>
    </VStack>
  );
};

// Destination Card Component
const DestinationCard = ({ image, title, description, airportCode }) => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.800");
  const titleColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const buttonScheme = useColorModeValue("blue", "gray");

  const handleBookClick = () => {
    sessionStorage.setItem("selectedDestinationAirport", airportCode);
    console.log("Selected destination in homepage:", airportCode);
    navigate("/booking");
  };

  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
      bg={cardBg}
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
    >
      <Image
        src={image}
        alt={title}
        width="full"
        height="250px"
        objectFit="cover"
      />
      <Box p={5}>
        <Heading as="h3" size="md" mb={2} color={titleColor}>
          {title}
        </Heading>
        <Text color={textColor}>{description}</Text>
        <Button
          variant="outline"
          colorScheme={buttonScheme}
          size="sm"
          mt={4}
          onClick={handleBookClick}
        >
          Book a Flight
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
