import axios from 'axios';

const api = axios.create({
  baseURL: `/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401) {
      const data = await api.post('/auth/refresh');

      localStorage.setItem('accessToken', data.accessToken);

      original.headers.Authorization =
        `Bearer ${data.accessToken}`;

      return api(original);
    }

    return Promise.reject(error);
  }
);

export default api;