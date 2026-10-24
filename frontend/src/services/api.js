import axios from 'axios';

/**
 * ACADEMIC & ARCHITECTURAL PURPOSE:
 * Centralizes all HTTP communication with the Django REST Framework backend.
 * By abstracting Axios requests into strongly-typed domain services (e.g. productsAPI, ordersAPI),
 * the presentation layer remains decoupled from HTTP transport nuances and URL routing.
 * 
 * INTERCEPTORS:
 * Utilizes a request interceptor to automatically attach the Bearer/Token header
 * across all authenticated outbound requests.
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
  getAll: (params) => api.get('categories/', { params }),
  create: (data) => api.post('categories/', data),
  update: (id, data) => api.put(`categories/${id}/`, data),
  delete: (id) => api.delete(`categories/${id}/`),
};

export const productsAPI = {
  getAll: (params) => api.get('products/', { params }),
  getById: (id) => api.get(`products/${id}/`),
  create: (data) => api.post('products/', data),
  update: (id, data) => api.put(`products/${id}/`, data),
  delete: (id) => api.delete(`products/${id}/`),
};

export const suppliersAPI = {
  getAll: (params) => api.get('suppliers/', { params }),
  getById: (id) => api.get(`suppliers/${id}/`),
  create: (data) => api.post('suppliers/', data),
  update: (id, data) => api.put(`suppliers/${id}/`, data),
  delete: (id) => api.delete(`suppliers/${id}/`),
};

export const customersAPI = {
  getAll: (params) => api.get('customers/', { params }),
  getById: (id) => api.get(`customers/${id}/`),
  create: (data) => api.post('customers/', data),
  update: (id, data) => api.put(`customers/${id}/`, data),
  delete: (id) => api.delete(`customers/${id}/`),
};

export const purchasesAPI = {
  getAll: (params) => api.get('purchases/', { params }),
  getById: (id) => api.get(`purchases/${id}/`),
  create: (data) => api.post('purchases/', data),
  update: (id, data) => api.put(`purchases/${id}/`, data),
  delete: (id) => api.delete(`purchases/${id}/`),
  confirm: (id) => api.post(`purchases/${id}/confirm/`),
};

export const ordersAPI = {
  getAll: (params) => api.get('orders/', { params }),
  getById: (id) => api.get(`orders/${id}/`),
  create: (data) => api.post('orders/', data),
  update: (id, data) => api.put(`orders/${id}/`, data),
  delete: (id) => api.delete(`orders/${id}/`),
  confirm: (id) => api.post(`orders/${id}/confirm/`),
};

export const stockAPI = {
  getAll: (params) => api.get('stock/', { params }),
  getLow: () => api.get('stock/low/'),
};

export const paymentsAPI = {
  getAll: (params) => api.get('payments/', { params }),
  getById: (id) => api.get(`payments/${id}/`),
  create: (data) => api.post('payments/', data),
};

export const dashboardAPI = {
  get: () => api.get('dashboard/'),
};

export default api;
