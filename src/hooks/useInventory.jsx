import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext';
import { useCartContext } from './useCartContext';
import { addAllItemsQuantity } from 'helpers/item';
import { CustomError } from 'helpers/error/customError';
import { handleError } from 'helpers/error/handleError';

export const useInventory = () => {
  const { user } = useAuthContext();
  const { dispatch } = useCartContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkInventory = async (items) => {
    setError(null);
    setIsLoading(true);

    try {
      const { data } = await axios.post('/api/inventory/check', {
        userId: user.uid,
        items: items
      });

      // Backend should handle the logic of inventory check and return updated items and any flags
      const { updatedItems, stockDifference } = data;

      if (updatedItems.length === 0) {
        dispatch({ type: 'DELETE_CART' });
      } else if (stockDifference) {
        dispatch({
          type: 'UPDATE_CART',
          payload: updatedItems
        });
      }

      if (stockDifference) {
        throw new CustomError(
          'Available stock is limited. Quantities in cart have been updated!'
        );
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Inventory check failed:', err);
      setError(handleError(err));
      setIsLoading(false);
    }
  };

  return { checkInventory, isLoading, error };
};

export default useInventory;
