import api from './axios';

export const productsAPI = {
  getAll: async (params) => await api.get('/products', { params }),
  getById: async (id) => await api.get(`/products/${id}`),
  create: async (data) => await api.post('/products', data),
  update: async (id, data) => await api.patch(`/products/${id}`, data),
  delete: async (id) => await api.delete(`/products/${id}`),
};