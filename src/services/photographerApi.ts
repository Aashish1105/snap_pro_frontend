import axios from 'axios';
import { getToken } from './authApi';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Fetch all photographers
export const fetchPhotographers = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/photographers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching photographers:', error);
    throw error;
  }
};

// Get photographer by ID
export const getPhotographerById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/api/photographers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching photographer with ID ${id}:`, error);
    throw error;
  }
};

// Add new photographer (admin only)
export const addPhotographer = async (photographerData: any) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.post(
      `${API_URL}/api/photographers`, 
      photographerData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding photographer:', error);
    throw error;
  }
};