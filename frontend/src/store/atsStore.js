import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const useATSStore = create((set) => ({
  topCandidates: [],
  analytics: null,
  filteredCandidates: [],
  loading: false,
  error: null,

  scoreApplications: async (jobId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/ats/${jobId}/score`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to score applications',
        loading: false,
      });
      throw error;
    }
  },

  getTopCandidates: async (jobId, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/ats/${jobId}/top-candidates/${limit}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      set({ topCandidates: response.data.candidates, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch candidates',
        loading: false,
      });
    }
  },

  getATSAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/ats/analytics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      set({ analytics: response.data.analytics, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch analytics',
        loading: false,
      });
    }
  },

  filterCandidates: async (jobId, minScore, maxScore, status) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/ats/filter`,
        { jobId, minScore, maxScore, status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      set({ filteredCandidates: response.data.candidates, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to filter candidates',
        loading: false,
      });
      throw error;
    }
  },
}));
