import api from './axios';

export const ordersAPI = {
  create: async (data) => await api.post('/orders', data).then(res => res.data),
  getAll: async (params) => await api.get('/orders', { params }).then(res => res.data),
  getById: async (id) => await api.get(`/orders/${id}`).then(res => res.data),
  updateStatus: async (id, status) => await api.patch(`/orders/${id}/status`, { status }).then(res => res.data),
  cancel: async (id) => await api.patch(`/orders/${id}/cancel`).then(res => res.data),
  delete: async (id) => await api.delete(`/orders/${id}`).then(res => res.data),
};