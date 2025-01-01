// src/api/axiosConfig.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://filamen.com.tn/api', // Adjust this to your actual API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to handle logout process
const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login'; // Redirect to login or public page
};

// Function to get new tokens using refresh token
const refreshToken = async () => {
  try {
    const response = await axios.post('/api/users/refresh-token', {
      refreshToken: localStorage.getItem('refreshToken'), // Assuming you store refreshToken in localStorage
    });
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data.accessToken; // Return the new access token
  } catch (error) {
    handleLogout(); // If refreshing the token fails, log out the user
    throw new Error('Could not refresh token.');
  }
};

// Request Interceptor
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle token refresh and logout
API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized) and attempt token refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return API(originalRequest); // Retry the original request with the new token
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    // If another type of error occurs, reject it
    return Promise.reject(error);
  }
);

export default API;
