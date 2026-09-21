import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('petpal_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('petpal_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone?: string; address?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: Record<string, unknown>) => api.put('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),
  logout: () => api.post('/auth/logout'),
};

export const petsAPI = {
  list: (params?: Record<string, string | number>) => api.get('/pets', { params }),
  getById: (id: string) => api.get(`/pets/${id}`),
  create: (data: Record<string, unknown>) => api.post('/pets', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/pets/${id}`, data),
  delete: (id: string) => api.delete(`/pets/${id}`),
  inquire: (id: string, message: string) => api.post(`/pets/${id}/inquire`, { message }),
  stats: () => api.get('/pets/admin/stats'),
};

export const productsAPI = {
  list: (params?: Record<string, string | number>) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: Record<string, unknown>) => api.post('/products', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  addReview: (id: string, data: { rating: number; title: string; comment: string }) =>
    api.post(`/products/${id}/reviews`, data),
  categories: () => api.get('/products/meta/categories'),
  stats: () => api.get('/products/admin/stats'),
};

export const diseasesAPI = {
  list: (params?: Record<string, string | number>) => api.get('/diseases', { params }),
  getById: (id: string) => api.get(`/diseases/${id}`),
  create: (data: Record<string, unknown>) => api.post('/diseases', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/diseases/${id}`, data),
  delete: (id: string) => api.delete(`/diseases/${id}`),
  symptomChecker: (symptoms: string[], species?: string) =>
    api.post('/diseases/symptom-checker', { symptoms, species }),
  symptoms: (species?: string) => api.get('/diseases/meta/symptoms', { params: { species } }),
  categories: () => api.get('/diseases/meta/categories'),
};

export const ordersAPI = {
  list: (params?: Record<string, string | number>) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: {
    items: Array<{ itemId: string; itemType: 'product' | 'pet'; quantity: number }>;
    shippingAddress: Record<string, string>;
    paymentMethod: string;
  }) => api.post('/orders', data),
  cancel: (id: string) => api.put(`/orders/${id}/cancel`),
  updateStatus: (id: string, data: Record<string, string>) => api.put(`/orders/${id}/status`, data),
  adminAll: (params?: Record<string, string | number>) => api.get('/orders/admin/all', { params }),
};

export const chatAPI = {
  sessions: () => api.get('/chat/sessions'),
  session: (sessionId: string) => api.get(`/chat/session/${sessionId}`),
  sendMessage: (sessionId: string, message: string, sender?: string) =>
    api.post(`/chat/session/${sessionId}/message`, { message, sender }),
  rate: (sessionId: string, score: number, feedback?: string) =>
    api.post(`/chat/session/${sessionId}/rate`, { score, feedback }),
  adminSessions: (params?: Record<string, string | number>) => api.get('/chat/admin/sessions', { params }),
  adminUpdate: (id: string, data: Record<string, unknown>) => api.put(`/chat/admin/session/${id}`, data),
};

export const usersAPI = {
  profile: () => api.get('/users/profile'),
  updateProfile: (data: Record<string, unknown>) => api.put('/users/profile', data),
  addWishlist: (itemId: string, itemType: string) => api.post('/users/wishlist', { itemId, itemType }),
  removeWishlist: (itemId: string) => api.delete(`/users/wishlist/${itemId}`),
  getWishlist: () => api.get('/users/wishlist'),
  adoptions: () => api.get('/users/adoptions'),
};

export const adoptionAPI = {
  submit: (data: Record<string, unknown>) => api.post('/adoption-applications', data),
  myApplications: () => api.get('/adoption-applications/my'),
  adminAll: (params?: Record<string, string | number>) => api.get('/adoption-applications/admin/all', { params }),
  updateStatus: (id: string, data: { status: string; adminNotes?: string }) => api.put(`/adoption-applications/${id}/status`, data),
  withdraw: (id: string) => api.put(`/adoption-applications/${id}/withdraw`),
};

export const adminAPI = {
  dashboard: () => api.get('/admin/dashboard'),
  users: (params?: Record<string, string | number>) => api.get('/admin/users', { params }),
  updateUserStatus: (id: string, data: { isActive?: boolean; isAdmin?: boolean }) =>
    api.put(`/admin/users/${id}/status`, data),
  sales: (period?: string) => api.get('/admin/analytics/sales', { params: { period } }),
  health: () => api.get('/admin/system/health'),
};

export default api;
