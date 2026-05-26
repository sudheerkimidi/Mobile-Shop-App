import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 60000
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const register = d => API.post('/auth/register', d);
export const login = d => API.post('/auth/login', d);
export const getMe = () => API.get('/auth/me');
export const getPendingUsers = () => API.get('/auth/pending');
export const approveUser = id => API.put(`/auth/approve/${id}`);

export const getProducts = (page=1) => API.get(`/products?page=${page}`);
export const getProduct = id => API.get(`/products/${id}`);
export const addProduct = fd => API.post('/products', fd);
export const updateProduct = (id, fd) => API.put(`/products/${id}`, fd);
export const deleteProduct = id => API.delete(`/products/${id}`);
export const searchProducts = params => API.get('/products/search', { params });
export const getStats = () => API.get('/products/stats/summary');

export const visualSearch = fd => API.post('/search/visual', fd, { timeout: 90000 });
export const regenerateEmbeddings = () => API.post('/search/regenerate-all', {}, { timeout: 180000 });

export default API;
