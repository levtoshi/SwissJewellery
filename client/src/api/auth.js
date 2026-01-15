import api from './axios';

export const authAPI = {
  register: async (data) => await api.post('/auth/register', data),
  login: async (data) => await api.post('/auth/login', data),
  logout: async () => await api.post('/auth/logout'),
  getMe: async () => await api.get('/auth/me')
};