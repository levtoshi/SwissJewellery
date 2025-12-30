import api from './axios';

export const categoriesAPI = {
  getAll: async () => await api.get('/categories').then(res => res.data),
  getById: async (id) => await api.get(`/categories/${id}`).then(res => res.data),
  create: async (data) => await api.post('/categories', data).then(res => res.data),
  update: async (id, data) => await api.patch(`/categories/${id}`, data).then(res => res.data),
  delete: async (id) => await api.delete(`/categories/${id}`).then(res => res.data),
};