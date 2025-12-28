import api from './axios';

export const categoriesAPI = {
  getAll: () => api.get('/categories').then(res => res.data),
  getById: (id) => api.get(`/categories/${id}`).then(res => res.data),
  create: (data) => api.post('/categories', data).then(res => res.data),
  update: (id, data) => api.patch(`/categories/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/categories/${id}`).then(res => res.data),
};