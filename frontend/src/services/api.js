import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const normalizedBaseURL = API_URL.endsWith('/api') ? API_URL : `${API_URL.replace(/\/$/, '')}/api`;

const client = axios.create({
  baseURL: normalizedBaseURL,
});

// Add token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
