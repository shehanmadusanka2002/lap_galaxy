import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://16.170.168.84:32050/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add JWT token to headers
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

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/user/register', userData)
};

// Product API
export const productAPI = {
  getAll: () => api.get('/product/all'),
  getById: (id) => api.get(`/product/${id}`),
  search: (brand) => api.get(`/product/search?brand=${brand}`),
  create: (product) => api.post('/product/create', product),
  update: (id, product) => api.put(`/product/update/${id}`, product),
  delete: (id) => api.delete(`/product/delete/${id}`),
  createWithImage: (formData) => api.post('/product/with-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// User API
export const userAPI = {
  getAll: () => api.get('/user/all'),
  delete: (id) => api.delete(`/user/delete/${id}`)
};

// Helper functions
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const isAdmin = () => {
  return localStorage.getItem('role') === 'ADMIN';
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  window.location.href = '/login';
};

export default api;
