import api from './axios';

export const productsAPI = {
  getAll: async (params) => await api.get('/products', { params }).then(res => res.data),
  getById: async (id) => await api.get(`/products/${id}`).then(res => res.data),
  create: async (data) => await api.post('/products', data).then(res => res.data),
  update: async (id, data) => await api.patch(`/products/${id}`, data).then(res => res.data),
  delete: async (id) => await api.delete(`/products/${id}`).then(res => res.data),
};