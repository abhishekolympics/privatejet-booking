// 4. frontend/src/hooks/useAuth.js
import { useState, useEffect, useContext, createContext } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../utils/api';

// Create auth context
const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login user
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await loginUser({ email, password });
      setUser(data.user);
      setIsAuthenticated(true);
      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    setIsLoading(true);
    try {
      const data = await registerUser(userData);
      setUser(data.user);
      setIsAuthenticated(true);
      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = (updatedUserData) => {
    setUser({ ...user, ...updatedUserData });
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};