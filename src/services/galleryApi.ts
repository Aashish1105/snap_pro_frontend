import axios from 'axios';
import { getToken } from './authApi';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Fetch gallery items
export const fetchGalleryItems = async (category = 'all') => {
  try {
    const url = category === 'all' 
      ? `${API_URL}/api/gallery` 
      : `${API_URL}/api/gallery?category=${category}`;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    throw error;
  }
};

// Add new gallery item (admin only)
export const addGalleryItem = async (galleryData: any) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.post(
      `${API_URL}/api/gallery`, 
      galleryData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding gallery item:', error);
    throw error;
  }
};