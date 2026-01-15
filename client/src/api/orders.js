import api from './axios';

export const ordersAPI = {
  create: async (data) => await api.post('/orders', data),
  getAll: async (params) => await api.get('/orders', { params }),
  getById: async (id) => await api.get(`/orders/${id}`),
  updateStatus: async (id, status) => await api.patch(`/orders/${id}/status`, { status }),
  cancel: async (id) => await api.patch(`/orders/${id}/cancel`),
  delete: async (id) => await api.delete(`/orders/${id}`),
};