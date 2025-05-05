import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize user state from localStorage
  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true);
        
        // Try to fetch user profile from the API first
        try {
          const userData = await authService.fetchUserProfile();
          setUser(userData);
          return;
        } catch (apiError) {
          console.log('Could not fetch user profile from API, falling back to localStorage:', apiError.message);
          
          // Fall back to localStorage if API call fails
          const storedUser = authService.getCurrentUser();
          setUser(storedUser);
        }
      } catch (err) {
        console.error("Error initializing user:", err);
        setError("Error initializing user session");
      } finally {
        setLoading(false);
      }
    };

    initializeUser();

    // Listen for localStorage changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'auth_user') {
        console.log('Auth data changed in localStorage');
        const storedUser = authService.getCurrentUser();
        setUser(storedUser);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Refresh user data from API and localStorage
  const refreshUser = async () => {
    try {
      // Try to get latest user data from API
      const userData = await authService.fetchUserProfile();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Error refreshing user from API:", error);
      // Fall back to localStorage
      const storedUser = authService.getCurrentUser();
      setUser(storedUser);
      return storedUser;
    }
  };

  // Register a new user
  const register = async (email, password, displayName) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await authService.register(email, password, displayName);
      setUser(newUser);
      return newUser;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error("Error during logout:", err);
      setError("Error during logout");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
