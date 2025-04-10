import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { GalleryItem } from '../services/api';
import apiClient from '../config/axiosClient';

interface GalleryContextType {
  galleryItems: GalleryItem[];
  loading: boolean;
  error: string | null;
  fetchGalleryItems: (category?: string) => Promise<void>;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<GalleryItem>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleryItems = async (category = 'all') => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/api/gallery${category !== 'all' ? `?category=${category}` : ''}`);
      setGalleryItems(response.data);
    } catch (err) {
      console.error('Error fetching gallery items:', err);
      setError('Failed to fetch gallery items');
      // Fallback to local data if API fails
      setGalleryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    try {
      const response = await apiClient.post('/api/gallery', item);
      const newItem = response.data;
      setGalleryItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      console.error('Error adding gallery item:', err);
      throw new Error('Failed to add gallery item');
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  return (
    <GalleryContext.Provider value={{ 
      galleryItems, 
      loading, 
      error, 
      fetchGalleryItems, 
      addGalleryItem 
    }}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};