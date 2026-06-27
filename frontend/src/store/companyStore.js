import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const useCompanyStore = create((set) => ({
  companies: [],
  company: null,
  myCompany: null,
  loading: false,
  error: null,

  getCompanies: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/companies`, {
        params: { page, limit: 10 },
      });
      set({ companies: response.data.companies, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch companies',
        loading: false,
      });
    }
  },

  getCompanyById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/companies/${id}`);
      set({ company: response.data.company, loading: false });
      return response.data.company;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch company',
        loading: false,
      });
    }
  },

  getMyCompany: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/companies/my-company`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      set({ myCompany: response.data.company, loading: false });
      return response.data.company;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch company',
        loading: false,
      });
    }
  },

  createCompany: async (companyData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/companies`, companyData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      set({ myCompany: response.data.company, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create company',
        loading: false,
      });
      throw error;
    }
  },

  updateCompany: async (id, companyData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/companies/${id}`, companyData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      set({ myCompany: response.data.company, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update company',
        loading: false,
      });
      throw error;
    }
  },
}));
