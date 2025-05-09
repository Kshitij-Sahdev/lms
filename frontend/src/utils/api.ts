import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle error responses
    const statusCode = error.response?.status;
    
    // Handle authentication errors
    if (statusCode === 401) {
      // Clear token if it's invalid or expired
      localStorage.removeItem('authToken');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/sign-in') {
        toast.error('Your session has expired. Please sign in again.');
        window.location.href = '/sign-in';
      }
    }
    
    // Handle authorization errors
    if (statusCode === 403) {
      toast.error('You do not have permission to access this resource.');
    }
    
    // Handle server errors
    if (statusCode && statusCode >= 500) {
      toast.error('Server error. Please try again later.');
    }
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// Helper method for GET requests
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await api.get(url, config);
  return response.data;
};

// Helper method for POST requests
export const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await api.post(url, data, config);
  return response.data;
};

// Helper method for PUT requests
export const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await api.put(url, data, config);
  return response.data;
};

// Helper method for PATCH requests
export const patch = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await api.patch(url, data, config);
  return response.data;
};

// Helper method for DELETE requests
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await api.delete(url, config);
  return response.data;
};

export default {
  get,
  post,
  put,
  patch,
  del,
}; 