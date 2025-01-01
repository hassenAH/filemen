import { useState } from 'react';
import axios from 'axios'; // Make sure to import axios or your configured API instance
import { useAuthContext } from './useAuthContext';
import { handleError } from 'helpers/error/handleError';

export const useProfile = () => {
  const { user, dispatch } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const editProfile = async ({ name, lastName, phoneNumber = null }) => {
    setError(null);
    setIsLoading(true);
    try {
      // Assuming your API endpoint for updating user profile is '/api/users/update'
      const response = await axios.put(`/api/users/update`, {
        uid: user.uid,  // Assuming backend needs UID to identify the user
        name,
        lastName,
        phoneNumber,
      });

      // Update the user context after a successful profile update
      dispatch({
        type: 'UPDATE_USER',
        payload: { name, lastName, phoneNumber },
      });

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(handleError(err)); // Make sure handleError is adapted for handling HTTP errors
      setIsLoading(false);
    }
  };

  return { editProfile, isLoading, error };
};
