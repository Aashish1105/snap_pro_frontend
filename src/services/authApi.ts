import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// User interface
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// Auth response interface
export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

// Login user
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/api/users/login`, { email, password });
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      }));
    }
    
    return {
      success: true,
      user: {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      },
      token: response.data.token
    };
  } catch (error: any) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Login failed' 
    };
  }
};

// Register user
export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/api/users/register`, { 
      name, 
      email, 
      password
      // Note: No role field as it will be set to 'user' by default on the backend
    });
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      }));
    }
    
    return {
      success: true,
      user: {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      },
      token: response.data.token
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Registration failed' 
    };
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user is logged in
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null;
};

// Get current user
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Get auth token
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};