import axios from 'axios';

// Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token to all requests
api.interceptors.request.use(
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

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get 401, token is invalid/expired - logout user
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

// Event services
export const eventService = {
  getEvents: () => api.get('/events'),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.patch(`/events/${id}`, data),
  getSwappableSlots: () => api.get('/swappable-slots'),
};

// Swap services
export const swapService = {
  createSwapRequest: (data) => api.post('/swap-request', data),
  getSwapRequests: () => api.get('/swap-requests'),
  respondToSwapRequest: (requestId, response) =>
    api.post(`/swap-response/${requestId}`, { response }),
};

export default api;
