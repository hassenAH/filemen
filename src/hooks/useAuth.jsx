import { useState, useCallback } from 'react';
import API from '../API/axiosConfig';

export const useAuth = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // New state for success messages
  const [isLoading, setIsLoading] = useState(false);

  // Login function
  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null); // Clear previous success message
    try {
      const { data } = await API.post('/users/login', { email, password });
      localStorage.setItem('accessToken', data.accessToken);
      setSuccess('Login successful'); // Set success message
       // Navigate to the home page
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Registration function
  const register = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null); // Clear previous success message
    try {
      const { data } = await API.post('/users/register', formData);
      setSuccess('Registration successful'); // Set success message
      return data;
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null); // Clear previous success message
    try {
      await API.post('/users/logout');
      localStorage.removeItem('accessToken');
      setSuccess('Logout successful'); // Set success message
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message || 'Failed to log out');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, register, logout, error, success, isLoading }; // Include success in the returned object
};
