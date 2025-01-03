import { useState } from 'react';

import { useAuthContext } from './useAuthContext';
import { handleError } from 'helpers/error/handleError';
import API from '../API/axiosConfig';
export const useProfile = () => {
  const { user, dispatch } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const editProfile = async ({ name, lastName, phoneNumber }) => {
    setError(null);
    setIsLoading(true);
    try {
      // Assuming your API endpoint for updating user profile is '/api/users/update'
      const response = await API.put(`/users/complete-profile`, {
        
        name,
        lastName,
        phoneNumber,
      });
      console.log(response.data)
      // Update the user context after a successful profile update
      dispatch({
        type: 'UPDATE_USER',
        payload: response.data.user,
      });

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(handleError(err));
      setIsLoading(false);
    }
  };

  return { editProfile, isLoading, error };
};
