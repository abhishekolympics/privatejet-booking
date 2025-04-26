// components/layout/Footer.jsx - Footer component

import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Heading,
  Link,
  Image,
  IconButton,
  Input,
  FormControl,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import api from "../../utils/api";


const Footer = () => {
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const toast = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!subscribeEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to subscribe.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubscribing(true);

    try {
      const response = await api.post(
        "/contact/subscribe", { email: subscribeEmail }
      );

      setSubscribeEmail("");

      toast({
        title: "Subscription Successful",
        description:
          response.data.message ||
          "Thank you for subscribing to our newsletter!",
        status: "success",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Subscription Error",
        description:
          error.response?.data?.message ||
          "There was an error subscribing. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubscribing(false);
    }
  };
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      borderTopWidth={1}
      borderStyle={"solid"}
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Container as={Stack} maxW={"container.xl"} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack spacing={6}>
            <Box>
              <Image
                src="/images/logo-dark.svg"
                alt="PrivateJet Logo"
                height="40px"
              />
            </Box>
            <Text fontSize={"sm"}>
              © {new Date().getFullYear()} PrivateJet. All rights reserved
            </Text>
            <Stack direction={"row"} spacing={4}>
              <IconButton
                aria-label={"Twitter"}
                icon={<FaTwitter />}
                size="md"
                color="white"
                bg="brand.500"
                _hover={{ bg: "brand.600" }}
                rounded="full"
              />
              <IconButton
                aria-label={"Facebook"}
                icon={<FaFacebook />}
                size="md"
                color="white"
                bg="brand.500"
                _hover={{ bg: "brand.600" }}
                rounded="full"
              />
              <IconButton
                aria-label={"Instagram"}
                icon={<FaInstagram />}
                size="md"
                color="white"
                bg="brand.500"
                _hover={{ bg: "brand.600" }}
                rounded="full"
              />
              <IconButton
                aria-label={"LinkedIn"}
                icon={<FaLinkedin />}
                size="md"
                color="white"
                bg="brand.500"
                _hover={{ bg: "brand.600" }}
                rounded="full"
              />
            </Stack>
          </Stack>

          <Stack align={"flex-start"}>
            <Heading as={"h4"} size={"md"} mb={2}>
              Company
            </Heading>
            <Link href={"/about"}>About Us</Link>
            <Link href={"/about#leadership-team"}>Our Team</Link>
            <Link href={"/careers"}>Careers</Link>
            <Link href={"/contact"}>Contact Us</Link>
            <Link href={"/partners"}>Partners</Link>
          </Stack>

          <Stack align={"flex-start"}>
            <Heading as={"h4"} size={"md"} mb={2}>
              Services
            </Heading>
            <Link href={"/booking"}>Book a Jet</Link>
            <Link href={"/empty-legs"}>Empty Legs</Link>
            <Link href={"/aircraft-types"}>Aircraft Types</Link>
            {/* <Link href={'/aircraft-management'}>Aircraft Management</Link> */}
            {/* <Link href={'/concierge'}>Concierge Services</Link> */}
          </Stack>

          <Stack align={"flex-start"}>
            <Heading as={"h4"} size={"md"} mb={2}>
              Subscribe to Our Newsletter
            </Heading>
            <form onSubmit={handleSubscribe}>
              <Text>Stay updated with our latest offers and news</Text>
              <Stack direction={"row"} width={"full"}>
                <FormControl>
                  <Input
                    placeholder={"Your email address"}
                    bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
                    border={0}
                    _focus={{
                      bg: "whiteAlpha.300",
                    }}
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                  />
                </FormControl>
                <IconButton
                  bg={"brand.500"}
                  color={"white"}
                  _hover={{
                    bg: "brand.600",
                  }}
                  aria-label="Subscribe"
                  icon={<FaEnvelope />}
                  type="submit" 
                  isLoading={isSubscribing}
                />
              </Stack>
            </form>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Container
          as={Stack}
          maxW={"container.xl"}
          py={4}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ md: "space-between" }}
          align={{ md: "center" }}
        >
          <Text>
            © {new Date().getFullYear()} PrivateJet. All rights reserved
          </Text>
          <Stack direction={"row"} spacing={6}>
            <Link href={"/terms"}>Terms of Service</Link>
            <Link href={"/privacy"}>Privacy Policy</Link>
            <Link href={"/cookies"}>Cookie Policy</Link>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
