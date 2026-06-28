import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize user from storage synchronously to avoid loading spinner
  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (storedUser && token) {
        return JSON.parse(storedUser);
      }
    } catch {
      // Corrupted data, ignore
    }
    return null;
  };

  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  // Background token verification — does NOT block the UI
  useEffect(() => {
    const verifyTokenInBackground = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      if (!token || !user) return;

      try {
        const profile = await authService.getProfile();
        setUser(profile);
        // Sync stored user in case it changed
        if (localStorage.getItem('token')) {
          localStorage.setItem('user', JSON.stringify(profile));
        } else {
          sessionStorage.setItem('user', JSON.stringify(profile));
        }
      } catch (error) {
        console.error('Session verification failed, logging out...', error);
        logout();
      }
    };

    verifyTokenInBackground();
  }, []);

  const login = async (email, password, rememberMe) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      const { token, ...userData } = data;

      setUser(userData);

      if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(userData));
      }
      
      setLoading(false);
      return userData;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.register(name, email, password);
      const { token, ...userData } = data;

      setUser(userData);
      
      // Default to session storage on register, or local storage. Let's do session storage.
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(userData));

      setLoading(false);
      return userData;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
