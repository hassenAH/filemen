// src/api/axiosConfig.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://filamen.com.tn/api', // Adjust this to your actual API URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// Function to get new tokens using refresh token
const refreshToken = async () => {
  try {
    const response = await axios.post('/api/users/refresh-token', {
      refreshToken: localStorage.getItem('refreshToken'), // Assuming you store refreshToken in localStorage
    });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data.token;
  } catch (error) {
    throw new Error('Could not refresh token.');
  }
};

// Request Interceptor
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle token refresh
API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      return API(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default API;
