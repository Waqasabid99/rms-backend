import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (data) => api.post('/auth/change-password', data),
};

export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/stats'),
  getRoles: () => api.get('/roles'),
};

export const reservationAPI = {
  getAll: (params) => api.get('/reservations', { params }),
  getById: (id) => api.get(`/reservations/${id}`),
  create: (data) => api.post('/reservations', data),
  update: (id, data) => api.put(`/reservations/${id}`, data),
  updateStatus: (id, status) => api.patch(`/reservations/${id}/status`, { status }),
  delete: (id) => api.delete(`/reservations/${id}`),
  getStats: () => api.get('/reservations/stats'),
};

export const takeawayAPI = {
  getAll: (params) => api.get('/takeaway', { params }),
  getById: (id) => api.get(`/takeaway/${id}`),
  create: (data) => api.post('/takeaway', data),
  update: (id, data) => api.put(`/takeaway/${id}`, data),
  updateStatus: (id, status) => api.patch(`/takeaway/${id}/status`, { status }),
  delete: (id) => api.delete(`/takeaway/${id}`),
  getStats: () => api.get('/takeaway/stats'),
};

export const deliveryAPI = {
  getAll: (params) => api.get('/delivery', { params }),
  getById: (id) => api.get(`/delivery/${id}`),
  create: (data) => api.post('/delivery', data),
  update: (id, data) => api.put(`/delivery/${id}`, data),
  updateStatus: (id, status) => api.patch(`/delivery/${id}/status`, { status }),
  delete: (id) => api.delete(`/delivery/${id}`),
  getStats: () => api.get('/delivery/stats'),
};

export const menuAPI = {
  getAll: (params) => api.get('/menu', { params }),
  getById: (id) => api.get(`/menu/${id}`),
  create: (data) => api.post('/menu', data),
  update: (id, data) => api.put(`/menu/${id}`, data),
  delete: (id) => api.delete(`/menu/${id}`),
  getStats: () => api.get('/menu/stats'),
};

export default api;
