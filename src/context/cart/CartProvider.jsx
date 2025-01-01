import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from 'hooks/useAuthContext';
import { useToast } from 'hooks/useToast';
import CartContext from 'context/cart/cart-context';


export const useCartContext = () => useContext(CartContext);

const initialState = {
  items: [],
  cartIsReady: false,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_CART':
      return { ...state, items: action.payload, cartIsReady: true };
    case 'CLEAR_CART':
      return { ...initialState, cartIsReady: true };
    default:
      return state;
  }
};

const CartProvider = ({ children }) => {
  const { user } = useAuthContext();
  const { sendToast } = useToast();
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    if (!user) {
      dispatch({ type: 'CLEAR_CART' });
      return;  // Correct use of return after dispatch to prevent further execution
    }
    
    const fetchCart = async () => {
      try {
        const response = await axios.get(`https://filamen.com.tn/api/orders/user/${user.id}`);
        if (response.data.items && JSON.stringify(response.data.items) !== JSON.stringify(state.items)) {
          dispatch({ type: 'UPDATE_CART', payload: response.data.items });
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        sendToast({ type: 'error', message: 'Failed to fetch cart data. Please try again later.' });
      }
    };
  
    fetchCart();
  }, [user]); // Only user in dependencies
  // Remove state.items from dependencies to avoid re-triggering useEffect

  return (
    <CartContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
