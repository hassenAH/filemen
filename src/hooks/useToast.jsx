import { useToastContext } from 'hooks/useToastContext';

export const useToast = () => {
  const { dispatch } = useToastContext();

  const sendToast = ({ addToCart, error, success, content }) => {
    if (addToCart) {
      dispatch({ type: 'ADD_TO_CART', payload: content });
    }

    if (error) {
      dispatch({ type: 'ERROR', payload: content });
    }

    if (success) {
      dispatch({ type: 'SUCCESS', payload: content });
    }
  };

  const close = () => {
    dispatch({ type: 'CLOSE' });
  };

  return { sendToast, close };
};
