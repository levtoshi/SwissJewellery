import api from './axios';

export const cartAPI = {
  get: async () => await api.get('/cart').then(res => res.data),
  addItem: async (data) => await api.post('/cart/items', data).then(res => res.data),
  updateItem: async (productId, data) => await api.patch(`/cart/items/${productId}`, data).then(res => res.data),
  removeItem: async (productId) => await api.delete(`/cart/items/${productId}`).then(res => res.data),
  clear: async () => await api.delete('/cart').then(res => res.data),
  sync: async (items) => await api.post('/cart/sync', { items }).then(res => res.data),
};