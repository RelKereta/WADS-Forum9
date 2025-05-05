// Simplified authentication service for testing API connection
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Local storage key for user data
const USER_KEY = 'auth_user';

// Set up axios with authentication configuration
const axiosAuth = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important for session cookies
});

/**
 * Store user data in local storage
 */
const setUserData = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Clear user data from local storage
 */
const clearUserData = () => {
  localStorage.removeItem(USER_KEY);
};

/**
 * Get current user from local storage
 */
const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

/**
 * Register a new user
 */
const register = async (email, password, displayName) => {
  try {
    console.log('Register attempt for:', email);
    
    const response = await axiosAuth.post('/auth/register', { 
      email, 
      password, 
      displayName 
    });
    
    console.log('Registration successful:', response.data);
    
    const { user } = response.data;
    setUserData(user);
    
    return user;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Log in a user
 */
const login = async (email, password) => {
  try {
    console.log('Attempting login for:', email);
    
    const response = await axiosAuth.post('/auth/login', { 
      email, 
      password 
    });
    
    console.log('Login successful, response:', response.data);
    
    const { user } = response.data;
    setUserData(user);
    
    return user;
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    
    throw error;
  }
};

/**
 * Log out the current user
 */
const logout = async () => {
  try {
    // Call the logout endpoint to destroy the server-side session
    await axiosAuth.post('/auth/logout');
    
    // Clear local storage
    clearUserData();
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear local data even if server call fails
    clearUserData();
    throw error;
  }
};

/**
 * Fetch the current user profile
 */
const fetchUserProfile = async () => {
  try {
    const response = await axiosAuth.get('/auth/me');
    
    // Update local storage with the latest user data
    setUserData(response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    
    // If unauthorized, clear local storage
    if (error.response?.status === 401) {
      clearUserData();
    }
    
    throw error;
  }
};

/**
 * Update the user profile
 */
const updateProfile = async (userData) => {
  try {
    console.log('Updating profile with data:', userData);
    
    const response = await axiosAuth.put('/auth/profile', userData);
    console.log('Profile update response:', response.data);
    
    // Update local storage with the updated user data
    const updatedUser = response.data;
    setUserData(updatedUser);
    
    return updatedUser;
  } catch (error) {
    console.error('Profile update error:', error.response?.data || error.message);
    throw error;
  }
};

export default {
  getCurrentUser,
  isAuthenticated,
  register,
  login,
  logout,
  fetchUserProfile,
  updateProfile,
  axiosAuth
}; 