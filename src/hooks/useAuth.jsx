import { useState, useCallback } from 'react';
import API from '../API/axiosConfig';

export const useAuth = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true);
    try {
      const { data } = await API.post('/api/users/login', { email, password });
      localStorage.setItem('token', data.token); // Reevaluate this approach
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (formData) => {
    setIsLoading(true);
    try {
      const { data } = await API.post('/api/users/register', formData);
      return data;
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await API.post('/api/users/logout');
      localStorage.removeItem('token'); // Reevaluate this approach
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message || 'Failed to log out');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, register, logout, error, isLoading };
};
