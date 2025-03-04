import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  useDisclosure,
  Container,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="999"
      bg={scrolled ? 'white' : 'transparent'}
      boxShadow={scrolled ? 'md' : 'none'}
      transition="all 0.3s ease"
    >
      <Container maxW="container.xl">
        <Flex color={scrolled ? 'gray.600' : 'white'} minH="60px" align="center" py={2} px={4}>
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant="ghost"
            aria-label="Toggle Navigation"
            color={scrolled ? 'gray.600' : 'white'}
          />
          <Flex flex={1} justify={{ base: 'center', md: 'start' }}>
            <Link to="/" bg="blue">
              {/* <Image src={scrolled ? '/images/logo-dark.svg' : '/images/logo-light.svg'} alt="Logo" height="40px" backgroundColor="white" /> */}
              <Box as="a" cursor="pointer" p={1} borderRadius="md">
                <Image 
                  src={scrolled ? "/images/logo-light.svg" : "/images/logo-light.svg"} 
                  alt="PrivateJet Logo" 
                  height="40px"
                  bg="white"
                />
              </Box>
            </Link>
            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav scrolled={scrolled} />
            </Flex>
          </Flex>

          <Stack direction="row" spacing={6} justify="flex-end">
            {isAuthenticated ? (
              <Menu>
                <MenuButton as={Button} rounded="full" variant="link" cursor="pointer">
                  <Avatar size="sm" src={user?.avatar || '/images/avatar-placeholder.png'} />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => navigate('/dashboard')}>Dashboard</MenuItem>
                  <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                  <MenuItem onClick={() => navigate('/bookings')}>My Bookings</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <>
                <Button as={Link} to="/login" fontSize="sm" fontWeight={400} variant="link">
                  Sign In
                </Button>
                <Button as={Link} to="/register" fontSize="sm" fontWeight={600} bg="brand.500" color="white" _hover={{ bg: 'brand.600' }}>
                  Sign Up
                </Button>
              </>
            )}
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </Container>
    </Box>
  );
};

const DesktopNav = ({ scrolled }) => {
  const linkColor = scrolled ? 'gray.600' : 'white';
  const linkHoverColor = scrolled ? 'brand.500' : 'gray.200';
  const popoverBg = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction="row" spacing={4}>
      {NAV_ITEMS.map(({ label, href, children }) => (
        <Box key={label}>
          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
              <Link to={href ?? '#'}>
                <Text p={2} fontSize="sm" fontWeight={500} color={linkColor} _hover={{ color: linkHoverColor }}>
                  {label}
                </Text>
              </Link>
            </PopoverTrigger>
            {children && (
              <PopoverContent border={0} boxShadow="xl" bg={popoverBg} p={4} rounded="xl">
                <Stack>{children.map((child) => <DesktopSubNav key={child.label} {...child} />)}</Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => (
  <Link to={href}>
    <Box p={2} rounded="md" _hover={{ bg: useColorModeValue('brand.50', 'gray.900') }}>
      <Stack direction="row" align="center">
        <Text fontWeight={500}>{label}</Text>
        <Text fontSize="sm">{subLabel}</Text>
        <ChevronRightIcon color="brand.500" w={5} h={5} />
      </Stack>
    </Box>
  </Link>
);

const MobileNav = () => (
  <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
    {NAV_ITEMS.map((item) => <MobileNavItem key={item.label} {...item} />)}
  </Stack>
);

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex py={2} as={Link} to={href ?? '#'} align="center" justify="space-between">
        <Text fontWeight={600}>{label}</Text>
        {children && <ChevronDownIcon transition="all .25s ease-in-out" transform={isOpen ? 'rotate(180deg)' : ''} />}
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Stack pl={4} borderLeft={1} align="start">
          {children && children.map((child) => <Link key={child.label} to={child.href}>{child.label}</Link>)}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Book a Jet', href: '/booking' },
  { label: 'Aircraft', href: '#', children: [
    { label: 'Light Jets', subLabel: 'Short trips', href: '/aircraft/light' },
    { label: 'Midsize Jets', subLabel: 'Medium-range', href: '/aircraft/midsize' },
    { label: 'Heavy Jets', subLabel: 'Long-haul', href: '/aircraft/heavy' },
  ]},
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default Header;
