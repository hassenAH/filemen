import { createContext, useContext, useReducer, useEffect } from 'react';

import { useAuthContext } from 'hooks/useAuthContext';
import CheckoutContext from 'context/checkout/checkout-context';
import API from '../../API/axiosConfig';




export const useCheckoutContext = () => useContext(CheckoutContext);

const initialState = {
  checkoutIsReady: false,
  currentStep: 1,
  email: null,
  id: null,
  shippingAddress: { id: null },
  shippingOption: { standard: false, expedited: false },
  shippingCost: 0,
};

const checkoutReducer = (state, action) => {
  switch (action.type) {
    // cases remain unchanged
    default:
      return state;
  }
};

const CheckoutProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [state, dispatch] = useReducer(checkoutReducer, {
    ...initialState,
    email: user?.email  // initialize with user email if available
  });

  useEffect(() => {
    if (!user) return; // Exit if no user

    const getCheckoutSession = async () => {
      try {
        const response = await API.get(`/checkout/${user.uid}`);
        if (response.data) {
          dispatch({
            type: 'UPDATE_CHECKOUT_SESSION',
            payload: { ...response.data, id: user.uid }
          });
        } else {
          // Create a new session if one doesn't exist
          const newSession = {
            email: user.email,
            shippingAddressId: null,
            shippingOption: { standard: false, expedited: false },
            shippingCost: 0
          };
          await axios.post(`/api/checkout/${user.uid}`, newSession);
          dispatch({
            type: 'CREATE_CHECKOUT_SESSION',
            payload: { id: user.uid, email: user.email }
          });
        }
      } catch (error) {
        console.error('Checkout session error:', error);
      }
    };

    getCheckoutSession();
  }, [user]);

  return (
    <CheckoutContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export default CheckoutProvider;
