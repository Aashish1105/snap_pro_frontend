import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Photographer } from '../services/api';
import apiClient from '../config/axiosClient';

interface PhotographerContextType {
  photographers: Photographer[];
  loading: boolean;
  error: string | null;
  fetchPhotographers: (category?: string) => Promise<void>;
  getPhotographerById: (id: number) => Promise<Photographer | undefined>;
  contactPhotographer: (data: any) => Promise<{ success: boolean; message: string }>;
}

const PhotographerContext = createContext<PhotographerContextType | undefined>(undefined);

export const PhotographerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotographers = async (category = 'all') => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/api/photographers${category !== 'all' ? `?category=${category}` : ''}`);
      setPhotographers(response.data);
    } catch (err) {
      console.error('Error fetching photographers:', err);
      setError('Failed to fetch photographers');
      // Fallback to empty array if API fails
      setPhotographers([]);
    } finally {
      setLoading(false);
    }
  };

  const getPhotographerById = async (id: number) => {
    try {
      const response = await apiClient.get(`/api/photographers/${id}`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching photographer with ID ${id}:`, err);
      // Try to find in local state as fallback
      return photographers.find(p => p.id === id);
    }
  };

  const contactPhotographer = async (data: any) => {
    try {
      const response = await apiClient.post('/api/photographers/contact', data);
      return response.data;
    } catch (err) {
      console.error('Error contacting photographer:', err);
      throw new Error('Failed to send message to photographer');
    }
  };

  useEffect(() => {
    fetchPhotographers();
  }, []);

  return (
    <PhotographerContext.Provider value={{ 
      photographers, 
      loading, 
      error, 
      fetchPhotographers, 
      getPhotographerById,
      contactPhotographer
    }}>
      {children}
    </PhotographerContext.Provider>
  );
};

export const usePhotographers = () => {
  const context = useContext(PhotographerContext);
  if (context === undefined) {
    throw new Error('usePhotographers must be used within a PhotographerProvider');
  }
  return context;
};