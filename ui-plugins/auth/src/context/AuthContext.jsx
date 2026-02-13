import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Replace with your actual API call
      console.log('Login with:', credentials);
      
      // Simulate API response
      const mockUser = {
        id: '1',
        email: credentials.email || credentials.username,
        name: 'User Name',
      };
      const mockToken = 'mock-jwt-token-' + Date.now();

      // Store in state
      setUser(mockUser);
      setToken(mockToken);

      // Persist to localStorage
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('authUser', JSON.stringify(mockUser));

      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      // Replace with your actual API call
      console.log('Sign up with:', userData);
      
      // Simulate API response
      const mockUser = {
        id: '1',
        email: userData.email,
        name: 'New User',
      };
      const mockToken = 'mock-jwt-token-' + Date.now();

      // Store in state
      setUser(mockUser);
      setToken(mockToken);

      // Persist to localStorage
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('authUser', JSON.stringify(mockUser));

      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  };

  const socialAuth = async (provider) => {
    try {
      console.log(`${provider} authentication initiated`);
      
      // Simulate social login
      const mockUser = {
        id: '1',
        email: `user@${provider.toLowerCase()}.com`,
        name: `${provider} User`,
        provider: provider,
      };
      const mockToken = 'mock-jwt-token-social-' + Date.now();

      setUser(mockUser);
      setToken(mockToken);

      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('authUser', JSON.stringify(mockUser));

      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Social auth error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    socialAuth,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
