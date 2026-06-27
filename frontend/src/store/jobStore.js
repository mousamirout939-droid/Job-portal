import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const useJobStore = create((set) => ({
  jobs: [],
  job: null,
  total: 0,
  pages: 0,
  loading: false,
  error: null,
  filters: { search: '', location: '', jobType: '', experienceLevel: '' },

  getJobs: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/jobs`, {
        params: { page, limit },
      });
      set({
        jobs: response.data.jobs,
        total: response.data.total,
        pages: response.data.pages,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch jobs',
        loading: false,
      });
    }
  },

  searchJobs: async (page = 1, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/jobs`, {
        params: { page, limit: 10, ...filters },
      });
      set({
        jobs: response.data.jobs,
        total: response.data.total,
        pages: response.data.pages,
        filters,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Search failed',
        loading: false,
      });
    }
  },

  getJobById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/jobs/${id}`);
      set({ job: response.data.job, loading: false });
      return response.data.job;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch job',
        loading: false,
      });
    }
  },

  createJob: async (jobData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/jobs`, jobData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      set((state) => ({
        jobs: [response.data.job, ...state.jobs],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create job',
        loading: false,
      });
      throw error;
    }
  },

  updateJob: async (id, jobData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/jobs/${id}`, jobData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      set((state) => ({
        jobs: state.jobs.map((j) => (j._id === id ? response.data.job : j)),
        job: response.data.job,
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update job',
        loading: false,
      });
      throw error;
    }
  },

  deleteJob: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      set((state) => ({
        jobs: state.jobs.filter((j) => j._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete job',
        loading: false,
      });
      throw error;
    }
  },

  getRecruiterJobs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/jobs/recruiter/jobs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      set({ jobs: response.data.jobs, loading: false });
      return response.data.jobs;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch recruiter jobs',
        loading: false,
      });
    }
  },
}));
