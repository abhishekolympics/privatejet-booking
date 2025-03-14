import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  Stack,
  Collapse,
  IconButton,
  Image,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Text,
  useColorModeValue,
  useColorMode,
  useDisclosure,
  Container,
  Tooltip,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";
import { useAuth } from "../../hooks/useAuth";

// Custom dark mode color
const DARK_COLOR = "#000000";
const LIGHT_COLOR = "#FFFFFF"; // White for light mode

const Header = () => {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const [isDarkReaderEnabled, setIsDarkReaderEnabled] = useState(false);
  const observerRef = useRef(null);

  // Set up dynamic colors using our theme
  const textColor = useColorModeValue("gray.700", LIGHT_COLOR);
  const headerBg = useColorModeValue(
    scrolled ? "white" : "transparent",
    scrolled ? DARK_COLOR : "transparent"
  );
  const headerShadow = scrolled ? "md" : "none";
  const buttonBg = useColorModeValue("brand.500", "brand.400");
  const buttonColor = useColorModeValue("white", "gray.800");
  const buttonHoverBg = useColorModeValue("brand.600", "brand.300");

  // Icon button colors
  const iconButtonBg = useColorModeValue("transparent", "transparent");
  const iconButtonColor = useColorModeValue("gray.600", LIGHT_COLOR);
  const iconButtonHoverBg = useColorModeValue("gray.100", "whiteAlpha.200");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dark Reader detection
  useEffect(() => {
    // Function to check for Dark Reader
    const checkForDarkReader = () => {
      // Check for Dark Reader's style elements
      const darkReaderElements = document.querySelectorAll(
        'style[id*="dark-reader"]'
      );
      const hasStyleElements = darkReaderElements.length > 0;

      // Check for Dark Reader attributes
      const hasFilterStyle = !!document.querySelector(
        "html[data-darkreader-mode], body[data-darkreader-mode]"
      );

      // Check for CSS variables
      const computedStyle = window.getComputedStyle(document.documentElement);
      const hasDarkReaderVariables =
        computedStyle.getPropertyValue("--darkreader-inline-bgcolor") !== "";

      const isDarkReaderActive =
        hasStyleElements || hasFilterStyle || hasDarkReaderVariables;

      if (isDarkReaderActive !== isDarkReaderEnabled) {
        console.log(
          `Dark Reader ${isDarkReaderActive ? "enabled" : "disabled"}`
        );
        setIsDarkReaderEnabled(isDarkReaderActive);

        // Optionally sync Chakra UI's color mode with Dark Reader
        if (
          (isDarkReaderActive && colorMode !== "dark") ||
          (!isDarkReaderActive && colorMode !== "light")
        ) {
          // Uncomment this if you want automatic synchronization
          // toggleColorMode();
        }
      }

      return isDarkReaderActive;
    };

    // Set up MutationObserver to watch for Dark Reader changes
    const handleDomChanges = (mutations) => {
      const isDarkReaderChange = mutations.some((mutation) => {
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
        console.log("Dark Reader change detected");
        checkForDarkReader();
      }
    };

    // Create MutationObserver
    observerRef.current = new MutationObserver(handleDomChanges);

    // Start observing
    observerRef.current.observe(document.documentElement, {
      childList: true,
      attributes: true,
      subtree: true,
      attributeFilter: ["style", "data-darkreader-mode"],
    });

    // Initial check
    checkForDarkReader();

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

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [colorMode, isDarkReaderEnabled, toggleColorMode]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="999"
      bg={headerBg}
      boxShadow={headerShadow}
      transition="all 0.3s ease"
    >
      <Container maxW="container.xl">
        <Flex minH="50px" align="center" py={1} px={4}>
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant="ghost"
            aria-label="Toggle Navigation"
            color={iconButtonColor}
          />
          <Flex flex={1} justify={{ base: "center", md: "start" }}>
            <Link to="/" bg="blue">
              <Box cursor="pointer" p={1} borderRadius="md">
                <Image
                  src={
                    colorMode === "dark"
                      ? "/images/logo-light.svg"
                      : "/images/logo-light.svg"
                  }
                  alt="PrivateJet Logo"
                  height="30px"
                />
              </Box>
            </Link>
            <Flex display={{ base: "none", md: "flex" }} ml={10}>
              <DesktopNav
                scrolled={scrolled}
                customDark={DARK_COLOR}
                customLight={LIGHT_COLOR}
              />
            </Flex>
          </Flex>

          <Stack direction="row" spacing={4} align="center">
            {/* Theme Toggle Button */}
            <Tooltip
              label={`Switch to ${
                colorMode === "light" ? "dark" : "light"
              } mode`}
            >
              <IconButton
                size="sm"
                bg={iconButtonBg}
                color={iconButtonColor}
                _hover={{ bg: iconButtonHoverBg }}
                aria-label="Toggle color mode"
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
              />
            </Tooltip>

            {/* User Authentication */}
            {isAuthenticated ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  variant="link"
                  cursor="pointer"
                >
                  <Avatar
                    size="sm"
                    src={user?.avatar || "/images/avatar-placeholder.png"}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/bookings")}>
                    My Bookings
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  fontSize="sm"
                  fontWeight={400}
                  variant="link"
                  color={textColor}
                >
                  Sign In
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  fontSize="sm"
                  fontWeight={600}
                  bg={buttonBg}
                  color={buttonColor}
                  _hover={{ bg: buttonHoverBg }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav customDark={DARK_COLOR} customLight={LIGHT_COLOR} />
        </Collapse>
      </Container>
    </Box>
  );
};

const DesktopNav = ({ scrolled, customDark, customLight }) => {
  const linkColor = useColorModeValue("gray.600", customLight);
  const linkHoverColor = useColorModeValue(
    scrolled ? "brand.500" : "gray.200",
    scrolled ? "brand.300" : "white"
  );
  const popoverBg = useColorModeValue("white", customDark);

  return (
    <Stack direction="row" spacing={4}>
      {NAV_ITEMS.map(({ label, href, children }) => (
        <Box key={label}>
          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
              <Link to={href ?? "#"}>
                <Text
                  p={2}
                  fontSize="sm"
                  fontWeight={500}
                  color={linkColor}
                  transition="all 0.5s ease"
                  _hover={{
                    color: linkHoverColor,
                    transform: "translateY(5px)",
                  }}
                >
                  {label}
                </Text>
              </Link>
            </PopoverTrigger>
            {children && (
              <PopoverContent
                border={0}
                boxShadow="xl"
                bg={popoverBg}
                p={4}
                rounded="xl"
              >
                <Stack>
                  {children.map((child) => (
                    <DesktopSubNav
                      key={child.label}
                      {...child}
                      customDark={customDark}
                      customLight={customLight}
                    />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel, customDark, customLight }) => {
  const hoverBg = useColorModeValue("brand.50", "rgba(255, 255, 255, 0.1)");
  const textColor = useColorModeValue("gray.700", customLight);
  const subTextColor = useColorModeValue(
    "gray.500",
    "rgba(255, 255, 255, 0.7)"
  );

  return (
    <Link to={href}>
      <Box p={2} rounded="md" _hover={{ bg: hoverBg }}>
        <Stack direction="row" align="center">
          <Box>
            <Text fontWeight={500} color={textColor}>
              {label}
            </Text>
            <Text fontSize="sm" color={subTextColor}>
              {subLabel}
            </Text>
          </Box>
          <Flex
            transition={"all .3s ease"}
            transform={"translateX(-10px)"}
            opacity={0}
            _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
            justify={"flex-end"}
            align={"center"}
            flex={1}
          >
            <ChevronRightIcon color="brand.500" w={5} h={5} />
          </Flex>
        </Stack>
      </Box>
    </Link>
  );
};

const MobileNav = ({ customDark, customLight }) => {
  const bg = useColorModeValue("white", customDark);

  return (
    <Stack bg={bg} p={4} display={{ md: "none" }}>
      {NAV_ITEMS.map((item) => (
        <MobileNavItem
          key={item.label}
          {...item}
          customDark={customDark}
          customLight={customLight}
        />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href, customDark, customLight }) => {
  const { isOpen, onToggle } = useDisclosure();
  const textColor = useColorModeValue("gray.600", customLight);
  const borderColor = useColorModeValue("gray.200", "rgba(255, 255, 255, 0.3)");

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        to={href ?? "#"}
        align="center"
        justify="space-between"
      >
        <Text fontWeight={600} color={textColor}>
          {label}
        </Text>
        {children && (
          <ChevronDownIcon
            color={textColor}
            transition="all .25s ease-in-out"
            transform={isOpen ? "rotate(180deg)" : ""}
          />
        )}
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Stack
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={borderColor}
          align="start"
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} to={child.href}>
                <Text color={textColor}>{child.label}</Text>
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

// Update the NAV_ITEMS in your Header.jsx to include a Partners link

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Book a Jet",
    href: "/booking",
  },
  {
    label: "Aircraft",
    href: "#",
    children: [
      {
        label: "Light Jets",
        subLabel: "Ideal for short trips with 4-6 passengers",
        href: "/aircraft-types/light",
      },
      {
        label: "Midsize Jets",
        subLabel: "Perfect for medium-range trips with 6-8 passengers",
        href: "/aircraft-types/midsize",
      },
      {
        label: "Heavy Jets",
        subLabel: "Designed for long-haul flights with 8-16 passengers",
        href: "/aircraft-types/heavy",
      },
    ],
  },
  {
    label: "Partners", // Add this item
    href: "/partners",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default Header;
