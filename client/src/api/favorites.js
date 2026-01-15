import api from './axios';

export const favoritesAPI = {
  getAll: async () => await api.get('/favorites'),
  add: async (id) => await api.post(`/favorites/${id}`),
  delete: async (id) => await api.delete(`/favorites/${id}`),
};