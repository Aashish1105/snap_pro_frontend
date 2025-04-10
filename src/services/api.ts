// This file contains interfaces and authentication functions
// The actual data fetching is now handled by contexts

import apiClient from '../config/axiosClient';

export interface Photographer {
  id: number;
  name: string;
  category: string;
  bio: string;
  image: string;
  rating: number;
  projects: number;
  clients: number;
  portfolio: string[];
}

export interface GalleryItem {
  id: number;
  category: string;
  image: string;
  photographer: string;
}

// Authentication functions
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed' };
  }
};

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await apiClient.post('/api/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Registration failed' };
  }
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const submitContactForm = async (formData: ContactFormData) => {
  try {
    // Use apiClient instead of fetch for consistency with other API calls
    const response = await apiClient.post('/api/contact', {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      photographerName: formData.subject || 'SnapPro Photographer'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, message: 'Failed to send message' };
  }
};

export const submitPhotographerContactForm = async (data: any) => {
  try {
    const response = await apiClient.post('/api/photographers/contact', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting photographer contact form:', error);
    return { success: false, message: 'Failed to send message to photographer' };
  }
};