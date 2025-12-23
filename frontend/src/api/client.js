import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:5000'
});

client.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default client;
