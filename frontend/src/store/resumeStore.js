import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const normalizedAPI = API_URL.endsWith('/api') ? API_URL : `${API_URL.replace(/\/$/, '')}/api`;

export const useResumeStore = create((set) => ({
  resumes: [],
  primaryResume: null,
  loading: false,
  error: null,

  uploadResume: async (file) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post(`${normalizedAPI}/resumes/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      set((state) => ({
        resumes: [response.data.resume, ...state.resumes],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to upload resume',
        loading: false,
      });
      throw error;
    }
  },

  getResumes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${normalizedAPI}/resumes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      set({
        resumes: response.data.resumes,
        primaryResume: response.data.resumes.find((r) => r.isPrimary),
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch resumes',
        loading: false,
      });
    }
  },

  setPrimaryResume: async (resumeId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `${normalizedAPI}/resumes/${resumeId}/primary`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      set((state) => ({
        resumes: state.resumes.map((r) => ({
          ...r,
          isPrimary: r._id === resumeId,
        })),
        primaryResume: response.data.resume,
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to set primary resume',
        loading: false,
      });
      throw error;
    }
  },

  deleteResume: async (resumeId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${normalizedAPI}/resumes/${resumeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      set((state) => ({
        resumes: state.resumes.filter((r) => r._id !== resumeId),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete resume',
        loading: false,
      });
      throw error;
    }
  },
}));
