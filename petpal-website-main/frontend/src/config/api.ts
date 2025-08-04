// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  refresh: `${API_BASE_URL}/auth/refresh`,
  
  // Pets
  pets: `${API_BASE_URL}/pets`,
  petById: (id: string) => `${API_BASE_URL}/pets/${id}`,
  
  // Products
  products: `${API_BASE_URL}/products`,
  productById: (id: string) => `${API_BASE_URL}/products/${id}`,
  
  // Diseases
  diseases: `${API_BASE_URL}/diseases`,
  diseaseById: (id: string) => `${API_BASE_URL}/diseases/${id}`,
  
  // Orders
  orders: `${API_BASE_URL}/orders`,
  
  // Chat
  chat: `${API_BASE_URL}/chat`,
  
  // Users
  users: `${API_BASE_URL}/users`,
  userProfile: `${API_BASE_URL}/users/profile`,
  
  // Admin
  admin: `${API_BASE_URL}/admin`,
};

export default API_BASE_URL;
