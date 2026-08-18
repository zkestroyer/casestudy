import axios from 'axios';

/**
 * ACADEMIC PURPOSE:
 * This file centralizes all HTTP communication with the Django backend.
 * By abstracting Axios calls into service objects (e.g., productsAPI, authAPI), 
 * we decouple the UI components from the specific URL routes and HTTP methods.
 * This makes the codebase much easier to maintain, test, and update.
 * 
 * INTERCEPTORS:
 * We use an Axios interceptor to automatically attach the authentication Token
 * to the headers of every outgoing request, ensuring protected endpoints can be accessed
 * without manually passing the token in every component.
 */
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (credentials) => api.post('auth/login/', credentials),
  logout: () => api.post('auth/logout/'),
  me: () => api.get('auth/me/'),
};

export const categoriesAPI = {
  getAll: () => api.get('categories/'),
  create: (data) => api.post('categories/', data),
  update: (id, data) => api.put(`categories/${id}/`, data),
  delete: (id) => api.delete(`categories/${id}/`),
};

export const productsAPI = {
  getAll: () => api.get('products/'),
  getById: (id) => api.get(`products/${id}/`),
  create: (data) => api.post('products/', data),
  update: (id, data) => api.put(`products/${id}/`, data),
  delete: (id) => api.delete(`products/${id}/`),
};

export const suppliersAPI = {
  getAll: () => api.get('suppliers/'),
  getById: (id) => api.get(`suppliers/${id}/`),
  create: (data) => api.post('suppliers/', data),
  update: (id, data) => api.put(`suppliers/${id}/`, data),
  delete: (id) => api.delete(`suppliers/${id}/`),
};

export const customersAPI = {
  getAll: () => api.get('customers/'),
  getById: (id) => api.get(`customers/${id}/`),
  create: (data) => api.post('customers/', data),
  update: (id, data) => api.put(`customers/${id}/`, data),
  delete: (id) => api.delete(`customers/${id}/`),
};

export const purchasesAPI = {
  getAll: () => api.get('purchases/'),
  getById: (id) => api.get(`purchases/${id}/`),
  create: (data) => api.post('purchases/', data),
  update: (id, data) => api.put(`purchases/${id}/`, data),
  delete: (id) => api.delete(`purchases/${id}/`),
  confirm: (id) => api.post(`purchases/${id}/confirm/`),
};

export const ordersAPI = {
  getAll: () => api.get('orders/'),
  getById: (id) => api.get(`orders/${id}/`),
  create: (data) => api.post('orders/', data),
  update: (id, data) => api.put(`orders/${id}/`, data),
  delete: (id) => api.delete(`orders/${id}/`),
  confirm: (id) => api.post(`orders/${id}/confirm/`),
};

export const stockAPI = {
  getAll: () => api.get('stock/'),
  getLow: () => api.get('stock/low/'),
};

export const paymentsAPI = {
  getAll: () => api.get('payments/'),
  getById: (id) => api.get(`payments/${id}/`),
  create: (data) => api.post('payments/', data),
};

export const dashboardAPI = {
  get: () => api.get('dashboard/'),
};

export default api;
