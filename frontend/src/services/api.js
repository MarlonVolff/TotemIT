import axios from 'axios';

// URL relativa - funciona tanto em desenvolvimento quanto em produção
// Em produção: usa o mesmo servidor (mesma porta)
// Em desenvolvimento: pode configurar proxy no package.json
const api = axios.create({
  baseURL: '/api'
});

// Interceptor para adicionar token JWT automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/painel-ti';
    }
    return Promise.reject(error);
  }
);

export default api;
