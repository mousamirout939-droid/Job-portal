import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const normalizedAPI = API_URL.endsWith('/api') ? API_URL : `${API_URL.replace(/\/$/, '')}/api`;

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,

  register: async (name, email, password, role) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${normalizedAPI}/auth/register`, {
        name,
        email,
        password,
        role,
      });
      localStorage.setItem('token', response.data.token);
      set({
        user: response.data.user,
        token: response.data.token,
        loading: false,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${normalizedAPI}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      set({
        user: response.data.user,
        token: response.data.token,
        loading: false,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null, loading: false });
      return;
    }

    set({ loading: true });
    try {
      const response = await axios.get(`${normalizedAPI}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({
        user: response.data.user,
        token,
        loading: false,
      });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  },

  updateProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${normalizedAPI}/auth/profile`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      set({
        user: response.data.user,
        loading: false,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));
