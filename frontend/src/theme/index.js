import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    50: "#e6f8ff",
    100: "#cceeff",
    200: "#99d8ff",
    300: "#66c2ff",
    400: "#33adff",
    500: "#0097ff", // Primary brand color
    600: "#0078cc",
    700: "#005999",
    800: "#003b66",
    900: "#001c33",
  },
  secondary: {
    50: "#f5f5f5",
    100: "#e6e6e6",
    200: "#cccccc",
    300: "#b3b3b3",
    400: "#999999",
    500: "#666666", // Secondary brand color
    600: "#4d4d4d",
    700: "#333333",
    800: "#1a1a1a",
    900: "#0d0d0d",
  },
  luxury: {
    gold: "#D4AF37",
    silver: "#C0C0C0",
    platinum: "#E5E4E2",
    jet: "#343434",
  },
  status: {
    success: "#48BB78",
    error: "#E53E3E",
    warning: "#F6AD55",
    info: "#4299E1",
  },
  primary: {
    800: {
      default: "#D7CFB3",
      _dark: "#F5F1E3",
    },
    900: {
      default: "#41230A",
      _dark: "#462F10",
    },
  },
};

const fonts = {
  heading: "Montserrat, -apple-system, system-ui, sans-serif",
  body: "Open Sans, -apple-system, system-ui, sans-serif",
};

const theme = extendTheme({
  colors,
  fonts,
  config: {
    initialColorMode: "light",
    useSystemColor: true,
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "semibold",
        borderRadius: "md",
      },
      variants: {
        luxury: {
          bg: "luxury.gold",
          color: "white",
          _hover: {
            bg: "luxury.jet",
            transform: "translateY(-2px)",
            boxShadow: "lg",
          },
        },
      },
    },
  },
});

export default theme;
