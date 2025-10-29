import axios from 'axios';

// Prefer environment variable so backend URL can be configured without code changes
const apiBase = process.env.REACT_APP_API_BASE_URL || ''

const http = axios.create({
  baseURL: apiBase,
  timeout: 10000,
});

// Mock adapter has been disabled - we use setupProxy.js for API proxying instead
// This ensures all /api requests are forwarded to the real backend via the proxy

http.interceptors.request.use(
  (config) => {
    // Add authorization token to headers
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

http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle errors globally
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

export default http;
