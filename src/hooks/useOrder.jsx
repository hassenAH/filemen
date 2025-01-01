import { useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import { useAuthContext } from './useAuthContext';
import { useCartContext } from './useCartContext';
import { useCheckoutContext } from './useCheckoutContext';
import { useCart } from './useCart';
import { useCheckout } from './useCheckout';

import { handleError } from 'helpers/error/handleError';

export const useOrder = () => {
  const { user } = useAuthContext();
  const { items } = useCartContext();
  const { email, shippingAddress, shippingOption, shippingCost } = useCheckoutContext();
  const { deleteCart } = useCart();
  const { deleteCheckoutSession } = useCheckout();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (paymentInfo, billingAddress) => {
    setIsLoading(true);
    setError(null);

    try {
      // API endpoint for creating an order
      await axios.post('/api/orders', {
        userId: user.uid,
        items,
        email,
        shippingAddress,
        shippingOption,
        shippingCost,
        paymentInfo,
        billingAddress,
        createdAt: moment().toISOString(), // Ensure backend accepts ISO string
      });

      // Delete cart and checkout session after successful order creation
      await deleteCart();
      await deleteCheckoutSession();

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to create order:', err);
      setError(handleError(err));
      setIsLoading(false);
    }
  };

  const getOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/orders/user/${user.uid}`);
      setIsLoading(false);
      return response.data.orders; // Assuming the API returns an array of orders
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(handleError(err));
      setIsLoading(false);
    }
  };

  return { createOrder, getOrders, isLoading, error };
};
