import api from './axios';

export const cartAPI = {
  get: async () => await api.get('/cart'),
  addItem: async (data) => await api.post('/cart/items', data),
  updateItem: async (productId, data) => await api.patch(`/cart/items/${productId}`, data),
  removeItem: async (productId) => await api.delete(`/cart/items/${productId}`),
  clear: async () => await api.delete('/cart').then(res => res.data),
  sync: async (items) => await api.post('/cart/sync', { items }),
};