import { createContext, useState, useContext, useEffect } from 'react';
import axios from '../config/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      
      localStorage.setItem('token', data.token);
      
      const userData = data.user || {
        id: data._id || data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/auth/signup', { name, email, password });
      
      localStorage.setItem('token', data.token);
      
      const userData = data.user || {
        id: data._id || data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Google OAuth Login
  const loginWithGoogle = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${API_URL}/api/auth/google`;
  };

  // Handle Google OAuth Callback
  const handleGoogleCallback = async (token) => {
    try {
      console.log('🔐 Processing Google OAuth callback with token');
      
      // Store token
      localStorage.setItem('token', token);
      
      // Fetch user profile with the token
      const { data } = await axios.get('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('✅ User profile fetched:', data);
      
      const userData = {
        id: data.id || data._id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        theme: data.theme,
        preferences: data.preferences
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('❌ Google callback error:', error);
      localStorage.removeItem('token');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      loginWithGoogle,
      handleGoogleCallback,
      logout, 
      updateUser, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
