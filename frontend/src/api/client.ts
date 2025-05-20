// src/api/client.ts
import axios, { AxiosError } from 'axios';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      // Check if not on login/signup page
      if (
        !window.location.pathname.includes('login') &&
        !window.location.pathname.includes('signup')
      ) {
        // Clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?session=expired';
      }
    }

    // Handle server errors
    if (error.response?.status === 500) {
      console.error('Server error occurred:', error);
      // You could also show a global error notification here
    }

    // Handle network errors
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('Network error:', error);
      // You could show a "You are offline" notification here
    }

    return Promise.reject(error);
  }
);

// Helper function to handle errors in API calls
export const handleApiError = (error: any): string => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const message = error.response.data?.message || 'An error occurred with the request';
    return message;
  } else if (error.request) {
    // The request was made but no response was received
    return 'Could not connect to the server. Please check your internet connection';
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || 'An unexpected error occurred';
  }
};

export default apiClient;