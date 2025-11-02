import axios from 'axios';

// Use relative URL in production, localhost in development
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
      error.message = 'Cannot connect to backend server. Please ensure it is running on port 5000.';
    }
    return Promise.reject(error);
  }
);

// Posts API
export const postsAPI = {
  getAll: () => api.get('/posts'),
  getById: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
};

// Schedules API
export const schedulesAPI = {
  getAll: () => api.get('/schedules'),
  getById: (id) => api.get(`/schedules/${id}`),
  getByPlatform: (platform) => api.get(`/schedules/platform/${platform}`),
  create: (data) => api.post('/schedules', data),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  delete: (id) => api.delete(`/schedules/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getAll: () => api.get('/analytics'),
  getBySchedule: (scheduleId) => api.get(`/analytics/schedule/${scheduleId}`),
  getByPlatform: (platform) => api.get(`/analytics/platform/${platform}`),
  getDashboard: () => api.get('/analytics/dashboard/summary'),
  create: (data) => api.post('/analytics', data),
  update: (id, data) => api.put(`/analytics/${id}`, data),
};

export default api;
