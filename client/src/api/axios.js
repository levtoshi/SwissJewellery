import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      const data = await axios.post(`${API_URL}/api/auth/refresh`);

      localStorage.setItem('accessToken', data.accessToken);

      error.config.headers.Authorization = `Bearer ${data.accessToken}`;

      return api(error.config);
    }

    return Promise.reject(error);
  }
);

export default api;