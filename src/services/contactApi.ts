import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

interface ContactEmailData {
  name: string;
  email: string;
  message: string;
  photographerName: string;
  photographerEmail: string;
}

export const sendContactEmail = async (data: ContactEmailData) => {
  try {
    const response = await axios.post(`${API_URL}/api/contact`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error sending contact email:', error);
    throw new Error(error.response?.data?.message || 'Failed to send message');
  }
};