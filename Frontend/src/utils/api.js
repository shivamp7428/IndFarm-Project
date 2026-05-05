import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Aapka backend URL
});

// Ye har request mein apne aap token bhej dega
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;