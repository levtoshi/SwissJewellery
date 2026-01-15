import api from './axios';

export const categoriesAPI = {
  getAll: async () => await api.get('/categories'),
  getById: async (id) => await api.get(`/categories/${id}`),
  create: async (data) => await api.post('/categories', data),
  update: async (id, data) => await api.patch(`/categories/${id}`, data),
  delete: async (id) => await api.delete(`/categories/${id}`),
};