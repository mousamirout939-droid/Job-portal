import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const normalizedAPI = API_URL.endsWith('/api') ? API_URL : `${API_URL.replace(/\/$/, '')}/api`;

export const useApplicationStore = create((set) => ({
  applications: [],
  stats: null,
  loading: false,
  error: null,

  getApplications: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${normalizedAPI}/applications`, {
        params: filters,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      set({ applications: response.data.applications, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch applications',
        loading: false,
      });
    }
  },

  applyForJob: async (jobId, resumeId, coverLetter) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${normalizedAPI}/applications`,
        { jobId, resumeId, coverLetter },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      set((state) => ({
        applications: [response.data.application, ...state.applications],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to apply',
        loading: false,
      });
      throw error;
    }
  },

  updateApplicationStatus: async (applicationId, status) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `${normalizedAPI}/applications/${applicationId}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      set((state) => ({
        applications: state.applications.map((app) =>
          app._id === applicationId ? response.data.application : app
        ),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update application',
        loading: false,
      });
      throw error;
    }
  },

  getApplicationStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${normalizedAPI}/applications/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      set({ stats: response.data.stats, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch stats',
        loading: false,
      });
    }
  },
}));
