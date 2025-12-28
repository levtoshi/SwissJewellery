import api from './axios';

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }).then(res => res.data.products),
  getById: (id) => api.get(`/products/${id}`).then(res => res.data),
  create: (data) => api.post('/products', data).then(res => res.data),
  update: (id, data) => api.patch(`/products/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/products/${id}`).then(res => res.data),
};