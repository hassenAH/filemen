import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext';
import { useCartContext } from './useCartContext';

import { addAllItemsQuantity } from 'helpers/item';
import { CustomError } from 'helpers/error/customError';
import { handleError } from 'helpers/error/handleError';

export const useCart = () => {
  const { user } = useAuthContext();
  const { items, dispatch } = useCartContext();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [error, setError] = useState(null);

  const addItem = async (itemToAdd) => {
    setIsLoading(true);
    setLoadingItemId(itemToAdd.skuId);
    setError(null);

    try {
      const response = await axios.post('/api/cart/add-item', {
        userId: user.uid,
        item: itemToAdd
      });

      dispatch({ type: 'UPDATE_CART', payload: response.data.items });
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to add item:', err);
      setError(handleError(err));
      setIsLoading(false);
    } finally {
      setLoadingItemId(null);
    }
  };

  const removeItem = async (skuId) => {
    setIsLoading(true);
    setLoadingItemId(skuId);
    setError(null);

    try {
      const response = await axios.post('/api/cart/remove-item', {
        userId: user.uid,
        skuId: skuId
      });

      dispatch({ type: 'UPDATE_CART', payload: response.data.items });
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to remove item:', err);
      setError(handleError(err));
      setIsLoading(false);
    } finally {
      setLoadingItemId(null);
    }
  };

  const deleteItem = async (skuId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete(`/api/cart/delete-item/${skuId}`, {
        data: { userId: user.uid }
      });

      dispatch({ type: 'UPDATE_CART', payload: response.data.items });
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to delete item:', err);
      setError({ details: err.message });
      setIsLoading(false);
    }
  };

  const deleteCart = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/cart/${user.uid}`);
      dispatch({ type: 'DELETE_CART' });
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to delete cart:', err);
      setError(handleError(err));
      setIsLoading(false);
    }
  };

  return {
    addItem,
    removeItem,
    deleteItem,
    deleteCart,
    isLoading,
    loadingItemId,
    error,
  };
};

export default useCart;
