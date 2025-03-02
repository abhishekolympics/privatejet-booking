// 7. frontend/src/utils/validators.js
// Email validation
export const isValidEmail = (email) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  };
  
  // Password validation (at least 6 characters, 1 uppercase, 1 number)
  export const isValidPassword = (password) => {
    return password.length >= 6 && 
           /[A-Z]/.test(password) && 
           /[0-9]/.test(password);
  };
  
  // Phone number validation
  export const isValidPhone = (phone) => {
    const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return regex.test(phone);
  };
  
  // Credit card validation
  export const isValidCreditCard = (cardNumber) => {
    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/[\s-]/g, '');
    
    // Check if it contains only digits
    if (!/^\d+$/.test(cleaned)) return false;
    
    // Check length (most cards are 13-19 digits)
    if (cleaned.length < 13 || cleaned.length > 19) return false;
    
    // Luhn algorithm check
    let sum = 0;
    let shouldDouble = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  };
  
  // CVV validation
  export const isValidCVV = (cvv) => {
    return /^[0-9]{3,4}$/.test(cvv);
  };
  
  // Card expiry validation
  export const isValidExpiry = (month, year) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits of year
    const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-indexed
    
    // Convert inputs to numbers
    const expiryMonth = parseInt(month, 10);
    const expiryYear = parseInt(year, 10);
    
    // Check if expiry date is valid
    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      return false;
    }
    
    return true;
  };
  
  // Required field validation
  export const isRequired = (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  };