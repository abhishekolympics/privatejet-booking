// 1. frontend/src/components/ui/Button.jsx
import React from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';

const Button = ({ children, variant = 'solid', isLuxury, ...props }) => {
  const buttonVariant = isLuxury ? 'luxury' : variant;
  
  return (
    <ChakraButton 
      variant={buttonVariant}
      {...props}
    >
      {children}
    </ChakraButton>
  );
};

export default Button;