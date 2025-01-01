import { createContext } from 'react';

const CartContext = createContext({
  items: [],
  cartIsReady: true,
  checkInventory: true,
});

export default CartContext;
